import React, { ReactNode } from "react";
import Controller, { ControllerProps } from "./controller";

// Definimos la interfaz de las propiedades del componente
export interface TitleControllerProps extends ControllerProps {
  label?: string;
  labelClasses?: string;
}

export default class TitleController extends Controller<TitleControllerProps> {
  static jsClass = "TitleController";

  content(children: ReactNode = this.props.children): ReactNode {
    const { label, labelClasses } = this.props;

    return (
      <>
        <h1 className={labelClasses} > {label} </h1>
        {super.content(children)}
      </>
    );
  }
}
