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
		},
		Math: {
			'Year 8': {
				Algebra: [
					'Linear equations',
					'Quadratic equations',
					'Graphing',
				],
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
