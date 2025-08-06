import React from "react";
import urlJoin from "url-join";

import { deepMerge } from "dbl-utils/object-mutation";
import resolveRefs from "dbl-utils/resolve-refs";
import { randomS4 } from "dbl-utils/utils";
import eventHandler from "dbl-utils/event-handler";
import { flatten } from "dbl-utils/flat";
import {
  addDictionary,
  addFormatDate,
  addFormatNumber,
  addFormatTime,
  getLang,
  setLang,
  addFormatDateTime
} from "dbl-utils/i18n";

import { addIcons } from "./media/icons";
import { addComponents } from "./components";
import { addControllers } from "./controllers";
import { addFields } from "./fields";
import Controller from "./controllers/controller";
import { RouteProps } from "./react-router-schema/route";

// Global state kept in memory
const GLOBAL_STATE: Record<string, any> = {};

export interface RequestAppGoat extends RequestInit {
  query?: Record<string, any>;
  format?: 'raw' | 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';
  timeout?: number;
  body?: any;
}

/**
 * Constructor properties for `AppGoatController`.
 */
export interface AppGoatControllerProps {
  icons?: { icons: any[]; } | false;
  controllers?: Record<string, typeof Controller<any, any>>;
  components?: Record<string, Record<string, React.FC<any> | typeof React.Component<any, any>>>;
  definitions?: Array<any> | Record<string, any>;
  routes?: Array<RouteSchema>;
  schema?: RouteSchema;
  api?: string;
  apiHeaders?: Record<string, string> | string;
  fetchBefore?: (url: string, options: RequestAppGoat) => RequestAppGoat;
  fetchAfter?: (res: any) => any;
  fetchError?: (error: any, url: string) => any;
  maxTimeout?: number;
  minTimeout?: number;
  dictionary?: Record<string, any>;
  formatDate?: Record<string, any>;
  formatNumber?: Record<string, any>;
  formatTime?: Record<string, any>;
  formatDateTime?: Record<string, any>;
  lang?: string;
  initialState?: Record<string, any>;
  fields?: Record<string, any>;
}

export interface RouteSchema {
  view: Record<string, any>;
  definitions?: Record<string, any>;
  routes?: Record<string, RouteSchema> | RouteSchema[] | Array<RouteSchema | string>;
  data?: any;
}

export class AppGoatAbortController extends AbortController {
  timeoutId?: NodeJS.Timeout;
}

export class AppGoatError extends Error {
  error?: boolean = true;
}

/**
 * Main controller that manages application configuration and global state.
 *
 * @example
 * ```ts
 * const app = new AppGoatController();
 * app.set("token", "123");
 * ```
 */
export class AppGoatController {

  // Stores AbortControllers for active requests
  fetchList: Record<string, AppGoatAbortController> = {};

  // Stores global definitions
  globalDefinitions: Array<any> = [];

  // Stores routes indexed by view name
  routes: Record<string, any> = {};

  // Temporary counter for routes found during initialization
  tmpRoutesFound: number = 0;

  // Root schema processed with nested routes
  rootSchema?: RouteProps;

  // Random identifier for this instance
  random: string = randomS4();

  // Properties passed to the controller
  props?: AppGoatControllerProps;

  // Prefix used for local and session storage
  prefixStorage: string = '_gs.';

  // Optional function to update external state
  update?: (key: string) => void;

  constructor(props?: AppGoatControllerProps) {
    if (props) this.init(props);
  }

