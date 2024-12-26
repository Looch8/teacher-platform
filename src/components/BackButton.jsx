import { useNavigate } from 'react-router-dom';
import '../styles/BackButton.css';

function BackButton() {
	const navigate = useNavigate();

	const handleGoBack = () => {
		navigate(-1); // Go back to the previous page
	};

	return (
		<button className="back-button" onClick={handleGoBack}>
			← Back
		</button>
	);
}

export default BackButton;
