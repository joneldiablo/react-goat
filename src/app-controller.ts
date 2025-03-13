import React from "react";
import urlJoin from "url-join";

import {
  flatten,
  randomS4,
  resolveRefs,
  deepMerge,
  eventHandler,
  addDictionary,
  addFormatDate,
  addFormatNumber,
  addFormatTime,
  getLang,
  setLang,
  addFormatDateTime
} from "dbl-utils";

import { addIcons } from "./media/icons";
import { addComponents } from "./components";
import { addControllers } from "./controllers";
import { addFields } from "./fields";
import Controller from "./controllers/controller";
import { RouteProps } from "./react-router-schema/route";

// Estado global almacenado en memoria
const GLOBAL_STATE: Record<string, any> = {};

export interface RequestAppGoat extends RequestInit {
  query?: Record<string, any>;
  format?: 'raw' | 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';
  timeout?: number;
  body?: any;
}

/**
 * Propiedades del constructor principal del AppController
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
 * Clase principal para controlar la aplicación
 */
export class AppGoatController {

  // Almacena controladores AbortController de peticiones activas
  fetchList: Record<string, AppGoatAbortController> = {};

  // Almacena definiciones globales
  globalDefinitions: Array<any> = [];

  // Almacena rutas por nombre de vista
  routes: Record<string, any> = {};

  // Contador temporal de rutas encontradas durante inicialización
  tmpRoutesFound: number = 0;

  // Esquema raíz procesado con rutas anidadas
  rootSchema?: RouteProps;

  // Identificador random para esta instancia
  random: string = randomS4();

  // Propiedades pasadas al controlador
  props?: AppGoatControllerProps;

  // Prefijo usado para almacenamiento local y de sesión
  prefixStorage: string = '_gs.';

  // Función opcional para actualizar estado externo
  update?: (key: string) => void;

  constructor(props?: AppGoatControllerProps) {
    if (props) this.init(props);
  }

  /**
   * Inicializa la configuración principal del AppController.
   *
   * @param props - Propiedades iniciales para configurar la aplicación.
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

    // Guardar propiedades iniciales completas
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

    // Registrar íconos globales si existen
    if (icons) addIcons(icons);

    // Combinar definiciones globales iniciales
    this.globalDefinitions.push(
      ...(Array.isArray(definitions) ? definitions : [definitions])
    );

    // Indexar rutas por nombre de vista y avisar si hay sobrescrituras
    this.routes = routes.reduce((rdx, route) => {
      if (rdx[route.view.name]) {
        console.warn(`Route ${route.view.name} overwritten`);
      }
      rdx[route.view.name] = route;
      return rdx;
    }, {} as Record<string, any>);

    // Registrar extensiones de campos, componentes y controladores globales
    if (fields) addFields(fields);
    if (components) addComponents(components);
    if (controllers) addControllers(controllers);

    // Añadir formatos personalizados globales
    if (dictionary) addDictionary(dictionary);
    if (formatDate) addFormatDate(formatDate);
    if (formatNumber) addFormatNumber(formatNumber);
    if (formatTime) addFormatTime(formatTime);
    if (formatDateTime) addFormatDateTime(formatDateTime);

    // Establecer lenguaje global
    if (lang) setLang(lang);

    // Establecer el estado inicial en almacenamiento local/session o GLOBAL_STATE
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

    // Preparar esquema raíz y rutas
    schema.view.path = schema.view.path || '/';
    this.rootSchema = this.buildRootSchema(schema);

    // Aviso informativo total de rutas
    console.info('Total Routes:', this.tmpRoutesFound);
  }

  /**
   * Método recursivo que procesa el esquema de rutas para construir una estructura navegable.
   *
   * @param schema - Esquema de rutas actual que se procesará recursivamente.
   * @returns El esquema de vista procesado, con todas las rutas internas resueltas.
   */
  findingRoutesRecursive(schema: RouteSchema): RouteProps {
    // Incrementa el contador temporal de rutas encontradas
    this.tmpRoutesFound++;

    // Combina definiciones globales con las definiciones locales del esquema actual
    const newDefs = deepMerge({}, ...this.globalDefinitions, schema.definitions || {});

    // Resuelve referencias internas de la vista usando definiciones combinadas
    const view = resolveRefs(schema.view, { definitions: newDefs, data: schema.data || {} });

    // Procesa rutas anidadas si existen
    if (schema.routes?.length) {
      view.routes = Object.entries(
        resolveRefs(schema.routes, { routes: this.routes }) as RouteSchema[]
      ).map(([key, route]: [string, RouteSchema]) => {
        // Manejo de error: ruta sin vista definida
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

        // Llamada recursiva para seguir procesando rutas anidadas
        return this.findingRoutesRecursive(route);
      });
    }

    // Devuelve la vista ya procesada
    return view;
  }


