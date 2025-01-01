import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/InteractionPage.css';
import ChatSession from '../components/ChatSession';
import { enterFullScreen, exitFullScreen } from '../utils/fullscreen';

const InteractionPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { subject, yearLevel, topic, selectedPrompt } = location.state || {};

	useEffect(() => {
		enterFullScreen();
		return () => {
			exitFullScreen();
		};
	}, []);

	const initialPrompt = `Acting as an expert in diagnostic questioning and computer adaptive testing, assess my knowledge of ${topic}. Start at the 'Unistructural' level using SOLO Taxonomy. Adjust questions based on my proficiency. After each response, evaluate my answer, provide direct feedback, and either ask the next question or rephrase the current one.`;

	const [chatGPTQuestion, setChatGPTQuestion] = useState('');
	const [answer, setAnswer] = useState('');
	const [feedback, setFeedback] = useState('');
	const [incorrectCount, setIncorrectCount] = useState(0); // Track incorrect answers
	const [currentLevel, setCurrentLevel] = useState('Unistructural');

	useEffect(() => {
		axios
			.post('http://localhost:8000/api/start', {
				prompt: initialPrompt,
				currentLevel,
			})
			.then((response) => {
				setChatGPTQuestion(response.data.question);
			})
			.catch((error) => {
				console.error('Error fetching the question:', error);
			});
	}, [initialPrompt, currentLevel]);

	const handleSubmit = () => {
		axios
			.post('http://localhost:8000/api/evaluate', {
				answer,
				initialPrompt,
				currentLevel,
			})
			.then((response) => {
				const isCorrect = response.data.isCorrect;
				const nextQuestion = response.data.nextQuestion;
				const nextLevel = response.data.nextLevel;

				if (isCorrect) {
					setFeedback('Correct! Moving to the next question.');
					setIncorrectCount(0);
					setCurrentLevel(nextLevel);
					setChatGPTQuestion(nextQuestion);
				} else {
					setFeedback('Incorrect.');
					const newCount = incorrectCount + 1;
					setIncorrectCount(newCount);

					if (newCount >= 3) {
						setChatGPTQuestion(
							`You have answered incorrectly 3 times. Please study the topic "${topic}" further and try again.`
						);
					} else {
						axios
							.post('http://localhost:8000/api/rephrase', {
								currentQuestion: chatGPTQuestion,
							})
							.then((res) => {
								setChatGPTQuestion(res.data.rephrasedQuestion);
							})
							.catch((err) => {
								console.error(
									'Error rephrasing question:',
									err
								);
								setChatGPTQuestion(
									'Unable to rephrase the question at the moment.'
								);
							});
					}
				}
			})
			.catch((error) => {
				console.error('Error evaluating answer:', error);
				setFeedback(
					'An error occurred while processing your response.'
				);
			});
	};

	return (
		<div className="prompt-interaction-container">
			<h1>Selected Prompt: {selectedPrompt || 'No prompt selected!'}</h1>
			<ChatSession initialPrompt={initialPrompt} />
			<div className="feedback-section">
				<p>{feedback}</p>
			</div>
			<div className="question-container">
				<textarea
					className="output-box"
					readOnly
					value={chatGPTQuestion}
				/>
			</div>
			<div className="answer-input">
				<textarea
					value={answer}
					onChange={(e) => setAnswer(e.target.value)}
					placeholder="Type your answer here"
					onPaste={(e) => e.preventDefault()}
				/>
				<button onClick={handleSubmit}>Submit Answer</button>
			</div>
		</div>
	);
};

export default InteractionPage;

// Features - meeting with Adrian

//  Ready by 22nd or 23rd to present.
//  Change feedback to not say the level we are on - just level 1, or level 2 etc, and tell them when it levels up.
//  Keep entire conversation in the output box.
//  Add a button to restart the conversation.

//

// BONUS FEATURES
//  Helpful prompts - Should be buttons
// 1st Button - I can't spell it - Show me with 3 words or phrases to choose from and I will identify the correct answer.
// 2nd Button - I can't remember - remind me. Short, concise information.
// 3rd Button - We didn't learn that - Goes to another topic

// Features to focus on
// Scrolling feature of entire conversation. The students answers should be in the output box. plus the chat gpt's question. Student's answers in one color, chat GPT questions in another question.

// Web hosting

// Teacher can upload a CSV with concepts, and then the chat GPT will ask questions based on that.
