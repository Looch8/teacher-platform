import Dropdown from '../components/Dropdown';
import '../styles/RevisionPage.css';

function RevisionPage() {
	const subjects = ['Math', 'Science', 'History'];
	const yearLevels = ['Year 1', 'Year 2', 'Year 3'];
	const topics = ['Algebra', 'Biology', 'World War II'];
	return (
		<div>
			<h1>Revision Mode</h1>
			<Dropdown label="Subject" options={subjects} />
			<Dropdown label="Year Level" options={yearLevels} />
			<Dropdown label="Topic" options={topics} />
		</div>
	);
}

export default RevisionPage;
