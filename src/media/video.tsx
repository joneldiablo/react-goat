import React from "react";
import Component, { ComponentProps } from "../component";

/**
 * Props for {@link Video}.
 */
interface VideoProps extends ComponentProps {
  /** Autoplay flag. */
  autoPlay?: boolean;
  /** Display controls. */
  controls?: boolean;
  /** Video height. */
  height?: number | string;
  /** Loop playback. */
  loop?: boolean;
  /** Mute audio. */
  muted?: boolean;
  /** Inline playback on iOS. */
  playsInline?: boolean;
  /** Poster frame image. */
  poster?: string;
  /** Preload strategy. */
  preload?: "none" | "metadata" | "auto" | true;
  /** Video source URL. */
  src?: string;
  /** Video width. */
  width?: number | string;
  /** Fallback sources when `src` is undefined. */
  sources?: { src: string; type?: string }[] | { src: string; type?: string };
}

/**
 * HTML5 video wrapper with optional source list.
 *
 * @example
 * ```tsx
 * <Video src="video.mp4" controls />
 * ```
 */
export default class Video extends Component<VideoProps> {
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

  protected content(children: React.ReactNode = this.props.children): React.ReactNode {
    if (this.props.src) return false;
    const sources = Array.isArray(this.props.sources) ? this.props.sources : [this.props.sources];

    return sources.map((s, i) => (s ? <source key={i} src={s.src} type={s.type} /> : null));
  }
}
