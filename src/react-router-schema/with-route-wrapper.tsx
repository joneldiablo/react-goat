import React, { useLayoutEffect, useRef, useReducer } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import eventHandler from "dbl-utils/event-handler";
import { RouteProps } from "./route";

/**
 * Higher-order component to manage class names and styles in the body element
 * based on the current route and its properties.
 *
 * @param {React.ComponentType<P>} WrappedComponent - The component to wrap (Controller).
 * @param {Route} route - The current route object containing name, style, and other properties.
 * @returns {React.FC<P>} - The wrapped component with added functionality.
 */
const withRouteWrapper = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  route: RouteProps
): React.FC<P> => {
  return function RouteWrapper(props: P) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    // Reference used to hold the timeout ID when throttling location updates
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    // useReducer is used here to provide a stable forceUpdate function that
    // increments an integer. React's forceUpdate method is not available in
    // function components, so this pattern emulates it.
    const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

    // Subscribe to location events emitted via eventHandler…
    useLayoutEffect(() => {
      const callback = (nlocation: { pathname: string }) => {
        // Clear any pending timeout to debounce updates
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          if (nlocation.pathname !== location.pathname) forceUpdate();
        }, 50);
      };
      // Use the route name from props if available when subscribing so that
      // each wrapper has a unique subscription key.
      eventHandler.subscribe(
        "location",
        callback,
        "wrapper-" + ((props as any).name ?? "")
      );
      return () => {
        eventHandler.unsubscribe(
          "location",
          "wrapper-" + ((props as any).name ?? "")
        );
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    // Update body classes and CSS variables whenever the pathname changes…
    useLayoutEffect(() => {
      // Remove any existing class ending with '-view' before adding the new one
      const viewClassName = Array.from(document.body.classList).find((cl) =>
        cl.endsWith("-view")
      );
      if (viewClassName) {
        document.body.classList.remove(viewClassName);
      }
      document.body.classList.add(`${route.name}-view`);

      // Remove classes that start with 'location-' and then add our own
      document.body.classList.forEach((cls) => {
        if (cls.startsWith("location-")) {
          document.body.classList.remove(cls);
        }
      });
      document.body.classList.add(
        `location${location.pathname.replace(/\//g, "-")}`
      );

      // Ensure route.style exists and set a CSS custom property to expose the
      // component name.
      if (!route.style) route.style = {} as any;
      (route.style as any)["--component-name"] = `"${route.name}"`;

      // Cleanup when the component unmounts or the pathname changes
      return () => {
        document.body.classList.remove(`${route.name}-view`);
        document.body.classList.remove(
          `location${location.pathname.replace(/\//g, "-")}`
        );
      };
    }, [location.pathname]);

    return (
      <WrappedComponent
        {...props}
        location={location}
        navigate={navigate}
        match={params}
        route={route}
      />
    );
  };
};

export default withRouteWrapper;