  /**
   * Initializes the AppGoatController configuration.
   *
   * @param props - Initial properties to configure the application.
   */
  init(props: AppGoatControllerProps = {}): void {
    const {
      definitions = [],
      routes = [],
      fields = {},
      components = {},
      controllers = {},
      icons = false,
      schema = {
        view: {
          name: 'appEmpty',
          path: '/',
          content: 'Root empty site'
        }
      },
      api = "http://localhost:3000/",
      apiHeaders = {},
      fetchBefore = (url, options) => options,
      fetchAfter = res => res,
      fetchError = (error, url) => error,
      maxTimeout = 0,
      minTimeout = 1000,
      dictionary = {},
      formatDate = {},
      formatNumber = {},
      formatTime = {},
      formatDateTime = {},
      lang = 'default',
      initialState = {}
    } = props;

    // Save complete initial properties
    this.props = {
      definitions,
      routes,
      fields,
      components,
      controllers,
      icons,
      schema,
      api,
      apiHeaders,
      fetchBefore,
      fetchAfter,
      fetchError,
      maxTimeout,
      minTimeout,
      dictionary,
      formatDate,
      formatNumber,
      formatTime,
      formatDateTime,
      lang,
      initialState
    };

    // Register global icons if provided
    if (icons) addIcons(icons);

    // Combine initial global definitions
    this.globalDefinitions.push(
      ...(Array.isArray(definitions) ? definitions : [definitions])
    );

    // Index routes by view name and warn about overwrites
    this.routes = routes.reduce((rdx, route) => {
      if (rdx[route.view.name]) {
        console.warn(`Route ${route.view.name} overwritten`);
      }
      rdx[route.view.name] = route;
      return rdx;
    }, {} as Record<string, any>);

    // Register global field, component and controller extensions
    if (fields) addFields(fields);
    if (components) addComponents(components);
    if (controllers) addControllers(controllers);

    // Add custom global formats
    if (dictionary) addDictionary(dictionary);
    if (formatDate) addFormatDate(formatDate);
    if (formatNumber) addFormatNumber(formatNumber);
    if (formatTime) addFormatTime(formatTime);
    if (formatDateTime) addFormatDateTime(formatDateTime);

    // Set global language
    if (lang) setLang(lang);

    // Set initial state in storage or GLOBAL_STATE
    if (initialState) {
      const keys = [
        ...Object.keys(sessionStorage),
        ...Object.keys(localStorage)
      ]
        .filter(k => k.startsWith(this.prefixStorage))
        .map(k => k.replace(this.prefixStorage, ''));

      Object.entries(initialState).forEach(([key, value]) => {
        if (keys.includes(key)) {
          this.get(key);
        } else {
          GLOBAL_STATE[key] = value;
        }
      });
    }

    // Prepare root schema and routes
    schema.view.path = schema.view.path || '/';
    this.rootSchema = this.buildRootSchema(schema);

    // Informative log of total routes
    console.info('Total Routes:', this.tmpRoutesFound);
  }

  /**
   * Recursively processes a route schema to build a navigable structure.
   *
   * @param schema - Route schema to process.
   * @returns The processed view schema with nested routes resolved.
   */
  findingRoutesRecursive(schema: RouteSchema): RouteProps {
    // Increase the temporary counter of found routes
    this.tmpRoutesFound++;

    // Merge global definitions with the current schema's definitions
    const newDefs = deepMerge({}, ...this.globalDefinitions, schema.definitions || {});

    // Resolve view internal references using combined definitions
    const view = resolveRefs(schema.view, { definitions: newDefs, data: schema.data || {} });

    // Process nested routes if present
    if (schema.routes?.length) {
      view.routes = Object.entries(
        resolveRefs(schema.routes, { routes: this.routes }) as RouteSchema[]
      ).map(([key, route]: [string, RouteSchema]) => {
        // Error handling: route without defined view
        if (!(route && route.view)) {
          console.error('ROUTE VIEW NOT FOUND', route);
          return {
            name: `${view.name}.${key}`,
            path: `/${view.name}-${key}`,
            tag: 'error',
            content: `
            <p class='text-danger'>NOT FOUND</p>
            <p class='bg-dark text-light'><pre>${JSON.stringify(schema, null, 2)}</pre></p>
          `
          };
        }

        // Recursive call to continue processing nested routes
        return this.findingRoutesRecursive(route);
      });
    }

    // Return the processed view
    return view;
  }


  /**
   * Builds the root schema from the initial schema, resolving all nested routes.
   *
   * @param schema - Initial schema to start from.
   * @returns Fully processed root schema.
   */
  buildRootSchema(schema: RouteSchema): RouteProps {
    // Reset the temporary route counter
    this.tmpRoutesFound = 0;

    // Build the root schema invoking the recursive function
    const root = this.findingRoutesRecursive(schema);

    // Log the total number of routes after building
    console.info('Total Routes:', this.tmpRoutesFound);

    // Return the fully resolved root schema
    return root;
  }

  /**
   * Converts a JavaScript object to a JSON string.
   * Encryption is not implemented yet.
   *
   * @param data - Object to stringify.
   * @param encrypt - Whether to encrypt the string (pending).
   */
  stringify(data: any, encrypt: boolean = false): string {
    return JSON.stringify(data);
  }

