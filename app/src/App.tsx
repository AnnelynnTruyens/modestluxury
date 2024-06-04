import "./App.css";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import AuthContainer from "./contexts/AuthContainer";
import Authentication from "./pages/Authentication/Authentication";

function App() {
	return (
		<>
			<AuthContainer>
				<Header />
				<Authentication />
				<Footer />
			</AuthContainer>
		</>
	);
}

export default App;
