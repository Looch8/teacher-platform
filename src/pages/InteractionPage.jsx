import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // For communication with the backend
import '../styles/InteractionPage.css';
import ChatSession from '../components/ChatSession';

const InteractionPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { subject, yearLevel, topic, selectedPrompt } = location.state || {};

	const initialPrompt = `Acting as an expert in diagnostic questioning and computer adaptive testing, please assess my knowledge and understanding of ${topic}. ${selectedPrompt}. Ask me one question at a time to measure my level of understanding, use SOLO Taxonomy as a framework with a mastery learning approach. 

Start at the 'Unistructural' level and continue asking questions at this level until I demonstrate strong proficiency and sophistication in my responses. 

Only move to the next level once I've answered multiple questions of each level and shown the necessary proficiency to level up. If I have not demonstrated enough understanding of a concept or idea, ask me a specific follow up question on the same content.

Incorporate an Item Response Theory (IRT) framework by considering each question's difficulty level and my ability level, adapting subsequent questions to better differentiate between levels of understanding as I progress.

After 'Unistructural', move through the other SOLO levels until I possibly reach Extended Abstract, but only if I consistently show adequate proficiency at each level. 

If after multiple questions at the same level I can't demonstrate satisfactory proficiency, finish the conversation and provide me with helpful feedback.

Keep your questions direct, with limited unnecessary dialogue around the line of questioning. Never, at anytime, paraphrase  or restate my correct/complete answers. Only clarify specific details if I am off track or incorrect, alternatively, ask another question to clarify my understanding.
`;

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
			<ChatSession initialPrompt={initialPrompt} />
			<div className="question-container">
				{/* The question text remains visible */}
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
				{/* Single input box for user answer */}
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