  /**
   * Parses a JSON string back to an object.
   * Decryption is not implemented yet.
   *
   * @param data - JSON string to parse.
   */
  parse(data: string): any {
    return JSON.parse(data);
  }

  /**
   * Saves a value in the global storage and optionally in localStorage/sessionStorage.
   *
   * @param key - Key used to identify the stored value.
   * @param data - Value to store.
   * @param options - Storage options.
   */
  set(
    key: string,
    data: any,
    {
      dispatch = true,
      storage = 'local',
      encrypt = false
    }: {
      dispatch?: boolean;
      storage?: 'local' | 'session' | null;
      encrypt?: boolean;
    } = {}
  ): void {
    // Save in localStorage or sessionStorage according to option
    if (storage === 'local') {
      localStorage.setItem(this.prefixStorage + key, this.stringify(data, encrypt));
    } else if (storage === 'session') {
      sessionStorage.setItem(this.prefixStorage + key, this.stringify(data, encrypt));
    }

    // Save in memory (GLOBAL_STATE)
    GLOBAL_STATE[key] = data;

    // Dispatch global event indicating the key was updated
    if (dispatch) {
      eventHandler.dispatch('global.' + key, data);
    }
  }

  /**
   * Retrieves a value from global or browser storage.
   *
   * @param key - Key of the desired value.
   * @returns Stored value or undefined.
   */
  get(key: string): any {
    // Retrieve from GLOBAL_STATE if already present
    if (GLOBAL_STATE[key] === undefined) {
      // Try to retrieve from sessionStorage
      let value = sessionStorage.getItem(this.prefixStorage + key);

      // If not in sessionStorage, try localStorage
      if (value === null) {
        value = localStorage.getItem(this.prefixStorage + key);
      }

      // If found, save in GLOBAL_STATE
      if (value !== null) {
        GLOBAL_STATE[key] = this.parse(value);
      }
    }

    return GLOBAL_STATE[key];
  }

  /**
   * Removes a value from global and optional browser storage.
   *
   * @param key - Key of the value to remove.
   * @param options - Removal options.
   */
  remove(
    key: string,
    {
      storage = null,
      dispatch = true
    }: {
      storage?: 'local' | 'session' | null;
      dispatch?: boolean;
    } = {}
  ): void {
    // Remove from the specified storage or both
    if (storage === 'local') {
      localStorage.removeItem(this.prefixStorage + key);
    } else if (storage === 'session') {
      sessionStorage.removeItem(this.prefixStorage + key);
    } else {
      localStorage.removeItem(this.prefixStorage + key);
      sessionStorage.removeItem(this.prefixStorage + key);
    }

    // Remove from GLOBAL_STATE
    delete GLOBAL_STATE[key];

    // Dispatch global event indicating the key was removed
    if (dispatch) {
      eventHandler.dispatch('global.' + key);
    }
  }

  /**
   * Retrieves all global definitions combined with the root schema definitions.
   *
   * @returns Fully resolved definitions object.
   */
  getRootDefinitions(): Record<string, any> {
    const allDefs = deepMerge({}, ...this.globalDefinitions, this.props!.schema!.definitions || {});
    return resolveRefs(allDefs, { definitions: allDefs });
  }

  /**
   * Gets combined and resolved definitions for a view by name.
   *
   * @param name - View name to retrieve definitions for.
   * @returns Resolved view definitions or an empty object.
   */
  getViewDefinitions(name: string): Record<string, any> {
    if (!this.routes[name]?.definitions) return {};

    const allDefs = deepMerge({}, ...this.globalDefinitions, this.routes[name].definitions || {});
    return resolveRefs(allDefs, { definitions: allDefs });
  }

  /**
   * Returns all current global definitions.
   *
   * @returns Array of global definitions.
   */
  getGlobalDefinitions(): Array<any> {
    const allDefs = deepMerge({}, ...this.globalDefinitions);
    return resolveRefs(allDefs, { definitions: allDefs });
  }

  /**
   * Returns the keys currently stored in global state.
   *
   * @returns Array of global state keys.
   */
  getGlobalKeys(): string[] {
    return Object.keys(GLOBAL_STATE);
  }

  /**
   * Executes a promise ensuring a minimum wait time.
   *
   * @param promise - Promise to execute.
   * @param timeout - Minimum time in milliseconds before resolving.
   * @returns Result of the original promise after waiting.
   */
  async minTimeout<T>(promise: Promise<T>, timeout: number = this.props!.minTimeout!): Promise<T> {
    const [result] = await Promise.all([
      promise,
      new Promise(resolve => setTimeout(resolve, timeout))
    ]);
    return result;
  }

