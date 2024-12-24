import '../styles/RevisionPage.css';

function RevisionPage() {
	return (
		<div>
			<h1>Revision Mode</h1>
			<div className="dropdown-container">
				<div className="dropdown">
					<button className="dropdown-button">Menu</button>
					<ul className="dropdown-menu">
						<li>
							<a href="#option1">Option 1</a>
						</li>
						<li>
							<a href="#option2">Option 2</a>
						</li>
						<li>
							<a href="#option3">Option 3</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default RevisionPage;
