import React from "react";
import Component, { ComponentProps } from "../component";
import { splitAndFlat } from "dbl-utils/utils";

// Supported CSS object-fit values.
type ObjectFit = "cover" | "contain" | "fill" | "none" | "scale-down";

/**
 * Props for {@link Image}.
 */
export interface ImageProps extends ComponentProps {
  /** Image source or responsive sources. */
  src?: string | Record<string, string>;
  /** Alternative text for the image. */
  alt?: string;
  /** Image width. */
  width?: number | string;
  /** Image height. */
  height?: number | string;
  /** CSS object-fit value. */
  objectFit?: ObjectFit;
  /** CSS object-position value. */
  objectPosition?: string;
  /** Additional classes applied to the `<img>` element. */
  imageClasses?: string | string[];
  /** Additional props for the `<figcaption>` element. */
  contentProps?: Record<string, any>;
}

/**
 * Displays an image within a `<figure>` wrapper.
 *
 * @example
 * ```tsx
 * import Image from "./media/image";
 *
 * <Image src="/hero.png" alt="Hero" />
 * ```
 */
export default class Image extends Component<ImageProps> {
  static jsClass = "Image";

  static defaultProps: Partial<ImageProps> = {
    ...Component.defaultProps,
    objectFit: "cover",
    objectPosition: "center",
    imageClasses: "",
    style: {
      overflow: "hidden",
    },
  };

  protected tag: keyof React.JSX.IntrinsicElements = "figure";
  protected classes = "position-relative";

  protected content(): React.ReactNode {
    const { src, alt, children, width, height, objectFit, objectPosition, imageClasses, contentProps } = this.props;

    let imgSrc = typeof src === "object" ? src.default || "" : src || "";
    const responsive =
      src && typeof src === "object" ? { ...src, default: undefined } : undefined;

    return (
      <>
        <picture>
          {responsive &&
            Object.keys(responsive)
              .filter((k) => responsive[k])
              .map((min) => (
                <source key={min} srcSet={responsive[min]!} media={`(min-width: ${min}px)`} />
              ))}
          <img
            src={imgSrc}
            alt={alt}
            width={width}
            height={height}
            style={{ objectFit, objectPosition }}
            className={splitAndFlat([imageClasses], " ").join(" ")}
          />
        </picture>
        <figcaption {...contentProps}>{children}</figcaption>
      </>
    );
  }
}
