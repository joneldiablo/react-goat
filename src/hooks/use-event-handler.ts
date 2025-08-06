import { useEffect } from "react";

import eventHandler from "dbl-utils/event-handler";

/**
 * React hook to subscribe to and clean up event-handler subscriptions.
 *
 * @param events - Array of tuples containing event name and callback.
 * @param id - Identifier used for subscription grouping.
 *
 * @example
 * ```tsx
 * useEventHandler([["ready.button", () => console.log("ready")]], "btn1");
 * ```
 */
export default function useEventHandler(
  events: [string, (...args: any[]) => void][],
  id: string
) {
  const eventNames = Object.values(events).map(([name]) => name).join(".");
  useEffect(() => {
    Object.values(events).forEach(([evtName, evtCallback]) => {
      eventHandler.subscribe(evtName, evtCallback, id);
    });
    return () => {
      Object.values(events).forEach(([evtName]) => {
        eventHandler.unsubscribe(evtName, id);
      });
    };
  }, [eventNames, id]);
}