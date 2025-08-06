import React, { ReactNode } from "react";
import { Location } from "react-router-dom";
import GoatContainer, { GoatContainerProps, GoatContainerState } from "../containers/goat-container";

/**
 * Props for {@link Controller}.
 *
 * @example
 * ```tsx
 * <Controller name="main" test routesIn="/home" />
 * ```
 */
export interface ControllerProps extends GoatContainerProps {
  /** Optional flag used in tests to toggle wrapper classes. */
  test?: boolean;
  /** Nested route container key. */
  routesIn?: string;
  /** Current router location, used to trigger rerenders on navigation. */
  location?: Location;
  /** Allow inheriting arbitrary props from {@link GoatContainer}. */
  [key: string]: any;
}

/** State maintained by {@link Controller}. */
export interface ControllerState extends GoatContainerState {
  /** Local CSS classes applied to the wrapper element. */
  localClasses: string;
}

/**
 * Default view component that renders an `<article>` wrapper and
 * synchronizes some routing-related props.
 */
export default class Controller<
  TProps extends ControllerProps = ControllerProps,
  TState extends ControllerState = ControllerState
> extends GoatContainer<TProps, TState> {
  static jsClass = "Controller";
  static defaultProps: Partial<ControllerProps> = {
    ...GoatContainer.defaultProps,
    test: false,
  };
  static template = null;

  constructor(props: TProps) {
    super(props);
    this.tag = "article";
    Object.assign(this.state, {
      localClasses: this.props.test ? "test-view-wrapper" : "",
    });
  }

  /** Props exposed to child routes. */
  get fixedProps(): TProps {
    return {
      ...this.props,
      childrenIn: this.props.routesIn,
    } as TProps;
  }

  /** Route container key to mount nested views. */
  get childrenIn(): string | boolean {
    return this.props.routesIn || super.childrenIn;
  }

  /** Content provided to the controller. */
  get theView(): any {
    return this.props.content || super.theView;
  }

  /**
   * Sync wrapper classes and force rerenders when the location changes.
   */
  componentDidUpdate(prevProps: TProps) {
    if (this.props.location?.pathname !== prevProps.location?.pathname) {
      this.forceUpdate();
    }

    if (prevProps.test !== this.props.test) {
      const { localClasses } = this.state;
      const setClasses = new Set(localClasses.split(" "));

      if (this.props.test) {
        setClasses.add("test-view-wrapper");
      } else {
        setClasses.delete("test-view-wrapper");
      }

      this.setState({
        localClasses: [...setClasses].join(" "),
      });
    }
  }
}
