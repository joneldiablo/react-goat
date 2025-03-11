import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useFloating, autoUpdate, autoPlacement, AutoPlacementOptions, UseFloatingOptions } from '@floating-ui/react';
import { eventHandler, splitAndFlat } from 'dbl-utils';
import useEventHandler from '../hooks/use-event-handler';
import Component, { ComponentProps } from '../component';

export interface FloatingContainerProps extends ComponentProps, Pick<AutoPlacementOptions, 'alignment' | 'allowedPlacements'>, Pick<UseFloatingOptions, 'placement'> {
  floatAround?: React.RefObject<any> | React.RefObject<HTMLElement> | HTMLElement | null;
}

export default function FloatingContainer({
  name, floatAround, children, placement,
  alignment, allowedPlacements, classes, style
}: FloatingContainerProps) {
  const [open, setOpen] = useState<boolean>(false);
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const changeOpen = useRef<NodeJS.Timeout | null>(null);

  const reference: HTMLElement = (floatAround && ('current' in floatAround ? floatAround.current?.ref?.current || floatAround.current : floatAround)) || document.body;

  const onOpenChange = useCallback((inOpen: boolean, event: Event, reason?: string) => {
    eventHandler.dispatch(name, { [name]: { open: inOpen, event, reason } });
  }, [name]);

  const selfUpdate = useCallback((update: { open?: boolean | 'toggle' }, echo?: boolean) => {
    if (update.open !== undefined) {
      const newOpen = update.open === 'toggle' ? !open : update.open;
      if (changeOpen.current) clearTimeout(changeOpen.current);
      changeOpen.current = setTimeout(() => {
        setOpen(newOpen);
        if (echo) eventHandler.dispatch(name, { [name]: { open: newOpen } });
      }, 100);
    }
  }, [name, open]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (floatingRef.current && !floatingRef.current.contains(event.target as Node)) {
      if (changeOpen.current) clearTimeout(changeOpen.current);
      changeOpen.current = setTimeout(() => {
        setOpen(false);
        eventHandler.dispatch(name, { [name]: { open: false } });
      }, 100);
    }
  }, [name]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (changeOpen.current) clearTimeout(changeOpen.current);
      changeOpen.current = setTimeout(() => {
        setOpen(false);
        eventHandler.dispatch(name, { [name]: { open: false } });
      }, 100);
    }
  }, [name]);

  const { refs, floatingStyles } = useFloating({
    elements: {
      reference,
    },
    strategy: 'fixed',
    placement,
    onOpenChange,
    whileElementsMounted: autoUpdate,
    middleware: [autoPlacement({
      alignment,
      autoAlignment: !alignment,
      allowedPlacements,
    })],
  });

  useEventHandler([
    [`update.${name}`, selfUpdate]
  ], `${name}-FloatingContainer`);

  useEffect(() => {
    if (open && refs.floating.current) {
      refs.floating.current.focus();
    }
  }, [open, refs.floating]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClickOutside, handleKeyDown]);

  useLayoutEffect(() => {
    return () => {
      if (changeOpen.current) clearTimeout(changeOpen.current);
    }
  }, []);

  const cn: (string | string[])[] = [name, `${name}-FloatingContainer`];
  if (classes) {
    if (typeof classes === 'object')
      cn.push((classes as Record<string, string | string[]>)['.']);
    else cn.push(classes);
  }

  return (<>
    {reference instanceof Node && open &&
      <div
        ref={(node) => {
          floatingRef.current = node;
          refs.setFloating(node);
        }}
        className={splitAndFlat(cn, ' ').join(' ')}
        style={{ ...style, ...floatingStyles, zIndex: 1050 }}
      >
        {children}
      </div>}
  </>);
}
