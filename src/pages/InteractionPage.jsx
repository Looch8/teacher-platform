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

	const initialPrompt = `Acting as an expert in diagnostic questioning and computer adaptive testing, please assess my knowledge and understanding of ${topic}. ${selectedPrompt}. Ask me one question at a time to measure my level of understanding, use SOLO Taxonomy as a framework with a mastery learning approach. Start at the 'Unistructural' level and continue asking questions at this level until I demonstrate strong proficiency and sophistication in my responses. 

Only move to the next level once I've answered multiple questions of each level and shown the necessary proficiency to level up. If I have not demonstrated enough understanding of a concept or idea, ask me a specific follow-up question on the same content.

Incorporate an Item Response Theory (IRT) framework by considering each question's difficulty level and my ability level, adapting subsequent questions to better differentiate between levels of understanding as I progress.

After 'Unistructural', move through the other SOLO levels until I possibly reach Extended Abstract, but only if I consistently show adequate proficiency at each level. 

If after multiple questions at the same level I can't demonstrate satisfactory proficiency, finish the conversation and provide me with helpful feedback.

Keep your questions direct, with limited unnecessary dialogue around the line of questioning. Never, at anytime, paraphrase or restate my correct/complete answers. Only clarify specific details if I am off track or incorrect, alternatively, ask another question to clarify my understanding.
`;

	const [chatGPTQuestion, setChatGPTQuestion] = useState('');
	const [answer, setAnswer] = useState('');
	const [feedback, setFeedback] = useState('');
	const [incorrectCount, setIncorrectCount] = useState(0); // Track incorrect answers
	const [currentLevel, setCurrentLevel] = useState('Prestructural'); // Default to Prestructural

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
		console.log(currentLevel);
		axios
			.post('http://localhost:8000/api/evaluate', {
				answer,
				initialPrompt,
				currentLevel,
			})
			.then((response) => {
				const isCorrect = response.data.isCorrect;
				const nextQuestion = response.data.nextQuestion;
				const nextLevel = response.data.nextLevel; // This should be returned from the backend

				if (isCorrect) {
					setFeedback('Correct!');
					setIncorrectCount(0);
					setCurrentLevel(nextLevel); // Update the level based on feedback
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

//  Keep feedback to "correct" or "incorrect" and provide a new question to the user.
//  Ready by 22nd or 23rd to present.
//  Change feedback to not say the level we are on - just level 1, or level 2 etc, and tell them when it levels up.
//  Keep entire conversation in the output box.
//  Add a button to restart the conversation.
//  Add cheat protection - if they copy and paste the question, it will not work.

//

// BONUS FEATURES
//  Helpful prompts - Should be buttons
// 1st Button - I can't spell it - Show me with 3 words or phrases to choose from and I will identify the correct answer.
// 2nd Button - I can't remember - remind me. Short, concise information.
// 3rd Button - We didn't learn that - Goes to another topic

// Features to focus on
// Fix bug
// Scrolling feature of entire conversation. The students answers should be in the output box. plus the chat gpt's question. Student's answers in one color, chat GPT questions in another question.
// Remove feedback response - If after multiple questions at the same level I can't demonstrate satisfactory proficiency, finish the conversation and provide me with helpful feedback.
//  Should just be question - answer, question - answer.
// If it is wrong, let them know and then continue to ask questions..
// Try to use Chat gpt-4
// Web hosting

// Teacher can upload a CSV with concepts, and then the chat GPT will ask questions based on that.
