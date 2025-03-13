import React from "react";
import Component, { ComponentProps } from "../component";
import { splitAndFlat } from "dbl-utils";

// Define the ObjectFit type with possible CSS values.
type ObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

export interface ImageProps extends ComponentProps {
  src?: string | Record<string, string>;
  alt?: string;
  width?: number | string;
  height?: number | string;
  objectFit?: ObjectFit;
  objectPosition?: string;
  imageClasses?: string | string[];
  contentProps?: Record<string, any>;
}

export default class Image extends Component<ImageProps> {
  static jsClass = "Image";

  static defaultProps: Partial<ImageProps> = {
    ...Component.defaultProps,
    objectFit: "cover",
    objectPosition: "center",
    imageClasses: "",
    width: "100%",
    style: {
      overflow: "hidden",
    },
  };

  protected tag: keyof React.JSX.IntrinsicElements = "figure";
  protected classes: string = "";

  protected content(): React.ReactNode {
    const { src, alt, children, width, height, objectFit, objectPosition, imageClasses, contentProps } = this.props;
    
    let imgSrc = typeof src === "object" ? src.default || "" : src || "";

    return (
      <>
        <picture>
          {src && typeof src === "object" &&
            Object.keys(src).map((min) => (
              <source key={min} srcSet={src[min]} media={`(min-width: ${min}px)`} />
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
