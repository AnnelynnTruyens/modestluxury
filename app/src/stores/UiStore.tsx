import { User } from "../services/AuthService";
import RootStore from "./RootStore";

class UiStore {
	rootStore: RootStore;
	currentUser: User | undefined;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		this.currentUser = undefined;
	}

	setCurrentUser = (user: User | undefined) => {
		this.currentUser = user;
	};

	getCurrentUser = () => {
		return this.currentUser;
	};
}

export default UiStore;
