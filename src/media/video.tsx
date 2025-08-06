import React from "react";

import Component, { ComponentProps, ComponentState } from "../component";

export interface VideoProps extends ComponentProps {
  autoPlay?: boolean;
  controls?: boolean;
  height?: number | string;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  poster?: string;
  preload?: "none" | "metadata" | "auto" | true;
  src?: string;
  width?: number | string;
  sources?: { src: string; type?: string }[] | { src: string; type?: string };
}

export interface VideoState extends ComponentState {}

export default class Video<
  TProps extends VideoProps = VideoProps,
  TState extends VideoState = VideoState
> extends Component<TProps, TState> {
  static jsClass = "Video";

  protected tag: keyof React.JSX.IntrinsicElements = "video";

  protected get componentProps(): Record<string, any> {
    const {
      autoPlay,
      controls,
      height,
      loop,
      muted,
      playsInline,
      poster,
      preload,
      src,
      width,
    } = this.props;
    return {
      autoPlay,
      controls,
      height,
      loop,
      muted,
      playsInline,
      poster,
      preload,
      src,
      width,
      ...this.props._props,
    };
  }

  protected content(
    children: React.ReactNode = this.props.children
  ): React.ReactNode {
    if (this.props.src) return false;
    const sources = Array.isArray(this.props.sources)
      ? this.props.sources
      : [this.props.sources];

    return sources.map((s, i) =>
      s ? <source key={i} src={s.src} type={s.type} /> : null
    );
  }
}
