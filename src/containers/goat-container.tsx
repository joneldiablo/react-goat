import React, { ReactNode } from "react";

import { eventHandler, resolveRefs, deepMerge } from "dbl-utils";

import Goat from "../goat";
import Container, { ContainerProps, ContainerState } from "./container";

export interface GoatContainerProps extends ContainerProps {
  fullWidth?: boolean;
  view?: any;
  childrenIn?: boolean;
  definitions?: Record<string, any>;
  content?: string | any[] | object;
  children?: ReactNode;
}

export interface GoatContainerState extends ContainerState {
  [key: string]: any;
}

export interface TemplateSchema {
  view: Record<string, any>,
  definitions?: Record<string, any>
};

export default class GoatContainer<
  TProps extends GoatContainerProps = GoatContainerProps,
  TState extends GoatContainerState = GoatContainerState
> extends Container<TProps, TState> {
  static jsClass = "GoatContainer";
  static template?: TemplateSchema | null = {
    view: {},
    definitions: {}
  };

  static defaultProps: Partial<GoatContainerProps> = {
    ...Container.defaultProps,
    fullWidth: true,
    view: null,
    childrenIn: false,
    definitions: {}
  };

  protected events: [string, (...args: any[]) => void][] = [];
  protected goat: Goat;
  protected templateSolved: any;

  constructor(props: TProps) {
    super(props);
    this.tag = "div";
    Object.assign(this.state, {});
    this.goat = new Goat(this.fixedProps, this.mutations.bind(this));
  }

  get fixedProps(): TProps {
    return this.props;
  }

  get childrenIn(): string | boolean {
    return this.props.childrenIn ?? false;
  }

  get theView(): any {
    return (this.constructor as typeof GoatContainer).template?.view;
  }

  get theTemplate(): any {
    return (this.constructor as typeof GoatContainer).template || {};
  }

  componentDidMount(): void {
    super.componentDidMount();
    this.events.forEach(([evtName, callback]) => eventHandler.subscribe(evtName, callback, this.name));
    const definitions = deepMerge(
      this.theTemplate?.definitions || {},
      this.props.definitions || {}
    );

    this.templateSolved = this.props.view
      ? resolveRefs(this.props.view, {
        template: this.theView,
        definitions,
        props: this.props,
        state: this.state
      })
      : resolveRefs(this.theView, {
        definitions,
        props: this.props,
        state: this.state
      });
  }

  componentWillUnmount(): void {
    super.componentWillUnmount();
    this.events.forEach(([eName]) => eventHandler.unsubscribe(eName, this.name));
  }

  mutations(sectionName: string, section: any): any {
    return this.state[sectionName];
  }

  content(children: ReactNode = this.props.children): ReactNode {
    if (!(this.breakpoint && this.templateSolved)) return this.waitBreakpoint;

    const builded = this.goat.buildContent(this.templateSolved);
    return !this.childrenIn
      ? <>
        {builded}
        {children}
      </>
      : builded;
  }
}