  /**
   * Adds new global headers to HTTP request configuration.
   *
   * @param headers - Headers to add.
   */
  addHeaders(headers: Record<string, string>): void {
    Object.assign(this.props!.apiHeaders!, headers);
  }

  /**
   * Removes one or more global headers from HTTP request configuration.
   *
   * @param headerNames - Names of headers to remove.
   */
  removeHeaders(...headerNames: Array<string | string[]>): void {
    const apiHeaders = this.props!.apiHeaders as Record<string, string>;
    headerNames
      .flat()
      .filter(Boolean)
      .forEach((headerName: string) => {
        delete apiHeaders[headerName];
      });
  }

  /**
   * Performs an HTTP request using the Fetch API with advanced configuration.
   *
   * @param url - Endpoint relative to the base API.
   * @param options - Request options.
   * @returns Promise with the processed response or an error.
   */
  fetch(
    url: string,
    options: RequestAppGoat & {
      query?: Record<string, any>;
      format?: 'json' | 'text' | 'blob' | 'raw';
      timeout?: number;
      body?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<any> {
    options.method = options.method || 'GET';

    const requestKey = `${options.method}${url}`;

    // AbortController to cancel previous active requests
    if (this.fetchList[requestKey]) {
      this.fetchList[requestKey].abort();
    }

    const {
      query = {},
      format = 'json',
      timeout = this.props!.maxTimeout,
      body,
      headers,
      ...confraw
    } = this.props!.fetchBefore!(url, options);

    const conf = confraw as RequestAppGoat;
    if (body) conf.body = JSON.stringify(body);

    // Build final URL with query params
    const finalUrl = new URL(urlJoin(this.props!.api!, url));
    const flattenQuery = flatten(query, { ommitArrays: true });
    Object.entries(flattenQuery).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => finalUrl.searchParams.append(key, v));
      } else if (['number', 'boolean', 'string'].includes(typeof value)) {
        finalUrl.searchParams.set(key, value as string);
      }
    });

    // Handle timeout with custom AbortController
    if (timeout) {
      const abortCtrl = new AppGoatAbortController();
      this.fetchList[requestKey] = abortCtrl;
      conf.signal = abortCtrl.signal;

      abortCtrl.timeoutId = setTimeout(() => this.onTimeout(abortCtrl), timeout);
    }

    // Prepare final headers
    const apiHeaders =
      typeof this.props!.apiHeaders === 'object'
        ? this.props!.apiHeaders
        : typeof this.props!.apiHeaders === 'string'
          ? this.props!.apiHeaders.split('|').reduce((acc, c) => {
            const [key, ...value] = c.split(':').map(s => s.trim());
            acc[key] = value.join(':');
            return acc;
          }, {} as Record<string, string>)
          : {};

    conf.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...apiHeaders,
      ...headers
    };

    const fetchPromise = fetch(finalUrl.toString(), conf)
      .then(async r => {
        delete this.fetchList[requestKey];
        if (!r.ok) {
          const err = new Error(r.statusText) as any;
          err.status = r.status;
          const json = await r.json();
          Object.assign(err, json);
          throw err;
        }
        return format === 'raw' ? r : r[format as 'json' | 'text']();
      })
      .catch(e => {
        e.error = true;
        if (e.name === 'AbortError') {
          const timeoutErr = new AppGoatError('timeout');
          timeoutErr.message = 'timeout';
          timeoutErr.error = true;
          return this.props!.fetchError!(timeoutErr, url);
        }
        console.error(e);
        return this.props!.fetchError!(e, url);
      })
      .then(this.props!.fetchAfter)
      .finally(() => {
        if (timeout && this.fetchList[requestKey]) {
          clearTimeout(this.fetchList[requestKey].timeoutId);
          delete this.fetchList[requestKey];
        }
      });

    return this.minTimeout(fetchPromise);
  }

  /**
   * Cancels HTTP requests when the maximum timeout is reached.
   *
   * @param controller - AbortController of the request to cancel.
   */
  onTimeout(controller: AbortController & { timeout?: boolean }): void {
    controller.timeout = true;
    controller.abort();
  }

  /**
   * Returns the current application language.
   */
  getLang(): string {
    return getLang();
  }

}

export default new AppGoatController();
