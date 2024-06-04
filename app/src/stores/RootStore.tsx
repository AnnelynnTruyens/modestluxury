import UiStore from "./UiStore";

class RootStore {
	UiStore: UiStore;
	constructor() {
		this.UiStore = new UiStore(this);
	}
}

export default RootStore;
