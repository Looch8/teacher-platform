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

Only move to the next level once I've answered multiple questions of each level and shown the necessary proficiency to level up. If I have not demonstrated enough understanding of a concept or idea, ask me a specific follow-up question on the same content.

Incorporate an Item Response Theory (IRT) framework by considering each question's difficulty level and my ability level, adapting subsequent questions to better differentiate between levels of understanding as I progress.

After 'Unistructural', move through the other SOLO levels until I possibly reach Extended Abstract, but only if I consistently show adequate proficiency at each level. 

If after multiple questions at the same level I can't demonstrate satisfactory proficiency, finish the conversation and provide me with helpful feedback.

Keep your questions direct, with limited unnecessary dialogue around the line of questioning. Never, at anytime, paraphrase or restate my correct/complete answers. Only clarify specific details if I am off track or incorrect, alternatively, ask another question to clarify my understanding.
`;

	const [chatGPTQuestion, setChatGPTQuestion] = useState('');
	const [answer, setAnswer] = useState('');
	const [helperPrompts, setHelperPrompts] = useState([]);
	const [feedback, setFeedback] = useState(''); // For feedback text
	const [response, setResponse] = useState(''); // For next question

	// Fetch the question and helper prompts from the backend
	useEffect(() => {
		axios
			.post('http://localhost:8000/api/start', { prompt: initialPrompt })
			.then((response) => {
				setChatGPTQuestion(response.data.question);
				setHelperPrompts(response.data.helperPrompts);
			})
			.catch((error) => {
				console.error('Error fetching the question:', error);
			});
	}, [initialPrompt]);

	const handleSubmit = () => {
		axios
			.post('http://localhost:8000/api/evaluate', {
				answer,
				initialPrompt,
			})
			.then((response) => {
				console.log('Full response:', response.data); // Log the full response for each evaluation

				const feedbackText = response.data.feedback;
				let nextQuestion = response.data.nextQuestion;

				console.log('Feedback:', feedbackText);
				console.log('Next Question:', nextQuestion);

				// Ensure feedback is displayed
				if (feedbackText) {
					setFeedback(feedbackText);
				} else {
					console.warn('Feedback not provided:', response.data);
					setFeedback('No feedback provided.');
				}

				// Handle logic for continuing at the same SOLO level
				if (
					feedbackText.includes('No proficiency shown') ||
					feedbackText.includes('to progress to the next level')
				) {
					// If feedback indicates not enough proficiency for the next level, continue with the same question
					setChatGPTQuestion(
						'Please provide more details or demonstrate a deeper understanding at the current level.'
					);
				} else if (
					nextQuestion &&
					nextQuestion !== 'No next question available.'
				) {
					// If there's a valid next question, set it
					setChatGPTQuestion(nextQuestion);
				} else {
					// If there's no next question available, provide feedback instead
					setChatGPTQuestion(
						'No next question available. Please review the feedback.'
					);
				}
			})
			.catch((error) => {
				console.error('Error evaluating answer:', error);
				setFeedback(
					'An error occurred while processing your response.'
				);
				setChatGPTQuestion(
					'No next question available due to an error.'
				);
			});
	};

	return (
		<div className="prompt-interaction-container">
			<h1>Selected Prompt: {selectedPrompt || 'No prompt selected!'}</h1>
			<ChatSession initialPrompt={initialPrompt} />
			<div className="feedback-section">
				{/* Display the feedback text */}
				<p>{feedback}</p>
			</div>
			<div className="question-container">
				{/* The question text in the output box */}
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
		</div>
	);
};

export default InteractionPage;
