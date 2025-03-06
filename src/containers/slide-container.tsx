import React from "react";
import { Splide, SplideSlide, SplideProps } from '@splidejs/react-splide';

import Container, { ContainerProps, ContainerState } from "./container";

export interface SlideContainerProps extends ContainerProps {
  slider?: SplideProps;
}

export interface SlideContainerState extends ContainerState { }

/**
 * SlideContainer Component
 * 
 * Extends Container to render children inside a Splide slider.
 */
export default class SlideContainer<
  TProps extends SlideContainerProps = SlideContainerProps,
  TState extends SlideContainerState = SlideContainerState
> extends Container<TProps, TState> {

  static jsClass = 'SlideContainer';

  static defaultProps: Partial<SlideContainerProps> = {
    ...Container.defaultProps,
    fullWidth: true,
    slider: {
      options: {
        perPage: 1,
        rewind: true,
      },
    },
  };

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    const attrs: SplideProps = this.props.slider || {};
    const arrChildren = React.Children.toArray(children);

    if (arrChildren.length <= (attrs.options?.perPage || 1)) {
      Object.assign(attrs.options || {}, {
        arrows: false,
        pagination: false,
        drag: false,
      });
    }

    const mapSlides = ([i, c]: [number, React.ReactNode]) =>
      !!c && <SplideSlide key={i}>{c}</SplideSlide>;

    return super.content(
      <Splide
        {...attrs}
        destroy="completely"
        key={`${this.name};perPage=${attrs.options?.perPage}`}
      >
        {arrChildren.map((child, index) => mapSlides([index, child]))}
      </Splide>
    );
  }
}