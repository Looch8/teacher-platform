import { useEffect, useRef } from 'react';
import '../styles/ChatHistory.css';

const ChatHistory = ({ conversation, isTyping }) => {
	const chatEndRef = useRef(null);

	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [conversation]);

	return (
		<div className="chat-history">
			{conversation.map((message, index) => (
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
			{isTyping && (
				<div className="typing-indicator">
					<span>.</span>
					<span>.</span>
					<span>.</span>
				</div>
			)}
			{/* Invisible div to auto-scroll */}
			<div ref={chatEndRef} />
		</div>
	);
};

export default ChatHistory;
