import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RevisionPage from './pages/RevisionPage';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/revision" element={<RevisionPage />} />
			</Routes>
		</Router>
	);
}

export default App;
