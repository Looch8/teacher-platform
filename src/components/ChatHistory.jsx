// ChatHistory.jsx
import { useEffect, useRef, useState } from 'react';
import '../styles/ChatHistory.css';
import TypingText from './TypingText';

const ChatHistory = ({ conversation, isTyping }) => {
	const chatEndRef = useRef(null);
	const [displayedMessages, setDisplayedMessages] = useState([]);
	const [currentTypingIndex, setCurrentTypingIndex] = useState(null);

	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [displayedMessages, isTyping]);

	useEffect(() => {
		if (conversation.length > displayedMessages.length) {
			// Find last student message
			const lastStudentMessageIndex = [...conversation]
				.reverse()
				.findIndex((msg) => msg.sender === 'student');

			// Get all messages up to and including the last student message
			const messageIndexToShow =
				lastStudentMessageIndex !== -1
					? conversation.length - lastStudentMessageIndex - 1
					: 0;

			// Update displayed messages with all previous messages
			setDisplayedMessages((prev) => {
				// Keep existing displayed messages
				const newDisplayed = [...prev];
				// Add any student messages that came after
				for (let i = prev.length; i < conversation.length; i++) {
					if (conversation[i].sender === 'student') {
						newDisplayed.push(conversation[i]);
					}
				}
				return newDisplayed;
			});

			// Set the next chatbot message to be typed
			if (currentTypingIndex === null) {
				const nextTypingIndex = displayedMessages.length;
				if (
					nextTypingIndex < conversation.length &&
					conversation[nextTypingIndex].sender === 'chatgpt'
				) {
					setCurrentTypingIndex(nextTypingIndex);
				}
			}
		}
	}, [conversation, displayedMessages.length, currentTypingIndex]);

	const handleTypingComplete = () => {
		if (
			currentTypingIndex !== null &&
			currentTypingIndex < conversation.length
		) {
			// Add the completed message to displayed messages
			setDisplayedMessages((prev) => [
				...prev,
				conversation[currentTypingIndex],
			]);

			// Find next chatbot message that needs typing
			const nextIndex = currentTypingIndex + 1;
			if (
				nextIndex < conversation.length &&
				conversation[nextIndex].sender === 'chatgpt'
			) {
				setCurrentTypingIndex(nextIndex);
			} else {
				setCurrentTypingIndex(null);
			}
		}
	};

	return (
		<div className="chat-history">
			{/* Display completed messages */}
			{displayedMessages.map((message, index) => (
				<div
					key={index}
					className={`chat-message ${
						message.sender === 'student'
							? 'student-message'
							: 'chatgpt-message'
					}`}
				>
					{message.content}
				</div>
			))}

			{/* Display currently typing message */}
			{currentTypingIndex !== null &&
				currentTypingIndex < conversation.length &&
				conversation[currentTypingIndex].sender === 'chatgpt' && (
					<div className="chat-message chatgpt-message">
						<TypingText
							text={conversation[currentTypingIndex].content}
							onComplete={handleTypingComplete}
						/>
					</div>
				)}

			{isTyping && (
				<div className="typing-indicator">
					<span>.</span>
					<span>.</span>
					<span>.</span>
				</div>
			)}
			<div ref={chatEndRef} />
		</div>
	);
};

export default ChatHistory;
