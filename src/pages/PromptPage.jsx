import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PromptPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const { subject, yearLevel, topic } = location.state || {};

	const promptsData = {
		History: {
			'Year 8': {
				'World War I': [
					'Causes of WW1',
					'Wartime technology',
					'End of WW1',
				],
			},
			'Year 9': {
				'World War II': ['Causes of WW2', 'Key battles', 'End of WW2'],
			},
			'Year 10': {
				Renaissance: ['Art', 'Science', 'Politics'],
			},
		},
		Science: {
			'Year 8': {
				'Basic Biology': ['Cells', 'Genetics', 'Evolution'],
			},
			'Year 9': {
				'Chemical Reactions': [
					'Acids and bases',
					'Combustion',
					'Oxidation',
				],
			},
			'Year 10': {
				'Physics of Motion': ['Forces', 'Energy', 'Momentum'],
			},
		},
		English: {
			'Year 8': {
				Poetry: ['Sonnet', 'Haiku', 'Limerick'],
			},
			'Year 9': {
				Grammar: ['Nouns', 'Verbs', 'Adjectives'],
			},
			'Year 10': {
				Shakespeare: ['Macbeth', 'Romeo and Juliet', 'Hamlet'],
			},
		},
	};

	const prompts = promptsData[subject]?.[yearLevel]?.[topic] || [];
	const [selectedPrompt, setSelectedPrompt] = useState('');

	const handleSubmit = () => {
		navigate('/interaction', {
			state: { selectedPrompt, subject, yearLevel, topic },
		});
	};

	return (
		<>
			<h1>Prompt Selection</h1>
			<ul>
				{prompts.map((prompt, index) => (
					<li key={index}>
						<label>
							<input
								type="radio"
								value={prompt}
								onChange={() => setSelectedPrompt(prompt)}
								checked={selectedPrompt === prompt}
							/>
							{prompt}
						</label>
					</li>
				))}
			</ul>
			<button onClick={handleSubmit} disabled={!selectedPrompt}>
				Submit
			</button>
		</>
	);
}

export default PromptPage;
