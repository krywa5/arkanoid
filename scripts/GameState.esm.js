import { Block } from './Block.esm.js';
import { gameLevels } from './gameLevels.esm.js';

export class GameState {
	constructor(level) {
		const correctLevel = Number(level) - 1;
		let _gameBoard = gameLevels[correctLevel].board.map(({ x, y, type }) => new Block(x, y, type));
		this._isGamePaused = false;
		this._level = level;

		this.getGameBoard = () => _gameBoard;
	}

	set isGamePaused(newValue) {
		this._isGamePaused = newValue;
	}

	get isGamePaused() {
		return this._isGamePaused;
	}

	get level() {
		return this._level;
	}
}