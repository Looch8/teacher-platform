// TypingText.jsx
import { useState, useEffect } from 'react';

const TypingText = ({ text, speed = 30, onComplete }) => {
	const [displayedText, setDisplayedText] = useState('');

	useEffect(() => {
		setDisplayedText(''); // Reset text when receiving new content
		let currentIndex = 0;

		const interval = setInterval(() => {
			if (currentIndex < text.length) {
				setDisplayedText((prev) => text.slice(0, currentIndex + 1));
				currentIndex++;
			} else {
				clearInterval(interval);
				if (onComplete) onComplete();
			}
		}, speed);

		return () => clearInterval(interval);
	}, [text, speed, onComplete]);

	return <span>{displayedText}</span>;
};

export default TypingText;
