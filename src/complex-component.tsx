import React from "react";
import { resolveRefs, eventHandler } from "dbl-utils";

import Goat from "./goat";
import Component, { ComponentProps, ComponentState } from "./component";

/**
 * Minimal schema accepted by {@link ComplexComponent}.
 */
export interface BasicSchemaType {
  /** View definition to render. */
  view: any;
  /** Shared definitions for resolving references. */
  definitions?: Record<string, any>;
  /** Arbitrary data passed along with the schema. */
  data?: any;
}

/**
 * Props for {@link ComplexComponent}.
 */
export interface ComplexComponentProps extends ComponentProps {
  /** JSON schema to render. */
  schema?: BasicSchemaType;
  /** Extra definitions merged into the schema. */
  definitions?: Record<string, any>;
  /** Optional rules for `resolveRefs`. */
  rules?: Record<string, any>;
  /** When true, children are rendered inside the content. */
  childrenIn?: boolean;
}

/**
 * State for {@link ComplexComponent}.
 */
export interface ComplexComponentState extends ComponentState {
  /** Resolved view schema. */
  view: any;
}

/**
 * Utility to create `$name*` helpers for schema definitions.
 */
export const nameSuffixes = (sfxs: string[] = []): Record<string, any> => {
  return sfxs.reduce<Record<string, any>>((acum, item) => {
    acum[`$name${item}`] = ["join", ["$data/name", item], ""];
    return acum;
  }, {});
};

const schemaDefault: BasicSchemaType = {
  view: { name: "$nameDummy", content: "Replace this" },
  definitions: {},
};

/**
 * Component capable of rendering a JSON schema using {@link Goat}.
 */
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

  /**
   * Builds a resolved view based on the provided schema and rules.
   */
  buildView(): any {
    const { schema = schemaDefault, rules, definitions, ...all } = this.props;
    schema.data = all;
    Object.assign(schema.definitions!, definitions);
    return resolveRefs(schema.view, schema, rules);
  }

  mutations(sn: string, conf: Record<string, any>): any {
    return (this.state as any)[sn];
  }

  /**
   * Renders the resolved schema and optionally appends children.
   */
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
