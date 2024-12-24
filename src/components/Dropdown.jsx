import { useState } from 'react';

const Dropdown = ({ label, options, onSelect }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleOptionClick = (option) => {
		onSelect(option); // Notify the parent of the selection
		setIsOpen(false); // Close the dropdown after selection
	};

	return (
		<div className="dropdown">
			<button onClick={toggleDropdown} className="dropdown-button">
				{label}
			</button>
			{isOpen && (
				<ul className="dropdown-menu">
					{options.map((option) => (
						<li
							key={option}
							onClick={() => handleOptionClick(option)}
						>
							{option}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Dropdown;
