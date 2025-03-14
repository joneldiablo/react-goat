import React from "react";
import { NavLink, Link } from "react-router-dom";
import parseReact, { domToReact, attributesToProps } from "html-react-parser";

import { deepMerge } from "dbl-utils/object-mutation";
import t from "dbl-utils/i18n";
import formatValue from "dbl-utils/format-value";
import { hash } from "dbl-utils/utils";

import Icons from "./media/icons";
import COMPONENTS from "./components";

const excludeSectionWrapper: string[] = [
  "NavLink", "Image", "Link", "Icons", "SvgImports", "Action",
  "DropdownButtonContainer", "ModalButtonContainer", "DropdownItem"
];

export function addWrapperExclusions(exclusion: string | string[]): void {
  excludeSectionWrapper.push(...[exclusion].flat());
}

/**
 * Clase utilizada para generar contenido dinámico en React a partir de una estructura de datos JSON.
 *
 * @class Goat
 */
export default class Goat {
  protected parseOpts = {
    replace: (domNode: any) => {
      let C7tReplace: React.ElementType | undefined;
      switch (domNode.name) {
        case "navlink":
          C7tReplace = NavLink;
          break;
        case "a":
          if (!domNode.attribs.to && domNode.attribs.href) return;
          C7tReplace = Link;
          break;
        case "icons":
          C7tReplace = Icons;
          domNode.attribs.inline = domNode.attribs.inline === "false" ? false : true;
          break;
        case "textarea":
        case "input":
          domNode.defaultValue = domNode.value;
          domNode.defaultChecked = domNode.checked;
          delete domNode.value;
          delete domNode.checked;
          return;
        default:
          return;
      }
      Object.keys(domNode).forEach(k => {
        if (k.match(/^on[A-Z]/)) {
          domNode[k] = (this.props as any)[k];
        }
      });
      return <C7tReplace {...attributesToProps(domNode.attribs)}>
        {domToReact(domNode.children, this.parseOpts)}
      </C7tReplace>;
    }
  };

  protected actualSections: any[] = [];
  protected props: any;
  protected mutations?: Function;
  protected childrenIn: any;

  constructor(props: any, mutations?: Function) {
    this.props = props;
    this.mutations = mutations;
    this.sections = this.sections.bind(this);
    this.buildContent = this.buildContent.bind(this);
  }

  public buildContent(content: any, index?: number): React.ReactNode {
    if (!content) return false;
    if (typeof content !== 'object') {
      const translate = t(content, this.props.context);
      const section = this.actualSections[this.actualSections.length - 1];
      if (typeof translate === 'number' || typeof translate === 'boolean') {
        return formatValue(translate, section);
      } else if (typeof translate === 'string') {
        let parsed = parseReact(translate, this.parseOpts);
        if (typeof parsed === 'string') parsed = formatValue(parsed, section);
        return <React.Fragment key={hash(translate)} >
          {parsed}
        </React.Fragment>;
      }
    } else if (React.isValidElement(content)) {
      try {
        const untyped: any = content;
        content.key = content.key || untyped.props.name || index;
      } catch (error) {
      }
      return content;
    } else if (Array.isArray(content)) return content.map(this.buildContent);
    if (Array.isArray(content.name)) content.name = content.name.join('-');
    if (typeof content === 'object' && typeof content.name !== 'string')
      return Object.keys(content)
        .map((name, i) => this.buildContent(typeof content[name] !== 'object'
          ? content[name] : { name, ...content[name] }, i)
        );
    this.actualSections.push(content);
    const builded = this.sections(content, index);
    this.actualSections.pop();
    return builded;
  }

  protected sections(sr: any, i?: number): React.ReactNode {

    const m = (typeof this.mutations === 'function' && this.mutations(sr.name, sr)) || {};
    if (m.style && sr.style) m.style = deepMerge({}, sr.style, m.style);
    if (m._props && sr._props) m._props = deepMerge({}, sr._props, m._props);
    const sectionRaw = Object.assign({}, sr, m || {});
    if (sectionRaw.active === false) return false;

    const { component: componentName, content, placeholder,
      label, message, errorMessage, managerName, wrapperClasses, wrapperStyle = {}, ...section } = sectionRaw;
    const { navigate, location, match, childrenIn = this.childrenIn, children } = this.props;
    const Component: any = COMPONENTS[componentName] || (COMPONENTS.Component);
    const extraBuilded = [Component.slots].flat().filter(Boolean).reduce((eb, key) => {
      const tmp = section[key];
      section[key] = null;
      delete section[key];
      eb[key] = this.buildContent(tmp);
      return eb;
    }, {});
    const componentProps = {
      ...section,
      managerName: managerName || this.props.name,
      label: this.buildContent(label),
      placeholder: this.buildContent(placeholder),
      message: this.buildContent(message),
      errorMessage: this.buildContent(errorMessage),
      ...extraBuilded,
      location,
      match,
      navigate
    }

    if (Component.dontBuildContent) componentProps.content = content;
    const childrenHere = (
      (Array.isArray(childrenIn) ? childrenIn.join('-') : childrenIn)
      === (Array.isArray(section.name) ? section.name.join('-') : section.name)
    );
    if (!Component.dontBuildContent && content && childrenHere) {
      componentProps.children = <>
        {this.buildContent(content)}
        {children}
      </>;
    } else if (!Component.dontBuildContent && content) {
      componentProps.children = this.buildContent(content);
    } else if (childrenHere) {
      componentProps.children = children;
    }

    const cnSection = [componentProps.name + '-section'];
    if (this.props.test) cnSection.push('test-section-wrapper');
    if (this.props.wrapperClasses) cnSection.push(this.props.wrapperClasses);
    if (wrapperClasses) cnSection.push(wrapperClasses);

    const exclusionSec = excludeSectionWrapper.includes(componentName);

    const Wrapper = (componentProps.wrapper === false || Component.wrapper === false)
      ? false : componentProps.wrapper || Component.wrapper || 'section';

    if (!Wrapper || exclusionSec || componentProps.tag) {
      if (this.props.test) {
        if (!componentProps.style) componentProps.style = {};
        componentProps.style.border = '1px solid yellow';
      }
      return <Component key={componentProps.name || i} {...componentProps} />
    }

    const wrapperProps = {
      className: cnSection.flat().join(' '),
      style: {
        "--component-name": `"${componentProps.name}"`,
        ...wrapperStyle
      }
    };
    return (<Wrapper key={componentProps.name || i} {...wrapperProps}>
      <Component {...componentProps} />
    </Wrapper>);

  }
}
