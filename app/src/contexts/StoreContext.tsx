import { createContext } from "react";
import RootStore from "../stores/RootStore";

const store = new RootStore();

export const storeContext = createContext(store);
