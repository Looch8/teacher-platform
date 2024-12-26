import '../styles/RevisionPage.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import Dropdown from '../components/Dropdown';
import BackButton from '../components/BackButton';
import HomeButton from '../components/HomeButton';

function RevisionPage() {
	const subjects = ['Math', 'Science', 'History'];
	const yearLevels = ['Year 8', 'Year 9', 'Year 10'];
	const topicsData = {
		Math: ['Algebra', 'Geometry', 'Calculus'],
		Science: ['Biology', 'Chemistry', 'Physics'],
		History: ['World War I', 'World War II', 'Renaissance'],
	};

	const [selectedSubject, setSelectedSubject] = useState('');
	const [selectedYearLevel, setSelectedYearLevel] = useState('');
	const [selectedTopic, setSelectedTopic] = useState('');

	const navigate = useNavigate(); // Initialize navigation

	const handleSubjectSelect = (subject) => {
		setSelectedSubject(subject);
		setSelectedTopic(''); // Reset topic when subject changes
	};

	const handleYearLevelSelect = (yearLevel) => {
		setSelectedYearLevel(yearLevel);
	};

	const handleTopicSelect = (topic) => {
		setSelectedTopic(topic);
	};

	const handleSubmit = () => {
		// Navigate to the prompt page with selected data
		navigate('/prompt', {
			state: {
				subject: selectedSubject,
				yearLevel: selectedYearLevel,
				topic: selectedTopic,
			},
		});
	};

	return (
		<>
			<BackButton />
			<HomeButton />
			<h1>Revision Mode</h1>
			{/* Button to go back homepage */}
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
				/>
				<Dropdown
					label="Topic"
					options={topicsData[selectedSubject] || []}
					onSelect={handleTopicSelect}
				/>
			</div>
			<div className="selections">
				{selectedSubject && <p>Selected Subject: {selectedSubject}</p>}
				{selectedYearLevel && (
					<p>Selected Year Level: {selectedYearLevel}</p>
				)}
				{selectedTopic && <p>Selected Topic: {selectedTopic}</p>}
			</div>
			<button
				onClick={handleSubmit}
				className="submit-button"
				disabled={
					!selectedSubject || !selectedYearLevel || !selectedTopic
				} // Disable until all are selected
			>
				Submit
			</button>
		</>
	);
}

export default RevisionPage;
