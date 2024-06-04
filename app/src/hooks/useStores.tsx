import { useContext } from "react";
import { storeContext } from "../contexts/StoreContext";

const useStores = () => useContext(storeContext);

export default useStores;
