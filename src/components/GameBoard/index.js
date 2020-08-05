import React, { Component } from 'react';
import Row from '../Row';

class GameBoard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			rows: this.createBoard(props)
		};
	}

	/* to tell that if new props from parent are recieved then re render the board */

	componentWillReceiveProps(nextProps) {
		if (
			this.props.openCells > nextProps.openCells ||
			this.props.columns !== nextProps.columns
		) {
			this.setState({
				rows: this.createBoard(nextProps)
			});
		}
	}

	/**
	 * createBoard - create 2d grid for our board based off the number of columns and rows passed in from props
	 * @param {object} -  props object having rows and columns
	 */
	createBoard = (props) => {
		let board = [];
		for (let i = 0; i < props.rows; i++) {
			board.push([]);
			for (let j = 0; j < props.columns; j++) {
				board[i].push({
					x: j,
					y: i,
					count: 0, // number of mines near this
					isOpen: false,
					hasMine: false,
					hasFlag: false
				});
			}
		}
		/* after we create the board we add mines randomly! */
		for (let i = 0; i < props.mines; i++) {
			let randomRow = Math.floor(Math.random() * props.rows);
			let randomCol = Math.floor(Math.random() * props.columns);

			let cell = board[randomRow][randomCol];

			if (cell.hasMine) {
				/* if it already has a mine send it back one in the loop and go to another random cell */
				i--;
			} else {
				cell.hasMine = true;
			}
		}
		return board;
	};

	/**
	 * flag - create 2d grid for our board based off the number of columns and rows passed in from props
	 * @param {object} - cell object to check the hasFlag and isOpen status
	 */
	flag = (cell) => {
		if (this.props.status === 'ended' || this.props.status === 'winner') {
			return;
		}

		// to handle negative flagcounts
		if (this.props.flagCount <= 0 && !cell.hasFlag) {
			return;
		}

		if (cell.hasFlag || this.props.flagCount <= 0) {
			this.props.changeFlagAmount(1);
		}

		/* change flag only when cell is not open */
		if (!cell.isOpen) {
			let rows = this.state.rows;

			cell.hasFlag = !cell.hasFlag;
			this.setState({ rows });
			this.props.changeFlagAmount(cell.hasFlag ? -1 : 1);
		}
	};

	/**
	 * open- first we need to find mines around it asynchronously,
		because we need to make sure to calculate the mines before anything else runs
	 * @param {object} - cell object
	 */
	open = (cell) => {
		if (this.props.status === 'ended' || this.props.status === 'winner') {
			return;
		}

		let countMinesAsync = new Promise((resolve) => {
			let mines = this.findMines(cell);
			resolve(mines);
		});

		countMinesAsync.then((numberOfMines) => {
			let rows = this.state.rows;

			// checking the current cell
			let current = rows[cell.y][cell.x];

			// if first cell has mine
			if (current.hasMine && this.props.openCells === 0) {
				let newRows = this.createBoard(this.props);
				this.setState({ rows: newRows }, () => {
					this.open(cell);
				});
			} else {
				if (!cell.hasFlag && !current.isOpen) {
					if (current.hasMine && this.props.openCells !== 0) {
						this.props.endGame();
					}
					this.props.onCellClick();

					current.isOpen = true;
					current.count = numberOfMines;

					this.setState({ rows });
					// its a flag, not a mine so open cells around it!
					if (!current.hasMine && numberOfMines === 0) {
						this.openAroundCell(cell);
					}
				}
			}
		});
	};

	/**
	 * findMines -  look for mines in 1 cell block around the chosen cell
	 * @param {object} - cell object to check the rows and columns
	 */
	findMines = (cell) => {
		let minesInProximity = 0;
		// look for mines in 1 cell block around the chosen cell
		for (let row = -1; row <= 1; row++) {
			for (let col = -1; col <= 1; col++) {
				// checking for border case
				if (cell.y + row >= 0 && cell.x + col >= 0) {
					// checking if proper cell
					if (
						cell.y + row < this.state.rows.length &&
						cell.x + col < this.state.rows[0].length
					) {
						if (
							this.state.rows[cell.y + row][cell.x + col].hasMine &&
							!(row === 0 && col === 0)
						) {
							minesInProximity++;
						}
					}
				}
			}
		}
		return minesInProximity;
	};

	/**
	 * openAroundCell - loop through each cell and open cells one by one in each row around it until we find one with a mine in it
	 * @param {object} - cell object to check the rows and columns
	 */
	openAroundCell = (cell) => {
		let rows = this.state.rows;

		for (let row = -1; row <= 1; row++) {
			for (let col = -1; col <= 1; col++) {
				if (cell.y + row >= 0 && cell.x + col >= 0) {
					if (
						cell.y + row < this.state.rows.length &&
						cell.x + col < this.state.rows[0].length
					) {
						if (
							!this.state.rows[cell.y + row][cell.x + col].hasMine &&
							!rows[cell.y + row][cell.x + col].isOpen
						) {
							this.open(rows[cell.y + row][cell.x + col]);
						}
					}
				}
			}
		}
	};

	render() {
		let rows = this.state.rows.map((cells, index) => (
			<Row cells={cells} open={this.open} flag={this.flag} key={index} />
		));
		return <div className='board'>{rows}</div>;
	}
}

export default GameBoard;
