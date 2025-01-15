import { useEffect } from 'react';
import '../styles/TypeformPopup.css';

const TypeformPopup = ({ onClose }) => {
	useEffect(() => {
		// Load Typeform embed script when the component mounts
		const script = document.createElement('script');
		script.src = '//embed.typeform.com/next/embed.js';
		script.async = true;
		document.body.appendChild(script);

		// Cleanup script when the component unmounts
		return () => {
			document.body.removeChild(script);
		};
	}, []);

	return (
		<div className="typeform-popup">
			<button className="close-button" onClick={onClose}>
				✖
			</button>{' '}
			<h3>📢 Help Us Improve!</h3>
			<p>Click below to leave your feedback.</p>
			<div data-tf-live="01JHMQKKY85JC3GHHRKNV2J2EH"></div>
		</div>
	);
};

export default TypeformPopup;
