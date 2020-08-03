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
			flagCount: 10,
			openCells: 0,
			mines: 50,
			rows: 10,
			columns: 10,
			showTable: false
		};

		this.baseState = this.state;
		this.intervals = [];
	}

	componentDidUpdate(nextProps, nextState) {
		if (this.state.gameStatus === 'running') {
			this.checkForWinner();
		}
	}

	reset = () => {
		this.intervals.map(clearInterval);
		// base state is required otherwise all varables needs to be reset using setState
		this.setState({ ...this.baseState }, () => {
			this.intervals = [];
		});
	};

	setInterval = (fn, t) => {
		this.intervals.push(setInterval(fn, t));
	};

	// for increasing every second
	tick = () => {
		if (this.state.openCells > 0 && this.state.gameStatus === 'running') {
			let time = this.state.time + 1;
			this.setState({ time });
		}
	};

	// to handle click of each cell
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
							<div className='row-input'>
								<label>Enter Row :</label>
								<input
									type='number'
									value={rows}
									onChange={(e) =>
										this.setState({
											rows: e.target.value
										})
									}
								/>
							</div>

							<div className='column-input'>
								<label>Enter Column :</label>
								<input
									type='number'
									value={columns}
									onChange={(e) => this.setState({ columns: e.target.value })}
								/>
							</div>
						</div>

						<button
							style={{ padding: '10px' }}
							onClick={() => this.setState({ showTable: true })}
						>
							Click to Play
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
