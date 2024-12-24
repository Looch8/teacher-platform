import { useState } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from '../components/Dropdown';
import '../styles/RevisionPage.css';

function RevisionPage() {
	const subjects = ['Math', 'Science', 'History'];
	const yearLevels = ['Year 1', 'Year 2', 'Year 3'];
	const topicsData = {
		Math: ['Algebra', 'Geometry', 'Calculus'],
		Science: ['Biology', 'Chemistry', 'Physics'],
		History: ['World War I', 'World War II', 'Renaissance'],
	};

	const [selectedSubject, setSelectedSubject] = useState('');
	const [selectedYearLevel, setSelectedYearLevel] = useState('');
	const [selectedTopic, setSelectedTopic] = useState('');

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
		console.log({
			Subject: selectedSubject,
			YearLevel: selectedYearLevel,
			Topic: selectedTopic,
		});
	};

	return (
		<>
			<h1>Revision Mode</h1>
			{/* Button to go back homepage */}
			<Link to="/">
				<button className="home-button">Home</button>
			</Link>
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
			<button onClick={handleSubmit} className="submit-button">
				Submit
			</button>
		</>
	);
}

export default RevisionPage;
