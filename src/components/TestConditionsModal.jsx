import '../styles/TestConditionsModal.css';

const TestConditionsModal = ({ onAcknowledge }) => {
	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<h2>Important Notice</h2>
				<p>
					You are about to begin an assessment under{' '}
					<strong>TEST CONDITIONS</strong>.
					<br />
					Please remain in <strong>FULL-SCREEN MODE</strong>{' '}
					throughout the test.
					<br />
					<strong>DO NOT</strong> close or minimize this window.
				</p>
				<button onClick={onAcknowledge} className="modal-button">
					I Understand
				</button>
			</div>
		</div>
	);
};

export default TestConditionsModal;
