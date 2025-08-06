import Component, { ComponentProps } from "./component";
import { addComponents } from "./components";
import Icons from "./media/icons";
import Image from "./media/image";
import Svg from "./media/svg";
import SvgImports from "./media/svg-imports";
import Video from "./media/video";

/**
 * Map of media component constructors indexed by their public name.
 *
 * @example
 * ```tsx
 * import MEDIA_COMPONENTS from "@farm-js/react-goat/media";
 * const Icon = MEDIA_COMPONENTS.Icons;
 * ```
 */
export type MediaComponents = Record<string, typeof Component | React.FC<ComponentProps> | any>;

/**
 * Collection of built-in media components shipped with the library.
 */
const MEDIA_COMPONENTS: MediaComponents = {
  Icons,
  Image,
  Svg,
  SvgImports,
  Video,
};

/**
 * Registers additional media components.
 *
 * @example
 * ```tsx
 * import { addMediaComponents } from "@farm-js/react-goat/media";
 * const Audio = () => <div />;
 * addMediaComponents({ Audio });
 * ```
 *
 * @param mediaComponents - Components to merge into the registry.
 */
export const addMediaComponents = (mediaComponents: MediaComponents): void => {
  Object.assign(MEDIA_COMPONENTS, mediaComponents);
  addComponents(mediaComponents as Record<string, typeof Component<any, any>>);
};

/**
 * Default export exposing all registered media components.
 *
 * @example
 * ```tsx
 * import MEDIA_COMPONENTS from "@farm-js/react-goat/media";
 * const SvgComp = MEDIA_COMPONENTS.Svg;
 * ```
 */
export default MEDIA_COMPONENTS;
