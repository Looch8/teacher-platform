import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PromptPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const { subject, yearLevel, topic } = location.state || {};

	const promptsData = {
		History: {
			'Year 8': {
				'Medieval Europe': [
					'the Black Death and its effects on Medieval society and feudal structures',
				],
			},
			'Year 9': {
				'World War 1': ['Causes of World War 1'],
			},
			'Year 10': {
				'World War 2': [
					'historical justifications of dropping the bomb',
				],
			},
		},
		Science: {
			'Year 8': {
				Cells: [
					'cells as the basic units of living things and the functions of specialised cell structures and organelles',
				],
			},
			'Year 9': {
				'Energy Transformation': [
					'wave and particle models to describe energy transfer through different mediums',
				],
			},
			'Year 10': {
				'Meiosis and Mitosis': [
					'the role of meiosis and mitosis and the function of chromosomes, DNA and genes in heredity',
				],
			},
		},
		English: {
			'Year 8': {
				'The Giver - Lois Lowry': [
					'Plot, themes and literary techniques used in The Giver by Lois Lowry',
				],
			},
			'Year 9': {
				'Romeo & Juliet - Shakespeare': [
					'Plot, themes and literary techniques used in Romeo & Juliet',
				],
			},
			'Year 10': {
				'The Great Gatsby - F. Scott Fitzgerald': [
					'Plot, themes and literary techniques used in The Great Gatsby by F. Scott Fitzgerald',
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
