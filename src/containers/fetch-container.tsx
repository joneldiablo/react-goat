import React from "react";

import Component, { ComponentProps, ComponentState } from "../component";

export interface FetchContainerProps extends ComponentProps {
  /** URL to request HTML content from. */
  url: string;
  /** Additional options passed to the `fetch` call. */
  fetchProps?: RequestInit;
}

interface FetchContainerState extends ComponentState {
  fetchContent?: string;
}

/**
 * Fetches arbitrary HTML and injects it into the component's content area.
 *
 * @example
 * ```tsx
 * <FetchContainer name="terms" url="/terms.html" />
 * ```
 */
export default class FetchContainer<
  TProps extends FetchContainerProps = FetchContainerProps,
  TState extends FetchContainerState = FetchContainerState
> extends Component<TProps, TState> {
  static jsClass = "FetchContainer";

  componentDidMount() {
    this.fetch();
  }

  private async fetch() {
    const { url, fetchProps } = this.props;
    const r = await fetch(url, fetchProps).then((res) => res.text());
    this.setState({ fetchContent: r });
  }

  content(children = this.props.children) {
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: this.state.fetchContent ?? "" }} />
        {children}
      </>
    );
  }
}
