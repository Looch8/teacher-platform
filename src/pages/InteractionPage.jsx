import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/InteractionPage.css';
import ChatSession from '../components/ChatSession';
import ChatHistory from '../components/ChatHistory';
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
	const [incorrectCount, setIncorrectCount] = useState(0);
	const [conversation, setConversation] = useState([]); // Track conversation
	const [currentLevel, setCurrentLevel] = useState('Unistructural');
	const hasFetchedInitialQuestion = useRef(false); // Prevent multiple fetches

	// Fetch initial question only once
	useEffect(() => {
		if (!hasFetchedInitialQuestion.current) {
			hasFetchedInitialQuestion.current = true; // Set flag to prevent re-fetch

			axios
				.post(
					'https://teacher-platform-backend-production.up.railway.app/api/start',
					{
						prompt: initialPrompt,
						currentLevel,
					}
				)
				.then((response) => {
					const initialQuestion = response.data.question;
					setChatGPTQuestion(initialQuestion);

					// Add the initial question to the conversation history
					setConversation((prev) => [
						...prev,
						{ sender: 'chatgpt', content: initialQuestion },
					]);
				})
				.catch((error) => {
					console.error('Error fetching the question:', error);
				});
		}
	}, [initialPrompt, currentLevel]);

	// Handle answer submission
	const handleSubmit = () => {
		setConversation((prev) => [
			...prev,
			{ sender: 'student', content: answer },
		]);

		axios
			.post(
				'https://teacher-platform-backend-production.up.railway.app/api/evaluate',
				{
					answer,
					initialPrompt,
					currentLevel,
				}
			)
			.then((response) => {
				const isCorrect = response.data.isCorrect;
				const nextQuestion = response.data.nextQuestion;
				const nextLevel = response.data.nextLevel;

				if (isCorrect) {
					setIncorrectCount(0);
					setCurrentLevel(nextLevel);
					setChatGPTQuestion(nextQuestion);

					// Add feedback and next question to the conversation
					setConversation((prev) => [
						...prev,
						{
							sender: 'chatgpt',
							content: 'Correct! Moving to the next question.',
						},
						{ sender: 'chatgpt', content: nextQuestion },
					]);
				} else {
					const newCount = incorrectCount + 1;
					setIncorrectCount(newCount);

					if (newCount >= 3) {
						const retryMessage = `You have answered incorrectly 3 times. Please study the topic "${topic}" further and try again.`;
						setChatGPTQuestion(retryMessage);

						// Add retry message to the conversation
						setConversation((prev) => [
							...prev,
							{ sender: 'chatgpt', content: retryMessage },
						]);
					} else {
						axios
							.post(
								'https://teacher-platform-backend-production.up.railway.app/api/rephrase',
								{
									currentQuestion: chatGPTQuestion,
								}
							)
							.then((res) => {
								const rephrasedQuestion =
									res.data.rephrasedQuestion;
								setChatGPTQuestion(rephrasedQuestion);

								// Add feedback and rephrased question to the conversation
								setConversation((prev) => [
									...prev,
									{
										sender: 'chatgpt',
										content:
											'Incorrect. Rephrasing the question...',
									},
									{
										sender: 'chatgpt',
										content: rephrasedQuestion,
									},
								]);
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
				setConversation((prev) => [
					...prev,
					{
						sender: 'chatgpt',
						content:
							'An error occurred while processing your response.',
					},
				]);
			});

		setAnswer(''); // Clear the input
	};

	return (
		<div className="prompt-interaction-container">
			<h1>Selected Prompt: {selectedPrompt || 'No prompt selected!'}</h1>
			<ChatSession initialPrompt={initialPrompt} />

			{/* Chat History Component */}
			<ChatHistory conversation={conversation} />

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

// Teacher can upload a CSV with concepts, and then the chat GPT will ask questions based on that.
