import { LayoutContext } from "./contexts/layout";
import { LayoutType } from "./types/layout";
import { useState } from "react";

interface LayoutProviderProps {
  children: any;
}

function LayoutProvider ({ children }: LayoutProviderProps) {
  const [layout, setLayout] = useState<LayoutType>("normal");

  return (
    <LayoutContext.Provider
      value={{
        layout,
        setLayout
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export { Layout } from "./enums/layout";
export { useLayout } from "./hooks/layout";
export default LayoutProvider;