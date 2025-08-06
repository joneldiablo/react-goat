import React, { useEffect } from "react";

import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";

import eventHandler from "dbl-utils/event-handler";
import { hash } from "dbl-utils/utils";

import controllers from "../controllers";
import withRouteWrapper from "./with-route-wrapper";
import { RouteProps } from "./route";

/**
 * Configuration for {@link SchemaController} and router wrappers.
 */
interface SchemaProps {
  /** Enables test mode for all routes. */
  test?: boolean;
  /** Optional CSS theme to load. */
  theme?: string;
  /** Route schema definition. */
  routes: RouteProps | RouteProps[];
  /** Default controller used when a route component is missing. */
  defaultController?: any;
  /** Force rebuilding routes on every render. */
  forceRebuild?: boolean;
}

const defaultProps: Partial<SchemaProps> = {
  routes: [],
  defaultController: controllers.Controller,
};

/**
 * Controller that renders a React Router `<Routes>` tree from a schema.
 */
export default class SchemaController extends React.Component<SchemaProps> {
  static jsClass = "SchemaController";
  static defaultProps = defaultProps;

  routeNodes: any[] = [];
  routesHash?: number;

  constructor(props: SchemaProps) {
    super(props);
    this.routesHash = hash(JSON.stringify(props.routes));
    this.buildRoutes();
  }

  buildRoutes() {
    const schemaStr = JSON.stringify(this.props.routes);
    const routesSchema = JSON.parse(schemaStr);

    let routes: any;
    if (Array.isArray(routesSchema))
      routes = routesSchema.map(this.views);
    else if (typeof routesSchema === "object" && routesSchema.name)
      routes = this.views(routesSchema);
    else if (typeof routesSchema === "object")
      routes = Object.keys(routesSchema).map((name, i) => this.views({ name, ...routesSchema[name] }, i));

    this.routeNodes = routes;
    this.routesHash = hash(JSON.stringify(this.props.routes));
  }

  componentDidUpdate(prevProps: SchemaProps) {
    const newHash = hash(JSON.stringify(this.props.routes));
    if (this.routesHash !== newHash) {
      this.buildRoutes();
      this.forceUpdate();
    }
  }

  views = (route: RouteProps, i?: number) => {
    const Controller = controllers[route.component as keyof typeof controllers] || this.props.defaultController || controllers.Controller;
    route.test = route.test || this.props.test;
    const WrappedController = withRouteWrapper(Controller, route);

    let subroutes: any = false;

    if (Array.isArray(route.routes)) subroutes = [];
    else if (typeof route.routes === "object") {
      subroutes = [];
      const routesRecord = route.routes as Record<string, Omit<RouteProps, 'name'>>;
      route.routes = Object.keys(routesRecord).map(name => ({ name, ...routesRecord[name] }) as any);
    }

    if (subroutes) {
      subroutes = route.routes!.map((subRoute, i) => {
        const clone = JSON.parse(JSON.stringify(subRoute));
        return this.views(clone, i);
      });
    }

    const routeProps: any = {
      path: route.path,
      index: route.index,
      action: route.action,
      caseSensitive: route.caseSensitive,
      Component: route.Component,
      ErrorBoundary: route.ErrorBoundary,
      errorElement: route.errorElement,
      handle: route.handle,
      hasErrorBoundary: route.hasErrorBoundary,
      HydrateFallback: route.HydrateFallback,
      hydrateFallbackElement: route.hydrateFallbackElement,
      id: route.id,
      lazy: route.lazy,
      loader: route.loader,
      shouldRevalidate: route.shouldRevalidate,
      element: (
        <WrappedController {...route}>
          {subroutes.length > 0 ? <Outlet /> : null}
        </WrappedController>
      )
    };

    const key = i || typeof i === 'number' ? (i + '-' + route.name) : route.name;

    return (
      <Route key={key} {...routeProps}>
        {subroutes.length > 0 && subroutes}
      </Route>
    );
  }

  render() {
    const { theme } = this.props;
    if (this.props.forceRebuild) {
      this.buildRoutes();
    }
    return (
      <>
        {!!theme && <link rel="stylesheet" type="text/css" href={theme} />}
        <Routes>
          {this.routeNodes}
        </Routes>
      </>
    );
  }
}

/**
 * Internal wrapper that dispatches location changes and renders the schema
 * controller.
 */
const RouterSchema: React.FC<SchemaProps> = (props) => {
  const location = useLocation();
  useEffect(() => {
    eventHandler.dispatch("location", location);
  }, [location.pathname]);
  return <SchemaController {...props} />;
};

/**
 * Renders the schema inside a {@link BrowserRouter}.
 *
 * @example
 * ```tsx
 * <BrowserRouterSchema routes={[{ path: '/', component: 'Controller' }]} />
 * ```
 */
export const BrowserRouterSchema: React.FC<SchemaProps> = (props) => {
  const mergedProps = { ...defaultProps, ...props };
  return (
    <BrowserRouter>
      <RouterSchema {...mergedProps} />
    </BrowserRouter>
  );
};

/**
 * Renders the schema inside a {@link HashRouter}.
 *
 * @example
 * ```tsx
 * <HashRouterSchema routes={[{ path: '/', component: 'Controller' }]} />
 * ```
 */
export const HashRouterSchema: React.FC<SchemaProps> = (props) => {
  const mergedProps = { ...defaultProps, ...props };
  return (
    <HashRouter>
      <RouterSchema {...mergedProps} />
    </HashRouter>
  );
};
