import React from "react";
import { Options as YTOptions } from "youtube-player/dist/types";
import YouTube, { YouTubeProps } from "react-youtube";

import { splitAndFlat } from "dbl-utils/utils";

import Component, { ComponentProps, ComponentState } from "../component";
import AspectRatioContainer, {
  ProportionalContainerProps,
} from "../containers/proportional-container";

export interface YoutubeVideoComponentProps
  extends ComponentProps,
    YouTubeProps {
  youtubeOpts?: YTOptions["playerVars"];
  ratio?: ProportionalContainerProps["ratio"];
  overflow?: ProportionalContainerProps["overflow"];
  containerClasses?: ProportionalContainerProps["containerClasses"];
  videoId: string;
  className?: string;
  ytbClasses?: string;
  ytbContainerClasses?: string;
}
export interface YoutubeVideoComponentState extends ComponentState {}

export default class YoutubeVideoComponent<
  TProps extends YoutubeVideoComponentProps = YoutubeVideoComponentProps,
  TState extends YoutubeVideoComponentState = YoutubeVideoComponentState
> extends Component<TProps, TState> {
  static jsClass = "YoutubeVideoComponent";

  static defaultProps: Partial<YoutubeVideoComponentProps> = {
    ...Component.defaultProps,
    ratio: 2 / 3,
  };

  constructor(props: TProps) {
    super(props);
    this.state = this.state as TState;
  }

  protected content(children = this.props.children) {
    const {
      name,
      containerClasses,
      ytbContainerClasses,
      ytbClasses,
      overflow,
      ratio,
      videoId,
      youtubeOpts,
      onReady,
      onPlay,
      onPause,
      onEnd,
      onError,
      onStateChange,
      onPlaybackRateChange,
      onPlaybackQualityChange,
    } = this.props as TProps;

    const propsYoutube: YouTubeProps = {
      videoId,
      id: videoId,
      className: ytbClasses,
      iframeClassName: splitAndFlat(
        ["h-100 w-100", ytbContainerClasses],
        " "
      ).join(" "),
      onReady,
      onPlay,
      onPause,
      onEnd,
      onError,
      onStateChange,
      onPlaybackRateChange,
      onPlaybackQualityChange,
      opts: {
        height: "100%",
        width: "100%",
        playerVars: youtubeOpts,
      },
    };

    return (
      <AspectRatioContainer
        name={"ratio-" + name}
        ratio={ratio}
        overflow={overflow}
        innerClasses={containerClasses}
      >
        {videoId && <YouTube {...propsYoutube} />}
        {children}
      </AspectRatioContainer>
    );
  }
}
