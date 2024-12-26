import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/PromptPage.css';
import BackButton from '../components/BackButton';
import HomeButton from '../components/HomeButton';

function PromptPage() {
	const location = useLocation(); // Retrieve passed data
	const navigate = useNavigate();
	const { subject, yearLevel, topic } = location.state || {}; // Destructure state

	// Hardcoded prompts based on subject, year level, and topic
	const promptsData = {
		History: {
			'Year 8': {
				'World War I': [
					'Causes of WW1',
					'Wartime technology',
					'End of WW1',
				],
			},
		},
		// Add more subjects, year levels, and topics here as needed
	};

	const prompts = promptsData[subject]?.[yearLevel]?.[topic] || []; // Get prompts
	const [selectedPrompt, setSelectedPrompt] = useState('');

	const handlePromptSelect = (prompt) => {
		setSelectedPrompt(prompt);
	};

	const handleSubmit = () => {
		console.log('Selected Prompt:', selectedPrompt);
		// Navigate to the next step or perform another action here
	};

	return (
		<div className="prompt-container">
			<BackButton />
			<HomeButton />
			<h1 className="page-title">Prompt Selection</h1>
			<div className="info-box">
				<p>
					<strong>Subject:</strong> {subject}
				</p>
				<p>
					<strong>Year Level:</strong> {yearLevel}
				</p>
				<p>
					<strong>Topic:</strong> {topic}
				</p>
			</div>

			<h2 className="prompt-subtitle">Select a Prompt</h2>
			<ul className="prompt-list">
				{prompts.map((prompt, index) => (
					<li key={index} className="prompt-item">
						<label>
							<input
								type="radio"
								name="prompt"
								value={prompt}
								checked={selectedPrompt === prompt}
								onChange={() => handlePromptSelect(prompt)}
							/>
							<span>{prompt}</span>
						</label>
					</li>
				))}
			</ul>

			<button
				onClick={handleSubmit}
				className="submit-button"
				disabled={!selectedPrompt} // Disable until a prompt is selected
			>
				Submit
			</button>
		</div>
	);
}

export default PromptPage;
