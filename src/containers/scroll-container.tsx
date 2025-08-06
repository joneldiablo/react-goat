import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";

import { eventHandler, splitAndFlat } from "dbl-utils";

import useEventHandler from "../hooks/use-event-handler";
import Container, { ContainerProps, ContainerState } from "./container";

export interface ScrollContainerProps extends ContainerProps {
  scrollTrackClasses?: string[];
  scrollBarClasses?: string[];
  scrollTrackStyle?: React.CSSProperties;
  scrollBarStyle?: React.CSSProperties;
}

export interface ScrollContainerState extends ContainerState {}

export interface ScrollXNodeProps extends ScrollContainerProps {
  breakpoint?: string;
  orientation?: string;
  width?: number;
  height?: number;
}

let timeoutDispatchPosition: NodeJS.Timeout;

function ScrollXNode({
  name,
  scrollTrackClasses = [],
  scrollBarClasses = [],
  scrollTrackStyle = {},
  scrollBarStyle = {},
  breakpoint,
  orientation,
  width,
  height,
  children,
}: ScrollXNodeProps) {
  const scrollBarPosition = useCallback((percentagePosition: number) => {
    if (!(scrollTrackRef.current && scrollBarRef.current)) return;
    const scrollBarrPercentage =
      percentagePosition *
      (scrollTrackRef.current.clientWidth - scrollBarRef.current.clientWidth);
    setScrollBarLeft(scrollBarrPercentage / scrollTrackRef.current.clientWidth);
  }, []);

  const containerPosition = useCallback((step: number) => {
    const newTranslate = Math.min(
      Math.max(initialTranslate.current + step, -diffContentWidth),
      0
    );
    initialTranslate.current = newTranslate;
    const newPercentage = Math.abs(newTranslate / diffContentWidth);
    setPercentage(newPercentage);
    setTranslate(newTranslate);
    scrollBarPosition(newPercentage);
    clearTimeout(timeoutDispatchPosition);
    timeoutDispatchPosition = setTimeout(() => {
      eventHandler.dispatch(name, {
        [name]: {
          position: Math.abs(newTranslate),
          percentage: newPercentage,
          size: diffContentWidth,
        },
      });
    }, 660);
  }, []);

  const updateScroll = useCallback(
    (update: { position?: number; percentage?: number; resize?: boolean }) => {
      if (update.position !== undefined) {
        initialTranslate.current = 0;
        containerPosition(update.position);
      }
      if (update.percentage !== undefined) {
        initialTranslate.current = 0;
        const position = -update.percentage * diffContentWidth;
        containerPosition(position);
      }
      if (update.resize) {
        const container = containerRef.current;
        const newContentWidth = container!.scrollWidth;
        const newDiffContentWidth =
          container!.scrollWidth - container!.clientWidth;

        setContentWidth(newContentWidth);
        setDiffContentWidth(newDiffContentWidth);

        initialTranslate.current = 0;
        const position = -percentage * newDiffContentWidth;
        containerPosition(position);
      }
    },
    []
  );

  const handleScroll = useCallback(() => {
    if (!scrollTrackRef.current) return;
    const container = containerRef.current;
    const scrollLeft = container!.scrollLeft;
    const scrollBarPosition =
      (scrollLeft / diffContentWidth) *
      (scrollTrackRef.current.clientWidth - scrollBarRef.current!.clientWidth);
    setScrollBarLeft(scrollBarPosition / scrollTrackRef.current.clientWidth);
  }, []);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      let speed = event.deltaX;
      if (speed === 0 && event.shiftKey) {
        event.preventDefault();
        speed = -event.deltaY / Math.abs(event.deltaY);
      }
      speed *= 10;

      const container = containerRef.current;
      if (!container) return;

      const containerRatio = container.scrollWidth / container.clientWidth;
      containerPosition(speed * containerRatio);
    },
    [containerPosition]
  );

  const handleDrag = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const posValue =
        (e as MouseEvent).clientX || (e as TouchEvent).touches
          ? (e as TouchEvent).touches[0].clientX
          : 0;
      const initialValue = initialMouseX.current;
      if (!containerRef.current || posValue === 0) return;
      if (Math.abs(posValue - initialValue) < 40) return;

      const barPercent =
        scrollBarRef.current!.clientWidth / scrollTrackRef.current!.clientWidth;
      const deltaX = (posValue - initialValue) * barPercent;
      containerPosition(-deltaX);
    },
    [containerPosition]
  );

  const handleDragEnd = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      containerRef.current!.addEventListener("scroll", handleScroll);
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("touchmove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchend", handleDragEnd);
      initialMouseX.current = 0;
      initialScrollLeft.current = 0;
    },
    [handleScroll, handleDrag]
  );

  const handleDragStart = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const initialPosValue =
        (e as MouseEvent).clientX || (e as TouchEvent).touches
          ? (e as TouchEvent).touches[0].clientX
          : 0;
      containerRef.current!.removeEventListener("scroll", handleScroll);

      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("touchmove", handleDrag);
      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("touchend", handleDragEnd);
      initialMouseX.current = initialPosValue;
      initialScrollLeft.current = scrollBarLeft;
    },
    [handleDrag, handleDragEnd, handleScroll]
  );

  const handleTouchStart = useCallback((e: TouchEvent) => {
    initialTouchX.current = e.touches[0].clientX;
    setIsTouching(true);
  }, []);

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      const vector = event.touches[0].clientX - initialTouchX.current;
      initialTouchX.current = event.touches[0].clientX;
      containerPosition(vector);
    },
    [containerPosition]
  );

  const handleTouchEnd = useCallback(() => {
    setIsTouching(false);
  }, []);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollTrackRef = useRef<HTMLDivElement | null>(null);
  const scrollBarRef = useRef<HTMLDivElement | null>(null);
  const initialMouseX = useRef<number>(0);
  const initialScrollLeft = useRef<number>(0);
  const initialTouchX = useRef<number>(0);
  const initialTranslate = useRef(0);

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [scrollBarLeft, setScrollBarLeft] = useState(0);
  const [wScrollBar, setWScrollBar] = useState(0);
  const [showBar, setShowBar] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);
  const [diffContentWidth, setDiffContentWidth] = useState(0);
  const [translate, setTranslate] = useState(initialTranslate.current);
  const [percentage, setPercentage] = useState(initialTranslate.current);

  useEventHandler(
    [[`update.${name}`, updateScroll]],
    [name, ScrollContainer.jsClass].join("-")
  );

  useLayoutEffect(() => {
    setIsTouchDevice("ontouchstart" in window);
    setScrollBarLeft(0);
    setTranslate(0);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const contentWidth = container.scrollWidth;
      const containerWidth = container.clientWidth;
      const diffContentWidth = container.scrollWidth - container.clientWidth;

      const isContentOverflowing = contentWidth > containerWidth;
      setShowBar(isContentOverflowing && (!isTouchDevice || isTouching));
      setContentWidth(contentWidth);
      setDiffContentWidth(diffContentWidth);

      const wp = (containerWidth / contentWidth) * 100;
      setWScrollBar(Math.max(Math.min(wp, 90), 20));
      eventHandler.dispatch(name, {
        [name]: {
          position: Math.abs(initialTranslate.current),
          percentage: Math.abs(initialTranslate.current / diffContentWidth),
          size: diffContentWidth,
        },
      });
    }
  }, [
    contentWidth,
    breakpoint,
    orientation,
    width,
    height,
    isTouchDevice,
    isTouching,
  ]);

  useEffect(() => {
    const container = containerRef.current!;
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchend", handleTouchEnd);
    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [contentWidth, handleTouchEnd, handleTouchMove, handleTouchStart]);

  useEffect(() => {
    const container = containerRef.current!;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [wScrollBar, contentWidth]);

  const stc = [scrollTrackClasses];
  const sbc: string | string[] | string[][] | (string | string[])[] = [
    "cursor-pointer",
    scrollBarClasses,
  ];
  const fc = (input: string[] | string | string[][] | (string | string[])[]) =>
    splitAndFlat([input], " ").join(" ");

  const styleSbc = {
    height: "100%",
    backgroundColor: "#888",
    ...scrollBarStyle,
    width: `${wScrollBar}%`,
    marginLeft: `${scrollBarLeft * 100}%`,
  };

  return (
    <>
      <div
        style={{
          overflowX: "clip",
        }}
      >
        <div
          ref={containerRef}
          id={`${name}-container`}
          style={
            {
              paddingBottom: "2rem",
              marginBottom: "-2rem",
              transform: `translate(${translate}px)`,
              "--dbl-scroll-x-position": `${Math.abs(translate)}px`,
            } as React.CSSProperties
          }
        >
          {children}
        </div>
      </div>
      {showBar && (
        <div
          className={fc(stc)}
          ref={scrollTrackRef}
          style={{
            bottom: 0,
            left: 0,
            right: 0,
            height: "20px",
            backgroundColor: "#ccc",
            ...scrollTrackStyle,
            position: "sticky",
          }}
        >
          <div
            ref={scrollBarRef}
            className={fc(sbc)}
            style={styleSbc}
            onMouseDown={(e) => handleDragStart(e as any)}
            onTouchStart={(e) => handleDragStart(e as any)}
            role="scrollbar"
            aria-controls={`${name}-container`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percentage * 100}
            tabIndex={0}
          />
        </div>
      )}
    </>
  );
}

export default class ScrollContainer<
  TProps extends ScrollContainerProps = ScrollContainerProps,
  TState extends ScrollContainerState = ScrollContainerState
> extends Container<TProps, TState> {
  static jsClass = "ScrollContainer";

  content(children = this.props.children) {
    const {
      name,
      scrollTrackClasses,
      scrollBarClasses,
      scrollTrackStyle,
      scrollBarStyle,
    } = this.props;
    return (
      <ScrollXNode
        {...{
          name,
          breakpoint: this.breakpoint,
          orientation: this.orientation,
          width: this.width,
          height: this.height,
          scrollTrackClasses,
          scrollBarClasses,
          scrollTrackStyle,
          scrollBarStyle,
          children,
        }}
      />
    );
  }
}
