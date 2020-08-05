import React, { Component } from 'react';
import BoardHeader from './components/BoardHeader';
import GameBoard from './components/GameBoard';
import Restart from './components/Restart';

class App extends Component {
	constructor() {
		super();

		this.state = {
			gameStatus: 'waiting', // can be running, waiting, or ended
			time: 0, // in seconds
			flagCount: 20,
			openCells: 0,
			mines: 20,
			rows: undefined,
			columns: undefined,
			showTable: false
		};

		this.baseState = this.state;
		this.intervals = [];
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.gameStatus === 'running') {
			this.checkForWinner();
		}
	}

	reset = () => {
		this.intervals.map(clearInterval);
		/* base state is required otherwise all varables needs to be reset using setState */
		this.setState({ ...this.baseState }, () => {
			this.intervals = [];
		});
	};

	setInterval = (fn, t) => {
		this.intervals.push(setInterval(fn, t));
	};

	/*
	 * tick - for increasing every second
	 */
	tick = () => {
		if (this.state.openCells > 0 && this.state.gameStatus === 'running') {
			let time = this.state.time + 1;
			this.setState({ time });
		}
	};

	/*
	 * handleCellClick - to handle click of each cell
	 */

	handleCellClick = () => {
		if (this.state.openCells === 0 && this.state.gameStatus !== 'running') {
			this.setState(
				{
					gameStatus: 'running'
				},
				this.setInterval(this.tick, 1000)
			);
		}
		this.setState((prevState) => {
			return { openCells: prevState.openCells + 1 };
		});
	};

	changeFlagAmount = (amount) => {
		this.setState({ flagCount: this.state.flagCount + amount });
	};

	checkForWinner = () => {
		if (
			this.state.mines + this.state.openCells >=
			this.state.rows * this.state.columns
		) {
			this.setState({
				gameStatus: 'winner',
				showTable: false
			});
		}
	};

	endGame = () => {
		this.setState({
			gameStatus: 'ended'
		});
	};

	render() {
		const {
			time,
			flagCount,
			gameStatus,
			openCells,
			mines,
			rows,
			columns,
			showTable
		} = this.state;

		return (
			<div className='minesweeper'>
				<h2>Play Minesweeper!!</h2>
				{!showTable && gameStatus !== 'winner' ? (
					<div className='input-container'>
						<div>
							<div className='field'>
								<input
									type='number'
									name='columnNumber'
									id='columnNumber'
									placeholder='Enter value between 8 and 20'
									value={columns}
									onChange={(e) =>
										this.setState({
											columns: e.target.value
										})
									}
								/>
								<label htmlFor='columnNumber'>Enter Column</label>

								<input
									type='number'
									name='rowNumber'
									id='rowNumber'
									placeholder='Enter value between 8 and 20'
									value={rows}
									onChange={(e) =>
										this.setState({
											rows: e.target.value
										})
									}
								/>
								<label htmlFor='rowNumber'>Enter Row</label>
							</div>
						</div>

						<button
							className='start-game'
							onClick={() =>
								this.setState({
									showTable: true
								})
							}
							disabled={
								rows === undefined ||
								columns === undefined ||
								rows < 8 ||
								rows > 20 ||
								columns < 8 ||
								columns > 20
							}
						>
							Start Game
						</button>
					</div>
				) : null}

				{showTable ? (
					<>
						<BoardHeader
							time={time}
							flagsUsed={flagCount}
							reset={this.reset}
							status={gameStatus}
						/>
						<GameBoard
							openCells={openCells}
							mines={mines}
							rows={rows}
							columns={columns}
							endGame={this.endGame}
							status={gameStatus}
							onCellClick={this.handleCellClick}
							changeFlagAmount={this.changeFlagAmount}
							flagCount={flagCount}
						/>
					</>
				) : (
					<Restart status={gameStatus} reset={this.reset} />
				)}
			</div>
		);
	}
}

export default App;
