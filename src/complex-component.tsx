import React from "react";
import { resolveRefs, eventHandler } from "dbl-utils";

import Goat from "./goat";
import Component, { ComponentProps, ComponentState } from "./component";

export interface BasicSchemaType {
  view: any;
  definitions?: Record<string, any>;
  data?: any;
}

export interface ComplexComponentProps extends ComponentProps {
  schema?: BasicSchemaType;
  definitions?: Record<string, any>;
  rules?: Record<string, any>;
  childrenIn?: boolean;
}

export interface ComplexComponentState extends ComponentState {
  view: any;
}

export const nameSuffixes = (sfxs: string[] = []): Record<string, any> => {
  return sfxs.reduce<Record<string, any>>((acum, item) => {
    acum[`$name${item}`] = ["join", ["$data/name", item], ""];
    return acum;
  }, {});
};

const schemaDefault: BasicSchemaType = {
  view: { name: "$nameDummy", content: "Remplazar esto" },
  definitions: {},
};

export default class ComplexComponent<
  TProps extends ComplexComponentProps = ComplexComponentProps,
  TState extends ComplexComponentState = ComplexComponentState
> extends Component<TProps, TState> {
  static jsClass = "Complex";
  static defaultProps: Partial<ComplexComponentProps> = {
    ...Component.defaultProps,
    schema: schemaDefault,
    definitions: {},
    classes: { ".": "" },
    rules: {},
  };

  protected events: [string, (...args: any[]) => void][] = [];
  protected goat: Goat;

  constructor(props: TProps) {
    super(props);
    this.goat = new Goat(props, this.mutations.bind(this));
    Object.assign(this.state, {
      view: this.buildView(),
    });
  }

  componentDidMount(): void {
    this.events.forEach((e) => eventHandler.subscribe(...e, this.name));
  }

  componentWillUnmount(): void {
    this.events.forEach(([eName]) =>
      eventHandler.unsubscribe(eName, this.name)
    );
  }

  buildView(): any {
    const { schema = schemaDefault, rules, definitions, ...all } = this.props;
    schema.data = all;
    Object.assign(schema.definitions!, definitions);
    return resolveRefs(schema.view, schema, rules);
  }

  mutations(sn: string, conf: Record<string, any>): any {
    return (this.state as any)[sn];
  }

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    const { childrenIn } = this.props;
    const content = this.goat.buildContent(this.state.view);
    return (
      <>
        {content}
        {!childrenIn && children}
      </>
    );
  }
}
