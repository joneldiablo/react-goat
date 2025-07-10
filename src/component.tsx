import React, { createRef, ReactNode, JSX, ExoticComponent } from "react";
import eventHandler from "dbl-utils/event-handler";

export type Classes = string | string[] | Record<string, string | string[]>;

export interface ComponentProps extends React.ComponentProps<any> {
  _props?: Record<string, any>;
  active?: boolean;
  classes?: Classes;
  name: string;
  tag?:
    | keyof JSX.IntrinsicElements
    | false
    | ExoticComponent<{ children?: ReactNode }>
    | string;
  ref?: React.Ref<any>;
}

export interface ComponentState {
  localClasses: string;
  localStyles: React.CSSProperties;
}

export default class Component<
  TProps extends ComponentProps = ComponentProps,
  TState extends ComponentState = ComponentState
> extends React.Component<TProps, TState> {
  static jsClass = "Component";
  static defaultProps: Partial<ComponentProps> = {
    classes: "",
    style: {},
    active: true,
  };
  static slots?: string[];
  static dontBuildContent?: boolean;
  static wrapper?: string | boolean;

  protected tag:
    | keyof JSX.IntrinsicElements
    | React.FC
    | typeof React.Component
    | ExoticComponent = "div";
  protected classes: string = "";
  protected style: React.CSSProperties = {};
  protected name: string;
  protected ref = createRef<any>();
  protected ready?: NodeJS.Timeout;
  protected eventHandlers: Record<string, (...args: any[]) => void>;

  state: TState;

  constructor(props: TProps) {
    super(props);
    this.name = `${this.props.name}-${(this.constructor as any).jsClass}`;
    this.state = {
      localClasses: "",
      localStyles: {},
    } as TState;
    this.onEvent = this.onEvent.bind(this);
    this.eventHandlers = {
      onClick: this.onEvent,
      onChange: this.onEvent,
      onMouseOver: this.onEvent,
      onMouseOut: this.onEvent,
      onMouseEnter: this.onEvent,
      onMouseLeave: this.onEvent,
      onKeyDown: this.onEvent,
      onLoad: this.onEvent,
    };
  }

  protected setClasses(
    classes?: string | string[]
  ): [Set<string>, Set<string>] {
    const localClasses = new Set(
      this.state.localClasses.split(" ").filter(Boolean)
    );
    if (!classes) return [localClasses, new Set()];
    const setClasses = new Set(
      Array.isArray(classes)
        ? classes.flatMap((c) => c.split(" "))
        : classes.split(" ")
    );
    return [localClasses, setClasses];
  }

  protected toggleClasses(classes?: string | string[]): boolean {
    if (!classes) return false;
    const [localClasses, setClasses] = this.setClasses(classes);
    setClasses.forEach((c) => {
      if (localClasses.has(c)) localClasses.delete(c);
      else localClasses.add(c);
    });
    this.setState({ localClasses: Array.from(localClasses).join(" ") });
    return true;
  }

  protected addClasses(classes?: string | string[] | null): boolean {
    if (!classes) return false;
    const [localClasses, setClasses] = this.setClasses(classes);
    setClasses.forEach((c) => localClasses.add(c));
    this.setState({ localClasses: Array.from(localClasses).join(" ") });
    return true;
  }

  protected deleteClasses(classes?: string | string[]): boolean {
    if (!classes) return false;
    const [localClasses, setClasses] = this.setClasses(classes);
    setClasses.forEach((c) => localClasses.delete(c));
    this.setState({ localClasses: Array.from(localClasses).join(" ") });
    return true;
  }

  protected get componentProps(): Record<string, any> | undefined {
    return this.props._props;
  }

  protected content(children: ReactNode = this.props.children): ReactNode {
    return children;
  }

  protected onEvent(e: Event): void {
    eventHandler.dispatch(`${e.type}.${this.props.name}`, {
      [this.props.name]: {
        state: this.state,
        value: (e.target as HTMLInputElement).value,
      },
    });
  }

  render() {
    const { classes, style, name, tag, active } = this.props;
    const { localClasses, localStyles } = this.state;
    if (!this.ready) {
      this.ready = setTimeout(() => eventHandler.dispatch(`ready.${name}`), 50);
    }
    const content = this.content();
    const Tag = tag === undefined ? this.tag : tag;
    if (Tag === false) return <>{content} </>;
    const TheTag = Tag as keyof JSX.IntrinsicElements;

    const cn: (string | string[])[] = [
      (this.constructor as any).jsClass,
      name,
      this.name,
      this.classes,
      localClasses,
    ];
    if (classes) {
      if (typeof classes === "string") cn.push(classes);
      else if (Array.isArray(classes)) cn.push(classes.join(" "));
      else cn.push(classes["."]);
    }

    const s = { ...this.style, ...localStyles, ...style };
    const props =
      Tag === React.Fragment
        ? {}
        : {
            className: cn.filter(Boolean).join(" "),
            style: s,
            ref: this.ref,
            ...this.eventHandlers,
            ...this.componentProps,
          };

    return active ? <TheTag {...props}> {content}</TheTag> : <React.Fragment />;
  }
}
