import Component, { ComponentProps } from "./component";
import { addComponents } from "./components";
import Icons from "./media/icons";
import Image from "./media/image";
import Svg from "./media/svg";
import SvgImports from "./media/svg-imports";
import Video from "./media/video";
import YoutubeVideo from "./media/youtube-video";

export type MediaComponents = Record<string, typeof Component | React.FC<ComponentProps> | any>;

const MEDIA_COMPONENTS: MediaComponents = {
  Icons,
  Image,
  Svg,
  SvgImports,
  Video,
  YoutubeVideo,
};

export const addMediaComponents = (mediaComponents: MediaComponents) => {
  Object.assign(MEDIA_COMPONENTS, mediaComponents);
  addComponents(mediaComponents as Record<string, typeof Component<any, any>>);
}

export default MEDIA_COMPONENTS;