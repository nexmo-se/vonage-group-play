import { SessionContext } from "../contexts/session";
import { useContext } from "react";

export function useSession () {
  return useContext(SessionContext);
}