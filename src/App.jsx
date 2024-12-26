import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RevisionPage from './pages/RevisionPage';
import PromptPage from './pages/PromptPage';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/revision" element={<RevisionPage />} />
				<Route path="/prompt" element={<PromptPage />} />
			</Routes>
		</Router>
	);
}

export default App;
