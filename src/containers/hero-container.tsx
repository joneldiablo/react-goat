import React, { createRef } from "react";
import type {
  Swiper as SwiperClass,
  SwiperModule,
  SwiperOptions,
} from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import { deepMerge } from "dbl-utils/object-mutation";
import Container, { ContainerProps, ContainerState } from "./container";
import { eventHandler } from "dbl-utils";

export interface HeroContainerProps extends ContainerProps {
  spaceBetween?: number;
  slidesPerView?: number;
  autoplayDelay?: number;
  swiperProps?: SwiperOptions;
}

export interface HeroContainerState extends ContainerState {}

const swiperModulesToUse: SwiperModule[] = [Autoplay];
export const addSwiperModules = (swiperModules: SwiperModule[]) => {
  swiperModulesToUse.push(...swiperModules);
};

export default class HeroContainer<
  TProps extends HeroContainerProps = HeroContainerProps,
  TState extends HeroContainerState = HeroContainerState
> extends Container<TProps, TState> {
  static jsClass = "HeroContainer";

  static defaultProps = {
    ...Container.defaultProps,
    spaceBetween: 0,
    slidesPerView: 1,
  };

  private swipeRef;

  constructor(props: TProps) {
    super(props);
    this.state = this.state as TState;
    this.swipeRef = createRef<SwiperClass>();
  }

  onSlideChange = (slideData: any) => {
    eventHandler.dispatch(`change.${this.props.name}`, {
      [this.props.name]: slideData,
    });
    // console.log("Slide changed!");
  };

  onSwiper = (swipe: any) => {
    this.swipeRef.current = swipe;
    eventHandler.dispatch(`ready.${this.props.name}`, swipe);
    // console.log(swipe);
  };

  content(children = this.props.children) {
    if (!this.breakpoint) return this.waitBreakpoint;

    const { spaceBetween, slidesPerView, autoplayDelay, swiperProps } =
      this.props;
    let propsSwiper: Record<string, any> = {
      spaceBetween,
      slidesPerView,
      modules: swiperModulesToUse,
      autoplay: {
        delay: autoplayDelay || 6000,
        disableOnInteraction: false,
      },
      onSlideChange: this.onSlideChange,
      onSwiper: this.onSwiper,
    };

    if (React.Children.count(children) < 2) {
      Object.assign(propsSwiper, {
        resistance: true,
        resistanceRatio: 0,
      });
    }

    if (typeof swiperProps === "object") {
      deepMerge(propsSwiper, swiperProps);
    }

    return (
      <Swiper {...propsSwiper}>
        {...[children].flat().map((child: any, i: number) => {
          if (!child) return null;

          const props = (
            child.props?.style?.["--component-name"]
              ? child.props.children
              : child
          )?.props;

          return (
            <SwiperSlide
              key={i}
              virtualIndex={i}
              style={{
                backgroundImage: `url("${props.image}")`,
                backgroundAttachment: props.imageAttachment,
              }}
            >
              {child}
            </SwiperSlide>
          );
        })}
      </Swiper>
    );
  }

  render() {
    const r = super.render();
    clearTimeout(this.ready);
    return r;
  }
}
