import React from "react";
import PropTypes from "prop-types";

import Component from "../component";

/**
 * TODO: sacar dos componentes de aquí.
 * 1. que sea un componente al cual se le pase el template, segun  el data si es array se repite el template si es objeto se usa directo, colocar $payload/_value_ para indicar de donde tomar la información
 * 2. traer de servicio, el anterior construye con los datos en local, este, el segundo trae de servicio appCtrl.fetch
 */

export default class FetchContainer extends Component {
  static jsClass = "FetchContainer";
  static propTypes = {
    ...Component.propTypes,
    url: PropTypes.string.isRequired,
    fetchProps: PropTypes.object
  }

  componentDidMount() {
    this.fetch();
  }

  async fetch() {
    const { url, fetchProps } = this.props;
    const r = await fetch(url, fetchProps).then(r => r.text());
    this.setState({ fetchContent: r });
  }

  content(children = this.props.children) {
    return React.createElement(React.Fragment, {},
      React.createElement('div', { dangerouslySetInnerHTML: { __html: this.state.fetchContent } }),
      children
    );
  }
}