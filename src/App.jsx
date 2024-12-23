import './App.css';

function App() {
	return (
		<>
			<h1>Teacher Platform</h1>
			<div className="mode-container">
				<button
					onClick={() => {
						console.log('clicked');
					}}
				>
					Revision Mode
				</button>
				<h2>Assessment Mode (coming soon)</h2>
			</div>
		</>
	);
}

export default App;
