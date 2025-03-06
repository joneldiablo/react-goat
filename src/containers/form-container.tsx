import React, { createRef } from "react";

import { eventHandler } from "dbl-utils";

import Component, { ComponentProps, ComponentState } from "../component";

export interface FormContainerProps extends ComponentProps {
  label?: React.ReactNode;
  labelClasses?: string;
  fields: Record<string, any> | Array<string | Record<string, any>>;
}

export interface FormContainerState extends ComponentState {
  data: Record<string, any>;
  invalidFields: Record<string, any>;
  defaultValues: Record<string, any>;
}

export default class FormContainer<
  TProps extends FormContainerProps = FormContainerProps,
  TState extends FormContainerState = FormContainerState
> extends Component<TProps, TState> {
  static jsClass = "FormContainer";

  static defaultProps = {
    ...Component.defaultProps,
    fields: [],
  };

  form = createRef<HTMLFormElement>();
  private timeoutInvalid?: NodeJS.Timeout;
  private timeoutOnChange?: NodeJS.Timeout;
  private timeoutCheckValidity?: NodeJS.Timeout;
  private mergeDefault: boolean | null = null;
  protected events: [string, (event: any) => void][] = [];
  protected readyEvents: [string, (event: any) => void][] = [];

  constructor(props: TProps) {
    super(props);
    Object.assign(this.state, {
      data: {},
      invalidFields: {},
      defaultValues: {},
    });
    this.onChange = this.onChange.bind(this);
    this.checkValidity = this.checkValidity.bind(this);
    this.events.push(
      ["update." + props.name, this.onUpdate],
      ["default." + props.name, this.onDefault],
    );
    this.readyEvents = [];
    this.fieldsForEach((field) => {
      this.events.push([field.name, this.onChange]);
      this.events.push(["invalid." + field.name, this.onInvalidField]);
      this.readyEvents.push(["ready." + field.name, this.onReadyOnce.bind(this)]);
      if (typeof field.default !== "undefined")
        Object.assign(this.state.defaultValues, { [field.name]: field.default });
    });
    delete this.eventHandlers.onChange;
  }

  componentDidMount() {
    this.events.forEach((event) => eventHandler.subscribe(...event, this.name));
    this.readyEvents.forEach((event) => eventHandler.subscribe(...event, this.name));
    this.reset();
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutInvalid);
    clearTimeout(this.timeoutOnChange);
    clearTimeout(this.timeoutCheckValidity);
    this.events.forEach(([eventName]) => eventHandler.unsubscribe(eventName, this.name));
  }

  checkValidity() {
    clearTimeout(this.timeoutCheckValidity);
    this.timeoutCheckValidity = setTimeout(() => {
      if (this.form.current?.checkValidity()) {
        eventHandler.dispatch("valid." + this.props.name, this.state.data);
      }
    }, 310);
  }

  onReadyOnce() {
    this.readyEvents.forEach(([eventName]) => eventHandler.unsubscribe(eventName, this.name));
    eventHandler.dispatch("ready." + this.props.name);
  }

  fieldsForEach(func: (field: Record<string, any>, index: number) => void) {
    const { fields } = this.props;
    if (Array.isArray(fields)) {
      fields.forEach((f, i) => func(typeof f === "string" ? { name: f } : f, i));
    } else {
      Object.keys(fields!).forEach((name, i) => func({ name, ...fields[name] }, i));
    }
  }

  onUpdate = ({ data, reset, default: dataDefault, update = true, clearData, mergeDefault }: any) => {
    if (clearData) {
      this.setState({ data: {} });
    }
    if (dataDefault) {
      this.mergeDefault = mergeDefault;
      this.onDefault(dataDefault);
    }
    if (data) {
      if (update) {
        Object.keys(data).forEach((fieldName) => {
          eventHandler.dispatch("update." + fieldName, { value: data[fieldName] });
        });
      }
      this.setState({ data: { ...this.state.data, ...data } }, this.checkValidity);
    }
    if (typeof reset === "boolean") {
      this.reset();
    }
  };

  onDefault = (data: Record<string, any>) => {
    const defaultValues: Record<string, any> = {};
    this.fieldsForEach((field) => {
      defaultValues[field.name] = data[field.name];
    });
    if (this.mergeDefault) {
      Object.assign(this.state.defaultValues, defaultValues);
    } else {
      Object.assign(this.state, { defaultValues });
    }
    this.mergeDefault = null;
  };

  reset() {
    this.fieldsForEach((field) => {
      if (this.state.defaultValues[field.name] !== undefined)
        eventHandler.dispatch("update." + field.name, { value: this.state.defaultValues[field.name] });
      else eventHandler.dispatch("update." + field.name, { clear: true, error: false });
    });
    this.setState({ data: {} });
  }

  onInvalid = () => {
    clearTimeout(this.timeoutInvalid);
    this.timeoutInvalid = setTimeout(() => {
      eventHandler.dispatch("invalid." + this.props.name, this.state.invalidFields);
    }, 400);
  };

  onInvalidField = (invalidData: Record<string, any>) => {
    Object.assign(this.state.invalidFields, invalidData);
  };

  onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    eventHandler.dispatch(this.props.name, this.state.data);
  };

  onChange(fieldData: Record<string, any>) {
    const { data, invalidFields } = this.state;
    Object.keys(fieldData).forEach((key) => delete invalidFields[key]);
    Object.assign(data, fieldData);
    this.setState({ data, invalidFields });
    eventHandler.dispatch("change." + this.props.name, data);
    this.checkValidity();
  }

  content(children = this.props.children) {
    const { label, labelClasses, name } = this.props;
    return (
      <form onSubmit={this.onSubmit} onInvalid={this.onInvalid} ref={this.form} id={`${name}-form`}>
        {label && <label className={labelClasses}>{label}</label>}
        {children}
      </form>
    );
  }
}
