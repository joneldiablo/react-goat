import React from "react";

export interface FlexContainerProps {
  /** Wrapper class names. */
  className?: string | string[];
  /** Class names applied to each column. */
  colClassNames?: string | string[];
  /** Optional style object. */
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * Simple flex based container that wraps each child in a column div.
 *
 * @example
 * ```tsx
 * <FlexContainer colClassNames="col">
 *   <span>One</span>
 *   <span>Two</span>
 * </FlexContainer>
 * ```
 */
export default class FlexContainer extends React.Component<FlexContainerProps> {
  static jsClass = "FlexContainer";

  static defaultProps = {
    className: "",
    style: {},
    colClassNames: [] as string[] | string,
  };

  private column(child: React.ReactNode, i: number) {
    const { colClassNames } = this.props;
    const colcn: string[] = [];
    if (typeof colClassNames === "string") colcn.push(colClassNames);
    else if (Array.isArray(colClassNames) && colClassNames[i]) colcn.push(colClassNames[i]);
    else if (Array.isArray(colClassNames) && colClassNames.length > 0)
      colcn.push(colClassNames[colClassNames.length - 1]);
    return (
      <div className={colcn.flat().join(" ")} key={i}>
        {child}
      </div>
    );
  }

  render() {
    const { className, style, children } = this.props;
    const cn = [FlexContainer.jsClass, className, "d-flex"].flat().join(" ");
    return (
      <div className={cn} style={style}>
        {Array.isArray(children) && children.map((c, i) => this.column(c, i))}
      </div>
    );
  }
}
