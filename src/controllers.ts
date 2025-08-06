import TitleController from "./controllers/title-controller";
import Controller from "./controllers/controller";

/**
 * Registry of available controller classes.
 *
 * @example
 * ```ts
 * import { addControllers } from "react-goat";
 * addControllers({ Custom: CustomController });
 * ```
 */
const CONTROLLERS: Record<string, typeof Controller<any, any>> = {
  TitleController,
  Controller,
};

/**
 * Extends the global controller registry.
 *
 * @param controllers Map of controller constructors keyed by name.
 * @example
 * ```ts
 * addControllers({ Custom: CustomController });
 * ```
 */
export const addControllers = (controllers: Record<string, typeof Controller>) => {
  Object.assign(CONTROLLERS, controllers);
};

export default CONTROLLERS;