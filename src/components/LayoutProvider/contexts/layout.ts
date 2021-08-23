import { createContext } from "react";

import { Dispatch, SetStateAction } from "react";
import { LayoutType } from "../types/layout";

interface LayoutContextProps {
  layout: LayoutType;
  setLayout: Dispatch<SetStateAction<LayoutType>>;
}

export const LayoutContext = createContext<LayoutContextProps>({
  layout: "normal"
} as LayoutContextProps);