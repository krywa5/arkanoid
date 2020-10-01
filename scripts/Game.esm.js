import { Common, VISIBLE_SCREEN } from './Common.esm.js';
import { DATALOADED_EVENT_NAME } from './Loader.esm.js';
import { gameLevels } from './gameLevels.esm.js';
import { canvas } from './Canvas.esm.js';
import { media } from './Media.esm.js';
import { resultScreen } from './ResultScreen.esm.js';
import { userData } from './UserData.esm.js';
import { mainMenu } from './MainMenu.esm.js';
import { Sprite } from './Sprite.esm.js';
import { Paddle, PADDLE_SPEED } from './Paddle.esm.js';
import { keyboardController, KEY_CODE_LEFT, KEY_CODE_PAUSE, KEY_CODE_RIGHT } from './KeyboardController.esm.js';
import { Ball } from './Ball.esm.js';



class Game extends Common {
	constructor() {
		super();
	}

	playLevel(level) {
		window.removeEventListener(DATALOADED_EVENT_NAME, this.playLevel);

		this.background = new Sprite(0, 33, 800, 450, media.spriteImage, 0, 0);
		this.paddle = new Paddle();
		this.ball = new Ball();
		this.gameState = { isGamePaused: false };
		// this.gameState = new GameState();
		this.changeVisibilityScreen(canvas.element, VISIBLE_SCREEN);
		this.changeVisibilityScreen(mainMenu.miniSettingsLayerElement, VISIBLE_SCREEN);
		media.isInLevel = true;
		media.playBackgroundMusic();
		this.animate();
	}

	animate() {
		this.ball.moveAndCheckCollision();
		this.handleKeyboardClick();
		this.checkCollisionBallWithPaddle();
		this.drawSprites();
		this.checkEndOfGame();
	}

	handleKeyboardClick() {

		const { clickedKey: key } = keyboardController;

		if (!key) {
			return;
		}

		if (key === KEY_CODE_PAUSE) {
			this.gameState.isGamePaused = true;
			keyboardController.clickedKey = null;
			return;
		}

		if (!this.gameState.isGamePaused && key === KEY_CODE_LEFT) {
			for (let i = PADDLE_SPEED; this.paddle.movePlayerLeft() && i; i--);
			keyboardController.clickedKey = null;
			return;
		}

		if (!this.gameState.isGamePaused && key === KEY_CODE_RIGHT) {
			for (let i = PADDLE_SPEED; this.paddle.movePlayerRight() && i; i--);
			keyboardController.clickedKey = null;
			return;
		}
	}

	drawSprites() {
		this.background.draw(0, 1.25);
		this.ball.draw();
		this.paddle.draw();
	}

	checkEndOfGame() {
		if (this.ball.hadHitBottomEdge()) {
			media.isInLevel = false;
			media.stopBackgroundMusic();
			resultScreen.viewResultScreen(true);
		} else {
			this.animationFrame = window.requestAnimationFrame(() => this.animate());
		}
	}

	checkCollisionBallWithPaddle() {
		const { dx, dy } = this.ball;

		if (dy < 0) {
			return;
		}

		const vector = {
			dx,
			dy,
		};

		if (this.ball.checkCollisionWithAnotherSprite(vector, this.paddle)) {
			this.ball.dy = -(Math.floor(Math.random() * 3) + 3);
		};
	}
}

export const game = new Game();