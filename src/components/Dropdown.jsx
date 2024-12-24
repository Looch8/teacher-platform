import { useState } from 'react';

const Dropdown = ({ label, options }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState('');

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleOptionClick = (option) => {
		setSelectedOption(option);
		setIsOpen(false); // Close the dropdown after selection
	};

	return (
		<div className="dropdown">
			<button onClick={toggleDropdown} className="dropdown-button">
				{selectedOption || label}
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
