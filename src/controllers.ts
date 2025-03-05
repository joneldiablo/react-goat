import TitleController from "./controllers/title-controller";
import Controller from "./controllers/controller";

const CONTROLLERS: Record<string, typeof Controller<any, any>> = {
  TitleController,
  Controller
};

export const addControllers = (controllers: Record<string, typeof Controller>) => {
  Object.assign(CONTROLLERS, controllers);
}

export default CONTROLLERS;