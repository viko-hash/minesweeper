import React from 'react';

const Restart = ({ status, reset }) => {
	const gameEndText = 'CONGRATULATIONS!! YOU WON';

	if (status === 'winner') {
		return (
			<div className='restart'>
				<div>{gameEndText}</div>
				<button className='restart-button' onClick={reset}>
					Restart Game
				</button>
			</div>
		);
	} else {
		return null;
	}
};

export default Restart;
