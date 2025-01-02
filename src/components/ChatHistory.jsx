import '../styles/ChatHistory.css';

const ChatHistory = ({ conversation }) => {
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
		</div>
	);
};

export default ChatHistory;
