import { LayoutContext } from "../contexts/layout";
import { useContext } from "react";

export function useLayout () {
  return useContext(LayoutContext);
}
