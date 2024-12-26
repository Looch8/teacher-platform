import { Link } from 'react-router-dom';

function HomePage() {
	return (
		<>
			<h1>Teacher Platform</h1>
			<div className="mode-container">
				<Link to="/revision">
					<button>Revision Mode</button>
				</Link>
				<h2 className="assessment-mode-btn">
					Assessment Mode (coming soon)
				</h2>
			</div>
		</>
	);
}

export default HomePage;
