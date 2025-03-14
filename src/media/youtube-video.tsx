import React from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import Component, { ComponentProps } from "../component";
import AspectRatioContainer from "../containers/proportional-container";
import { splitAndFlat } from "dbl-utils/utils";

interface YoutubeVideoComponentProps extends ComponentProps, YouTubeProps {
  ratio?: number;
  youtubeOpts?: {
    autoPlay?: 0 | 1 | "0" | "1";
    cc_load_policy?: 1 | "1";
    color?: string;
    controls?: 0 | 1 | 2 | "0" | "1" | "2";
    disablekb?: 0 | 1 | "0" | "1";
    enablejsapi?: string;
    end?: number;
    fs?: string;
    hl?: string;
    iv_load_policy?: string;
    list?: string;
    listType?: string;
    loop?: string;
    modestbranding?: string;
    origin?: string;
    playlist?: string;
    playsInline?: string;
    rel?: string;
    showinfo?: string;
    start?: string;
  };
  videoId: string;
  className?: string;
  ytbClasses?: string;
  ytbContainerClasses?: string;
  containerClasses?: string;
}

export default class YoutubeVideoComponent extends Component<YoutubeVideoComponentProps> {
  static jsClass = "YoutubeVideoComponent";

  static defaultProps: Partial<YoutubeVideoComponentProps> = {
    ...Component.defaultProps,
    ratio: 2 / 3,
  };

  protected content(children: React.ReactNode = this.props.children): React.ReactNode {
    const {
      name,
      ratio,
      overflow,
      youtubeOpts,
      videoId,
      ytbClasses,
      ytbContainerClasses,
      containerClasses,
      onReady,
      onPlay,
      onPause,
      onEnd,
      onError,
      onStateChange,
      onPlaybackRateChange,
      onPlaybackQualityChange,
    } = this.props;

    const propsYoutube: YouTubeProps = {
      videoId,
      id: videoId,
      className: ytbClasses,
      iframeClassName: splitAndFlat(["h-100 w-100", ytbContainerClasses], ' ').join(" "),
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
      <AspectRatioContainer name={'ratio-' + name} ratio={ratio} overflow={overflow} innerClasses={containerClasses} fullWidth>
        {videoId && <YouTube {...propsYoutube} />}
        {children}
      </AspectRatioContainer>
    );
  }
}
