import React from "react";
import Container, { ContainerProps, ContainerState } from "./container";

export interface DndListContainerProps extends ContainerProps {
  onChange?: (items: React.ReactNode[]) => void;
}

interface DndListContainerState extends ContainerState {
  items: React.ReactNode[];
  dragIndex: number | null;
}

export default class DndListContainer<TProps extends DndListContainerProps = DndListContainerProps>
  extends Container<TProps, DndListContainerState> {
  static jsClass = "DndListContainer";

  constructor(props: TProps) {
    super(props);
    this.state = {
      ...this.state,
      items: React.Children.toArray(props.children),
      dragIndex: null,
    };
  }

  componentDidUpdate(prevProps: TProps) {
    if (prevProps.children !== this.props.children) {
      this.setState({ items: React.Children.toArray(this.props.children) });
    }
  }

  private onDragStart = (index: number) => () => {
    this.setState({ dragIndex: index });
  };

  private onDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const { dragIndex, items } = this.state;
    if (dragIndex === null || dragIndex === index) return;
    const newItems = [...items];
    const [removed] = newItems.splice(dragIndex, 1);
    newItems.splice(index, 0, removed);
    this.setState({ items: newItems, dragIndex: index });
  };

  private onDrop = () => {
    this.setState({ dragIndex: null });
    this.props.onChange?.(this.state.items);
  };

  protected content(): React.ReactNode {
    const { items } = this.state;
    return (
      <div>
        {items.map((child, i) => (
          <div
            key={i}
            draggable
            onDragStart={this.onDragStart(i)}
            onDragOver={this.onDragOver(i)}
            onDrop={this.onDrop}
          >
            {child as React.ReactNode}
          </div>
        ))}
      </div>
    );
  }
}
