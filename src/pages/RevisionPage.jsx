import '../styles/RevisionPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../components/Dropdown';
import BackButton from '../components/BackButton';
import HomeButton from '../components/HomeButton';

function RevisionPage() {
	const subjects = ['English', 'Science', 'History'];
	const yearLevels = ['Year 8', 'Year 9', 'Year 10'];

	const topicsData = {
		English: {
			'Year 8': 'The Giver - Lois Lowry',
			'Year 9': 'Romeo & Juliet - Shakespeare',
			'Year 10': 'The Great Gatsby - F. Scott Fitzgerald',
		},
		Science: {
			'Year 8': 'Cells',
			'Year 9': 'Energy Transformation',
			'Year 10': 'Meiosis and Mitosis',
		},
		History: {
			'Year 8': 'Medieval Europe',
			'Year 9': 'World War 1',
			'Year 10': 'World War 2',
		},
	};

	const [selectedSubject, setSelectedSubject] = useState('');
	const [selectedYearLevel, setSelectedYearLevel] = useState('');
	const [selectedTopic, setSelectedTopic] = useState('');

	const navigate = useNavigate();

	const handleSubjectSelect = (subject) => {
		setSelectedSubject(subject);
		setSelectedYearLevel('');
		setSelectedTopic('');
	};

	const handleYearLevelSelect = (yearLevel) => {
		setSelectedYearLevel(yearLevel);
		setSelectedTopic(''); // Reset topic when year level changes
	};

	const handleTopicSelect = (topic) => {
		setSelectedTopic(topic);
	};

	const handleSubmit = () => {
		navigate('/prompt', {
			state: {
				subject: selectedSubject,
				yearLevel: selectedYearLevel,
				topic: selectedTopic,
			},
		});
	};

	const availableTopic =
		topicsData[selectedSubject]?.[selectedYearLevel] || '';

	return (
		<>
			<BackButton />
			<HomeButton />
			<h1>Assessment Mode</h1>
			<div className="dropdown-container">
				<Dropdown
					label="Subject"
					options={subjects}
					onSelect={handleSubjectSelect}
				/>
				<Dropdown
					label="Year Level"
					options={yearLevels}
					onSelect={handleYearLevelSelect}
					disabled={!selectedSubject}
				/>
				<Dropdown
					label="Topic"
					options={availableTopic ? [availableTopic] : []}
					onSelect={handleTopicSelect}
					disabled={!selectedYearLevel}
				/>
			</div>
			<div className="selections">
				{selectedSubject && (
					<p>
						Selected Subject: <span>{selectedSubject}</span>
					</p>
				)}
				{selectedYearLevel && (
					<p>
						Selected Year Level: <span>{selectedYearLevel}</span>
					</p>
				)}
				{selectedTopic && (
					<p>
						Selected Topic: <span>{selectedTopic}</span>
					</p>
				)}
			</div>
			<button
				onClick={handleSubmit}
				className="submit-button"
				disabled={
					!selectedSubject || !selectedYearLevel || !selectedTopic
				}
			>
				Submit
			</button>
		</>
	);
}

export default RevisionPage;