  /**
   * Construye el esquema raíz a partir del esquema inicial, resolviendo todas las rutas internas.
   *
   * @param schema - Esquema inicial desde el cual comenzar a construir el árbol de rutas.
   * @returns Esquema raíz completamente procesado.
   */
  buildRootSchema(schema: RouteSchema): RouteProps {
    // Reinicia el contador temporal de rutas encontradas
    this.tmpRoutesFound = 0;

    // Construye el esquema raíz invocando la función recursiva
    const root = this.findingRoutesRecursive(schema);

    // Muestra en consola el total de rutas encontradas tras la construcción
    console.info('Total Routes:', this.tmpRoutesFound);

    // Retorna el esquema raíz completamente resuelto
    return root;
  }

  /**
   * Convierte un objeto JavaScript a una cadena JSON.
   * Futuramente podrá encriptar la cadena si la opción es activada.
   *
   * @param data - Objeto JavaScript a convertir en JSON.
   * @param encrypt - Indica si la cadena debe encriptarse (pendiente).
   * @returns Cadena JSON (posiblemente encriptada a futuro).
   */
  stringify(data: any, encrypt: boolean = false): string {
    // TODO: Implementar cifrado de datos en el futuro
    return JSON.stringify(data);
  }

  /**
   * Convierte una cadena JSON nuevamente a objeto JavaScript.
   * Futuramente podrá desencriptar la cadena si está cifrada.
   *
   * @param data - Cadena JSON a parsear.
   * @returns Objeto JavaScript original.
   */
  parse(data: string): any {
    // TODO: Implementar descifrado en el futuro
    return JSON.parse(data);
  }

  /**
   * Guarda un valor en el almacenamiento global y opcionalmente en localStorage/sessionStorage.
   *
   * @param key - Clave para identificar el valor guardado.
   * @param data - Valor que será guardado.
   * @param options - Opciones para configurar el guardado.
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
    // Guarda en localStorage o sessionStorage según la opción elegida
    if (storage === 'local') {
      localStorage.setItem(this.prefixStorage + key, this.stringify(data, encrypt));
    } else if (storage === 'session') {
      sessionStorage.setItem(this.prefixStorage + key, this.stringify(data, encrypt));
    }

    // Guarda en memoria (GLOBAL_STATE)
    GLOBAL_STATE[key] = data;

    // Dispara evento global indicando que la clave fue actualizada
    if (dispatch) {
      eventHandler.dispatch('global.' + key, data);
    }
  }

  /**
   * Recupera un valor del almacenamiento global o de localStorage/sessionStorage.
   *
   * @param key - Clave del valor que se desea recuperar.
   * @returns Valor almacenado o undefined si no existe.
   */
  get(key: string): any {
    // Recupera de GLOBAL_STATE si ya existe
    if (GLOBAL_STATE[key] === undefined) {
      // Intenta recuperar del sessionStorage
      let value = sessionStorage.getItem(this.prefixStorage + key);

      // Si no está en sessionStorage intenta en localStorage
      if (value === null) {
        value = localStorage.getItem(this.prefixStorage + key);
      }

      // Si lo encuentra, guarda en GLOBAL_STATE
      if (value !== null) {
        GLOBAL_STATE[key] = this.parse(value);
      }
    }

    return GLOBAL_STATE[key];
  }

  /**
   * Elimina un valor del almacenamiento global y opcionalmente del localStorage/sessionStorage.
   *
   * @param key - Clave del valor que se desea eliminar.
   * @param options - Opciones para configurar la eliminación.
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
    // Remueve del storage especificado o de ambos
    if (storage === 'local') {
      localStorage.removeItem(this.prefixStorage + key);
    } else if (storage === 'session') {
      sessionStorage.removeItem(this.prefixStorage + key);
    } else {
      localStorage.removeItem(this.prefixStorage + key);
      sessionStorage.removeItem(this.prefixStorage + key);
    }

    // Elimina del GLOBAL_STATE
    delete GLOBAL_STATE[key];

    // Dispara evento global indicando que la clave fue removida
    if (dispatch) {
      eventHandler.dispatch('global.' + key);
    }
  }

  /**
   * Obtiene todas las definiciones globales combinadas con las definiciones del esquema raíz.
   *
   * @returns Objeto con definiciones resueltas completamente.
   */
  getRootDefinitions(): Record<string, any> {
    const allDefs = deepMerge({}, ...this.globalDefinitions, this.props!.schema!.definitions || {});
    return resolveRefs(allDefs, { definitions: allDefs });
  }

