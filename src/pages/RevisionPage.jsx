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
			'Year 8': 'Poetry',
			'Year 9': 'Grammar',
			'Year 10': 'Shakespeare',
		},
		Science: {
			'Year 8': 'Basic Biology',
			'Year 9': 'Chemical Reactions',
			'Year 10': 'Physics of Motion',
		},
		History: {
			'Year 8': 'World War I',
			'Year 9': 'World War II',
			'Year 10': 'Renaissance',
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

	// Get the topic for the selected subject and year level
	const availableTopic =
		topicsData[selectedSubject]?.[selectedYearLevel] || '';

	return (
		<>
			<BackButton />
			<HomeButton />
			<h1>Revision Mode</h1>
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
					options={availableTopic ? [availableTopic] : []} // Only show one topic
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
