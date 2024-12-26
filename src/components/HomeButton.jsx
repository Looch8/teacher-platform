import { useNavigate } from 'react-router-dom';
import '../styles/HomeButton.css';

function HomeButton() {
	const navigate = useNavigate();

	const handleGoHome = () => {
		navigate('/'); // Navigate to the home page
	};

	return (
		<button className="home-btn" onClick={handleGoHome}>
			🏠 Home
		</button>
	);
}

export default HomeButton;