  /**
   * Obtiene definiciones combinadas y resueltas específicas para una vista por su nombre.
   *
   * @param name - Nombre de la vista cuyas definiciones se desean recuperar.
   * @returns Objeto con definiciones específicas de la vista resueltas, o vacío si no existen.
   */
  getViewDefinitions(name: string): Record<string, any> {
    if (!this.routes[name]?.definitions) return {};

    const allDefs = deepMerge({}, ...this.globalDefinitions, this.routes[name].definitions || {});
    return resolveRefs(allDefs, { definitions: allDefs });
  }

  /**
   * Devuelve todas las definiciones globales actuales (sin resolver referencias).
   *
   * @returns Array con definiciones globales.
   */
  getGlobalDefinitions(): Array<any> {
    const allDefs = deepMerge({}, ...this.globalDefinitions);
    return resolveRefs(allDefs, { definitions: allDefs });
  }

  /**
   * Devuelve un array con todas las claves almacenadas actualmente en el estado global.
   *
   * @returns Array con las claves del GLOBAL_STATE.
   */
  getGlobalKeys(): string[] {
    return Object.keys(GLOBAL_STATE);
  }

  /**
   * Ejecuta una promesa asegurando un tiempo mínimo de espera especificado.
   *
   * @param promise - Promesa que se ejecutará.
   * @param timeout - Tiempo mínimo en milisegundos que la promesa debe tardar en resolverse.
   * @returns Resultado de la promesa original tras esperar el tiempo mínimo.
   */
  async minTimeout<T>(promise: Promise<T>, timeout: number = this.props!.minTimeout!): Promise<T> {
    const [result] = await Promise.all([
      promise,
      new Promise(resolve => setTimeout(resolve, timeout))
    ]);
    return result;
  }

  /**
   * Añade nuevas cabeceras globales a la configuración de peticiones HTTP.
   *
   * @param headers - Objeto que contiene las cabeceras a añadir.
   */
  addHeaders(headers: Record<string, string>): void {
    Object.assign(this.props!.apiHeaders!, headers);
  }

  /**
   * Elimina una o varias cabeceras globales de la configuración de peticiones HTTP.
   *
   * @param headerNames - Nombres de las cabeceras a eliminar.
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
   * Realiza una petición HTTP usando Fetch API con configuración avanzada.
   *
   * @param url - Endpoint relativo al API base configurado.
   * @param options - Opciones para personalizar la petición.
   * @returns Promesa con la respuesta procesada o un error.
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

    // AbortController para cancelar peticiones activas previas
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

    // Construir URL final con query params
    const finalUrl = new URL(urlJoin(this.props!.api!, url));
    const flattenQuery = flatten(query, { ommitArrays: true });
    Object.entries(flattenQuery).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => finalUrl.searchParams.append(key, v));
      } else if (['number', 'boolean', 'string'].includes(typeof value)) {
        finalUrl.searchParams.set(key, value as string);
      }
    });

    // Manejo de timeout con CustomAbortController
    if (timeout) {
      const abortCtrl = new AppGoatAbortController();
      this.fetchList[requestKey] = abortCtrl;
      conf.signal = abortCtrl.signal;

      abortCtrl.timeoutId = setTimeout(() => this.onTimeout(abortCtrl), timeout);
    }

    // Preparar headers finales
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
   * Maneja la cancelación de peticiones HTTP cuando se alcanza el tiempo máximo de espera.
   *
   * @param controller - AbortController de la petición que será cancelada.
   */
  onTimeout(controller: AbortController & { timeout?: boolean }): void {
    controller.timeout = true;
    controller.abort();
  }

  /**
   * Obtiene el lenguaje actualmente configurado para la aplicación.
   *
   * @returns Lenguaje actual.
   */
  getLang(): string {
    return getLang();
  }

}

export default new AppGoatController();
