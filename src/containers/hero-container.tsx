import React from "react";
import type { SwiperModule } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import { deepMerge } from "dbl-utils";
import Container, { ContainerProps } from "./container";

export interface HeroContainerProps extends ContainerProps {
  spaceBetween?: number;
  slidesPerView?: number;
  autoplayDelay?: number;
  swiperProps?: Record<string, any>;
}

const swiperModulesToUse: SwiperModule[] = [Autoplay];
export const addSwiperModules = (swiperModules: SwiperModule[]) => {
  swiperModulesToUse.push(...swiperModules);
}

export default class HeroContainer<TProps extends HeroContainerProps = HeroContainerProps> extends Container<TProps> {
  static jsClass = "HeroContainer";

  static defaultProps = {
    ...Container.defaultProps,
    spaceBetween: 0,
    slidesPerView: 1,
  };

  onSlideChange = () => {
    // console.log("Slide changed!");
  };

  onSwiper = (swipe: any) => {
    // console.log(swipe);
  };

  content(children = this.props.children) {
    if (!this.breakpoint) return this.waitBreakpoint;

    const { spaceBetween, slidesPerView, autoplayDelay, swiperProps } = this.props;
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
        {Array.isArray(children) && children.map((child, i) => {
          if (!child) return null;

          const props = (
            child.props?.style?.["--component-name"] ? child.props.children : child
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
}
