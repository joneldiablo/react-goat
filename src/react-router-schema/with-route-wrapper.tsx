import React, {
  useLayoutEffect,
  useRef,
  useReducer,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import eventHandler from "dbl-utils/event-handler";
import { RouteProps } from "./route";

/**
 * Higher-order component that augments a controller with router helpers and
 * updates the document body with route specific classes.
 *
 * @param WrappedComponent Component to enhance (typically a controller).
 * @param route            Route definition associated with the controller.
 *
 * @example
 * ```tsx
 * const Wrapped = withRouteWrapper(MyController, { name: 'home', path: '/' });
 * <MemoryRouter initialEntries={['/']}>
 *   <Wrapped />
 * </MemoryRouter>
 * ```
 */
const withRouteWrapper = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  route: RouteProps
): React.FC<P> => {
  return function RouteWrapper(props: P) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    // Reducer used only to force a re-render when location changes externally
    const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

    // Subscribe to location changes dispatched through the event handler
    useLayoutEffect(() => {
      const callback = (nlocation: { pathname: string }) => {
        clearTimeout(timeoutRef.current as NodeJS.Timeout);
        timeoutRef.current = setTimeout(() => {
          if (nlocation.pathname !== location.pathname) {
            forceUpdate();
          }
        }, 50);
      };
      eventHandler.subscribe("location", callback, "wrapper-" + (props as any).name);
      return () => {
        eventHandler.unsubscribe("location", callback, "wrapper-" + (props as any).name);
      };
    }, [location.pathname, props]);

    // Update body classes whenever the pathname changes
    useLayoutEffect(() => {
      const viewClassName = Array.from(document.body.classList).find(cl =>
        cl.endsWith("-view")
      );
      if (viewClassName) {
        document.body.classList.remove(viewClassName);
      }
      document.body.classList.add(`${route.name}-view`);

      document.body.classList.forEach(cls => {
        if (cls.startsWith("location-")) {
          document.body.classList.remove(cls);
        }
      });
      document.body.classList.add(
        `location${location.pathname.replace(/\//g, "-")}`
      );

      if (!route.style) route.style = {};
      route.style["--component-name"] = `"${route.name}"`;

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
