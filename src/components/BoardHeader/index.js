import React from 'react';

const BoardHeader = (props) => {
	// props.time will be in seconds so changing to minutes
	let minutes = Math.floor(props.time / 60);
	let formattedSeconds = props.time - minutes * 60 || 0;

	// formatting the seconds in 00 format, if only 1 digit in seconds
	formattedSeconds =
		formattedSeconds < 10 ? `0${formattedSeconds}` : formattedSeconds;
	let time = `${minutes}:${formattedSeconds}`;
	let status =
		props.status === 'running' || props.status === 'waiting' ? (
			<i className='icon ion-happy-outline' />
		) : (
			<button style={{ border: 'none', background: 'yellow' }}>
				Reset Game
			</button>
		);
	return (
		<div className='board-head'>
			<div className='flag-count'>{props.flagsUsed}</div>
			<button className='reset' onClick={props.reset}>
				{status}
			</button>
			<div className='timer'>{time}</div>
		</div>
	);
};

export default BoardHeader;
