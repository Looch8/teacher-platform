import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // For communication with the backend
import '../styles/InteractionPage.css';

const InteractionPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { subject, yearLevel, topic, selectedPrompt } = location.state || {};

	const initialPrompt = `Acting as an expert in diagnostic questioning and computer adaptive testing, please assess my knowledge and understanding of ${topic}. ${selectedPrompt}`;

	const [chatGPTQuestion, setChatGPTQuestion] = useState('');
	const [answer, setAnswer] = useState('');
	const [helperPrompts, setHelperPrompts] = useState([]);
	const [response, setResponse] = useState('');

	// Fetch the question and helper prompts from the backend
	useEffect(() => {
		// Call the backend API to get the initial question and helper prompts
		axios
			.post('/api/start', { prompt: initialPrompt })
			.then((response) => {
				setChatGPTQuestion(response.data.question);
				setHelperPrompts(response.data.helperPrompts);
			})
			.catch((error) => {
				console.error('Error fetching the question:', error);
			});
	}, [initialPrompt]);

	const handleSubmit = () => {
		// Send the answer to the backend to evaluate
		axios
			.post('/api/evaluate', { answer, initialPrompt })
			.then((response) => {
				setResponse(response.data.feedback); // Receive feedback from ChatGPT
				setChatGPTQuestion(response.data.nextQuestion); // If next question is returned
			})
			.catch((error) => {
				console.error('Error evaluating answer:', error);
			});
	};

	return (
		<div className="prompt-interaction-container">
			<h1>Selected Prompt: {selectedPrompt || 'No prompt selected!'}</h1>
			<div className="question-container">
				<p>{chatGPTQuestion}</p>
				<textarea
					className="output-box"
					readOnly
					value={chatGPTQuestion}
				/>
			</div>
			<div className="helper-prompts">
				<h3>Helpful Prompts</h3>
				<ul>
					{helperPrompts.map((prompt, index) => (
						<li key={index}>{prompt}</li>
					))}
				</ul>
			</div>
			<div className="answer-input">
				<textarea
					value={answer}
					onChange={(e) => setAnswer(e.target.value)}
					placeholder="Type your answer here"
					onPaste={(e) => e.preventDefault()} // Disable paste functionality
				/>
				<button onClick={handleSubmit}>Submit Answer</button>
			</div>
			{response && <div className="response-feedback">{response}</div>}
		</div>
	);
};

export default InteractionPage;
