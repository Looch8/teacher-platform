import { Link } from 'react-router-dom';

function HomePage() {
	return (
		<>
			<h1>Assessment Mode</h1>
			<div className="mode-container">
				<Link to="/revision">
					<button>Let's Begin</button>
				</Link>
			</div>
		</>
	);
}

export default HomePage;
