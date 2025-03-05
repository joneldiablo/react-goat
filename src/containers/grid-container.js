import React from "react";

import Container from "./container";

export default class GridContainer extends Container {

  static jsClass = 'GridContainer';
  static defaultProps = {
    ...Container.defaultProps,
    colClasses: [],
    colTag: 'div',
    breakpoints: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400
    }
  }

  grid(children = this.props.children, extraClasses) {
    const { colClasses, colTag } = this.props;
    return Array.isArray(children) && children.map((child, i) => {
      if (!child) return false;
      let colcn = [i % 2 ? 'even' : 'odd', 'col-num-' + i];
      const childConf = (!(child.props?.style && child.props.style['--component-name'])
        ? child : child.props.children).props;
      const childColClasses = childConf.colClasses;
      if (childColClasses) colcn.push(childColClasses);
      // unir clases generales, si es un string se une  todas las columnas
      // si es un arreglo se une en su debido lugar y se repite la ultima clase 
      // si no coincide el número de columnas y clases
      if (typeof colClasses === 'string') colcn.push(colClasses);
      else if (Array.isArray(colClasses) && colClasses[i])
        colcn.push(colClasses[i]);
      else if (Array.isArray(colClasses) && colClasses.length > 0)
        colcn.push(colClasses[colClasses.length - 1]);

      if (typeof extraClasses === 'string') colcn.push(extraClasses);
      else if (Array.isArray(extraClasses) && extraClasses[i])
        colcn.push(extraClasses[i]);
      else if (Array.isArray(extraClasses) && extraClasses.length > 0)
        colcn.push(extraClasses[extraClasses.length - 1]);

      const ColTag = childConf.colTag || colTag;
      return React.createElement(ColTag,
        { className: colcn.flat().join(' '), key: i },
        child
      );
    }).filter(c => !!c);
  }

  content(children = this.props.children) {
    return super.content(this.grid(children));
  }

}