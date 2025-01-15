import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/InteractionPage.css';
import ChatHistory from '../components/ChatHistory';
import { enterFullScreen, exitFullScreen } from '../utils/fullscreen';
import TestConditionsModal from '../components/TestConditionsModal';
import TypeformPopup from '../components/TypeformPopup'; //

const InteractionPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { selectedPrompt, yearLevel } = location.state || {};

	const API_URL = import.meta.env.VITE_API_URL;

	const [chatGPTQuestion, setChatGPTQuestion] = useState('');
	const [answer, setAnswer] = useState('');
	const [conversation, setConversation] = useState([]);
	const [currentLevel, setCurrentLevel] = useState('Remembering');
	const [isTyping, setIsTyping] = useState(false);
	const [showModal, setShowModal] = useState(true);
	const [showTypeform, setShowTypeform] = useState(false);

	const hasFetchedInitialQuestion = useRef(false);

	// Enter full screen on load
	useEffect(() => {
		enterFullScreen();
		return () => exitFullScreen();
	}, []);

	// Fetch initial question after acknowledging the modal
	useEffect(() => {
		if (!hasFetchedInitialQuestion.current && !showModal) {
			hasFetchedInitialQuestion.current = true;

			const fetchInitialQuestion = async () => {
				try {
					const response = await axios.post(`${API_URL}/start`, {
						prompt: initialPrompt,
						currentLevel,
						yearLevel,
					});

					const initialQuestion = response.data.question;
					setChatGPTQuestion(initialQuestion);

					setConversation([
						{ sender: 'chatgpt', content: initialQuestion },
					]);
				} catch (error) {
					console.error('Error fetching the question:', error);
				}
			};

			fetchInitialQuestion();

			//  Show Typeform after 10 seconds
			setTimeout(() => {
				setShowTypeform(true);
			}, 10000);
		}
	}, [showModal]);

	const initialPrompt = `Please ask me questions about ${selectedPrompt}. Start with basic recall questions and increase difficulty based on my answers.`;

	const handleSubmit = () => {
		if (!answer.trim() || isTyping) return;

		setIsTyping(true);

		setConversation((prev) => [
			...prev,
			{ sender: 'student', content: answer },
		]);

		const evaluateAnswer = async () => {
			try {
				const response = await axios.post(`${API_URL}/evaluate`, {
					messages: [
						{ role: 'system', content: initialPrompt },
						...conversation.map((msg) => ({
							sender: msg.sender,
							content: msg.content,
						})),
						{ sender: 'student', content: answer },
					],
					initialPrompt,
					currentLevel,
					yearLevel,
				});

				const { feedback, nextQuestion, nextLevel } = response.data;

				if (nextLevel === 'Completed') {
					setConversation((prev) => [
						...prev,
						{ sender: 'chatgpt', content: feedback },
						{
							sender: 'chatgpt',
							content: '🎉 You have completed all levels!',
						},
					]);
					setIsTyping(false);
					return;
				}

				setCurrentLevel(nextLevel);

				setConversation((prev) => [
					...prev,
					{ sender: 'chatgpt', content: feedback },
					{ sender: 'chatgpt', content: nextQuestion },
				]);

				setIsTyping(false);
			} catch (error) {
				console.error('Error evaluating answer:', error);
				setIsTyping(false);
			}
		};

		evaluateAnswer();
		setAnswer('');
	};

	return (
		<div className="prompt-interaction-container">
			{showModal && (
				<TestConditionsModal
					onAcknowledge={() => setShowModal(false)}
				/>
			)}

			{!showModal && (
				<>
					<h1>{selectedPrompt || 'No prompt selected!'}</h1>

					<ChatHistory
						conversation={conversation}
						isTyping={isTyping}
					/>

					<div className="answer-input">
						<textarea
							value={answer}
							onChange={(e) => setAnswer(e.target.value)}
							placeholder="Type your response here"
							onPaste={(e) => e.preventDefault()}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									handleSubmit();
								}
							}}
						/>
						<button className="submit-arrow" onClick={handleSubmit}>
							<span style={{ fontFamily: 'Wingdings' }}>
								&#x2192;
							</span>
						</button>
					</div>

					{showTypeform && (
						<TypeformPopup onClose={() => setShowTypeform(false)} />
					)}
				</>
			)}
		</div>
	);
};

export default InteractionPage;
