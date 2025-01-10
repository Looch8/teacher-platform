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

	const API_URL = import.meta.env.VITE_API_URL;

	// Full screen on load
	useEffect(() => {
		enterFullScreen();
		return () => {
			exitFullScreen();
		};
	}, []);

	//API call for backend local

	const initialPrompt = `Acting as an expert in Socratic questioning and computer adaptive testing, please assess my knowledge and understanding of the causes of ${topic}.

 

Ask me one question at a time to measure my level of understanding using Blooms Taxonomy as a framework with a mastery learning approach.

 

Start at the ‘Remembering’ level and ask approximately three questions.

 

Only move to the next level once I’ve answered these factual questions correctly.

 

Next, level up to the ‘understanding’ level. Ask me approximately two questions at this level for the purpose of me explaining my understanding of the subtopics being discussed. 

 

Again, only move to the next level once I’ve answered these questions proficiently. If I have not demonstrated enough understanding of a concept or idea, ask me a specific follow up question on the same content.

 

Next, level up to the ‘applying’ level. Ask me approximately two questions at this level for the purpose of me demonstrating my understanding in different relevant contexts across the specific domain.

 

Again, only move to the next level once I’ve answered these questions proficiently. If I have not demonstrated enough understanding of a concept or idea, ask me a specific follow up question on the same content.

 

Finally, level up to the ‘analysing’ level. Ask me approximately two questions at this level for the purpose of me demonstrating my understanding by comparing and contrasting across the topic to show a strong level of conceptual understanding.

 

If I am successful at answering these final questions, conclude the conversation and give me some feedback of my level of understanding as a summary of the dialogue. Also end the conversation if, at any time across the conversation, after repeated attempts I can't get past a specific Blooms Level.

 

Across the whole conversation, incorporate an Item Response Theory (IRT) framework by considering each question’s difficulty level and my ability level, adapting subsequent questions to better differentiate between levels of understanding as I progress.

 

Keep your questions direct, with limited unnecessary dialogue around the line of questioning. Never, at any time, paraphrase  or restate my correct/complete answers. Only clarify specific details if I am off track or incorrect, alternatively, ask another question to clarify my level of understanding.

 

Never, at any time, state each Blooms level during the conversation, instead subtly gamify the process by encouraging me when I have reached a new level of questions.`;

	const [chatGPTQuestion, setChatGPTQuestion] = useState('');
	const [answer, setAnswer] = useState('');
	const [incorrectCount, setIncorrectCount] = useState(0);
	const [conversation, setConversation] = useState([]); // Track conversation
	const [currentLevel, setCurrentLevel] = useState('Unistructural');
	const [error, setError] = useState(null);
	const hasFetchedInitialQuestion = useRef(false); // Prevent multiple fetches

	//Add debugging log
	useEffect(() => {
		console.log('API_URL:', API_URL);
	}, [API_URL]);

	// Fetch initial question only once
	useEffect(() => {
		if (!hasFetchedInitialQuestion.current) {
			hasFetchedInitialQuestion.current = true; // Set flag to prevent re-fetch

			axios
				.post(
					// 'https://teacher-platform-backend-production.up.railway.app/api/start',
					`${API_URL}/start`,
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
	}, [initialPrompt, currentLevel, API_URL]);

	// Handle answer submission
	const handleSubmit = () => {
		setConversation((prev) => [
			...prev,
			{ sender: 'student', content: answer },
		]);

		axios
			.post(
				// 'https://teacher-platform-backend-production.up.railway.app/api/evaluate',
				`${API_URL}/evaluate`,
				{
					answer,
					initialPrompt,
					currentLevel,
				}
			)
			.then((response) => {
				const { feedback, nextQuestion, nextLevel } = response.data;

				setCurrentLevel(nextLevel); // Update to the next level dynamically
				setChatGPTQuestion(nextQuestion);

				setConversation((prev) => [
					...prev,
					{ sender: 'chatgpt', content: feedback },
					{ sender: 'chatgpt', content: nextQuestion },
				]);
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
