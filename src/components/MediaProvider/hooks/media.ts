import { MediaContext } from "../contexts/media";
import { useContext } from "react";

export function useMedia () {
  return useContext(MediaContext);
}
