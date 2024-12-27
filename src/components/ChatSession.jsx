import { useEffect, useState } from 'react';
import axios from 'axios';

const ChatSession = ({ initialPrompt }) => {
	const [chatGPTQuestion, setChatGPTQuestion] = useState('');
	const [helperPrompts, setHelperPrompts] = useState([]);

	// Fetch the question and helper prompts when the initialPrompt is available
	useEffect(() => {
		if (initialPrompt) {
			axios
				.post('http://localhost:8000/api/start', {
					prompt: initialPrompt,
				})
				.then((response) => {
					setChatGPTQuestion(response.data.question);
					setHelperPrompts(response.data.helperPrompts);
				})
				.catch((error) => {
					console.error('Error starting session:', error);
				});
		}
	}, [initialPrompt]);

	return (
		<div>
			<div className="question-container">
				<p>{chatGPTQuestion}</p>
			</div>
		</div>
	);
};

export default ChatSession;
