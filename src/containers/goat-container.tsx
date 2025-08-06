import React, { ReactNode } from "react";

import eventHandler from "dbl-utils/event-handler";
import { deepMerge } from "dbl-utils/object-mutation";
import resolveRefs from "dbl-utils/resolve-refs";

import Goat from "../goat";
import Container, { ContainerProps, ContainerState } from "./container";

/**
 * Props for {@link GoatContainer}.
 *
 * @example
 * ```tsx
 * <GoatContainer name="sample" view={{ name: "test", component: "Component", content: "Hi" }} />
 * ```
 */
export interface GoatContainerProps extends ContainerProps {
  /** Whether the container should take the full width available. */
  fullWidth?: boolean;
  /** View schema to render using {@link Goat}. */
  view?: any;
  /** If true, children are rendered inside the generated content. */
  childrenIn?: boolean;
  /** Additional JSON schema definitions. */
  definitions?: Record<string, any>;
  /** Direct content passed to the container. */
  content?: string | any[] | object;
  /** React children to render. */
  children?: ReactNode;
}

/**
 * State for {@link GoatContainer}.
 */
export interface GoatContainerState extends ContainerState {
  [key: string]: any;
}

/** Template structure for static rendering. */
export interface ContainerTemplateSchema {
  /** Default view schema. */
  view: Record<string, any>;
  /** Optional shared definitions. */
  definitions?: Record<string, any>;
}

/**
 * Container capable of rendering a JSON schema using {@link Goat}.
 */
export default class GoatContainer<
  TProps extends GoatContainerProps = GoatContainerProps,
  TState extends GoatContainerState = GoatContainerState
> extends Container<TProps, TState> {
  static jsClass = "GoatContainer";
  static template?: ContainerTemplateSchema | null = {
    view: {},
    definitions: {},
  };

  static defaultProps: Partial<GoatContainerProps> = {
    ...Container.defaultProps,
    fullWidth: true,
    view: null,
    childrenIn: false,
    definitions: {},
  };

  protected events: [string, (...args: any[]) => void][] = [];
  protected goat: Goat;
  protected templateSolved: any;

  constructor(props: TProps) {
    super(props);
    this.state = this.state as TState;
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
    this.events.forEach(([evtName, callback]) =>
      eventHandler.subscribe(evtName, callback, this.name)
    );
    this.evalTemplate();
  }

  /**
   * Resolves the template with provided definitions and view overrides.
   */
  evalTemplate() {
    const definitions = deepMerge(
      this.theTemplate?.definitions || {},
      this.props.definitions || {}
    );

    this.templateSolved = this.props.view
      ? resolveRefs(this.props.view, {
          template: this.theView,
          definitions,
          props: this.props,
          state: this.state,
        })
      : resolveRefs(this.theView, {
          definitions,
          props: this.props,
          state: this.state,
        });
  }

  componentWillUnmount(): void {
    super.componentWillUnmount();
    this.events.forEach(([eName]) =>
      eventHandler.unsubscribe(eName, this.name)
    );
  }

  mutations(sectionName: string, section: any): any {
    return this.state[sectionName];
  }

  /**
   * Builds content using {@link Goat} and optionally renders children inside.
   */
  content(children = this.props.children): any {
    if (!(this.breakpoint && this.templateSolved)) return this.waitBreakpoint;

    const builded = this.goat.buildContent(this.templateSolved);
    return !this.childrenIn ? (
      <>
        {builded}
        {children}
      </>
    ) : (
      builded
    );
  }
}
