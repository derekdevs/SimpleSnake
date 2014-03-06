/*
*	Author: Derek S. Walker
*	Snake.js
*	Simulates the classic arcade game Snake using HTML5 and JavaScript
*	January 23, 2014
*/

/* 
 * Global variables
 */
var	snakeHead = new Object(), // Definition of snake game object
	snakeFood = new Object(); // Definition of snake food game object
	snakeHead.dir; // Current snake movement direction 
	snakeHead.lastDir; // Last snake movement direction
var canvas, // Canvas to draw on (game play area)
	ctx, // Canvas context
	snakeBodyX = [], // The x coordinates of the snake's body segments
	snakeBodyY = [], // The y coordinates of the snake's body segments 
	numElements = 3, // Represents the number of body segments on the snake (including the head)
	score = 0, // Represents the user's score
	noDraw = false, // Boolean for drawing snake
	gameOverCount = 0, // Counter for Game Over output
	gameOver = false, // Boolean for game over
	backcolor = '#7F5217'; // Backcolor of the canvas
	white = '#ffffff', // White html code
	playGame = "Play Game"; // Play Game label
	snakeSize = 20; // Size of each segment of the snake (width x height)
	inc_score = 150; // Dynamic scoring incrementer
	
// Keyboard event listener (on key down)
function onKeyDown(evt){
	switch(evt.keyCode)
	{
		case 37: /* Left arrow */
			snakeHead.lastDir = snakeHead.dir;
			snakeHead.dir = "left";
			break;
		case 38: /* Up arrow */
			snakeHead.lastDir = snakeHead.dir;
			snakeHead.dir = "up";
			break;
		case 39: /* Right arrow */
			snakeHead.lastDir = snakeHead.dir;
			snakeHead.dir = "right";
			break;
		case 40: /* Down arrow */
			snakeHead.lastDir = snakeHead.dir;
			snakeHead.dir = "down";
			break;
	
	} // end switch

} // end function onKeyDown

// init function
function init(){
	canvas = document.getElementById('myCanvas');
	// Initialize snake's position on the canvas
	var randX = Math.floor((Math.random()*49)+1)*snakeSize; // random number 20 - 980 (intervals of 20)
	var randY = Math.floor((Math.random()*24)+1)*snakeSize; // random number 20 - 480 (intervals of 20)
	var randFoodX = Math.floor((Math.random()*49)+1)*snakeSize; // random number 20 - 980 (intervals of 20)
	var randFoodY = Math.floor((Math.random()*24)+1)*snakeSize; // random number 20 - 480 (intervals of 20)
	var direction = Math.floor((Math.random()*4)+1); // random number between 1 - 4
	// Randomly generate initial snake movement direction
	if (direction == 1)
		snakeHead.dir = "up";
	else if (direction == 2)
		snakeHead.dir = "left";
	else if (direction == 3)
		snakeHead.dir = "right";
	else 
		snakeHead.dir = "down";
	snakeHead.x = randX;
	snakeHead.y = randY;
	snakeFood.x = randFoodX;
	snakeFood.y = randFoodY;
	
	// Set up canvas
	if (canvas.getContext){
		ctx = canvas.getContext('2d');
		ctx.fillStyle = backcolor; // Fill canvas background color
		
		// Game loop 
		setInterval(function(){
			// Refresh canvas, draw game objects
			refreshCanvas();
			ctx.beginPath();
			// Draw snake's food game object
			draw(snakeFood.x, snakeFood.y);
			// Draw snake game object
			drawSnake();
			ctx.endPath();
			
		},100); // end setInterval game loop
		
	} // end if
	
	// Instantiate keyboard event listener 
	window.addEventListener('keydown',onKeyDown,true);
	
} // end init

// Draw the snake body
function drawSnake(){

	// No backtracking movements
	if (snakeHead.dir == "left" && snakeHead.lastDir == "right"){
		snakeHead.dir = "right";
		snakeHead.lastDir = "right";
	}
	else if (snakeHead.dir == "right" && snakeHead.lastDir == "left"){
		snakeHead.dir = "left";
		snakeHead.lastDir = "left";
	}
	else if (snakeHead.dir == "down" && snakeHead.lastDir == "up"){
		snakeHead.dir = "up";
		snakeHead.lastDir = "up";
	}
	else if (snakeHead.dir == "up" && snakeHead.lastDir == "down"){
		snakeHead.dir = "down";
		snakeHead.lastDir = "down";
	}
	// Move right
	if (snakeHead.dir == "right" && snakeHead.lastDir != "left")
		moveRight();
	// Move left
	else if (snakeHead.dir == "left" && snakeHead.lastDir != "right")
		moveLeft();
	// Move up
	else if (snakeHead.dir == "up" && snakeHead.lastDir != "down")
		moveUp();
	// Move down
	else if (snakeHead.dir == "down" && snakeHead.lastDir != "up")
		moveDown();
	// Snake finds food
	if ((snakeHead.x == snakeFood.x) && (snakeHead.y == snakeFood.y)){
		// Randomly generate a new snake food
		var newX = Math.floor((Math.random()*49)+1)*snakeSize; // random number for new x coordinate
		var newY = Math.floor((Math.random()*24)+1)*snakeSize; // random number for new y coordinate
		snakeFood.x = newX;
		snakeFood.y = newY;
		
		// Update score
		score += inc_score;
		inc_score += 50;
				
		// Coordinate new snake body segment
		if (snakeHead.dir == "up"){
			snakeBodyX[numElements-1] = snakeBodyX[numElements];
			snakeBodyY[numElements-1] = snakeBodyY[numElements]+snakeSize;
			numElements++;
		}
		else if (snakeHead.dir == "down"){
			snakeBodyX[numElements-1] = snakeBodyX[numElements];
			snakeBodyY[numElements-1] = snakeBodyY[numElements]-snakeSize;
			numElements++;
		}
		else if (snakeHead.dir == "left"){
			snakeBodyX[numElements-1] = snakeBodyX[numElements]+snakeSize;
			snakeBodyY[numElements-1] = snakeBodyY[numElements];
			numElements++;
		}
		else if (snakeHead.dir == "right"){
			snakeBodyX[numElements-1] = snakeBodyX[numElements]-snakeSize;
			snakeBodyY[numElements-1] = snakeBodyY[numElements];
			numElements++;
		}
	}
	// Collision detection (snake head and rest of body)
	if (numElements > 1){
		for (var i=0; i<numElements-1; i++){
			if (snakeHead.x == snakeBodyX[i] && snakeHead.y == snakeBodyY[i])
				endGame();
		}
	}
	// Draw snake's body
	if (numElements > 1){
		for (var i=0; i<numElements-1; i++){
			draw(snakeBodyX[i], snakeBodyY[i]);
		}
	}
			
	// Update all snake body segments and respective coordinates
	for (var i = numElements-1; i > 0; i--){
		snakeBodyX[i] = snakeBodyX[i-1];
		snakeBodyY[i] = snakeBodyY[i-1];
	}
	snakeBodyX[0] = snakeHead.x;
	snakeBodyY[0] = snakeHead.y;
	
} // end drawSnake

// End the game
function endGame(){
	refreshCanvas();
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	gameOverCount++;
	noDraw = true;
	gameOver = true;
}

// Move the snake right
function moveRight(){
	if (snakeHead.x <= (canvas.width - snakeSize)){
		// Right wall has been hit
		if (snakeHead.x == (canvas.width - snakeSize) && gameOverCount == 0)
			endGame();
		// Draw snake
		if (noDraw == false){
			snakeHead.x+=snakeSize;
			draw(snakeHead.x,snakeHead.y);
		}
	}
} // end moveRight

// Move the snake left
function moveLeft(){
	if (snakeHead.x >= 0){
		// Left wall has been hit
		if (snakeHead.x == 0 && (gameOverCount == 0))
			endGame();
		// Draw snake
		if (noDraw == false){
			snakeHead.x-=snakeSize;
			draw(snakeHead.x,snakeHead.y);
		}
	}
} // end moveLeft

// Move the snake up
function moveUp(){
	if (snakeHead.y >= 0){
		// Top wall has been hit
		if (snakeHead.y == 0 && (gameOverCount == 0))
			endGame();
		// Draw snake
		if (noDraw == false){
			snakeHead.y-=snakeSize;
			draw(snakeHead.x,snakeHead.y);
		}
	}
} // end moveUp

// Move the snake down
function moveDown(){
	if (snakeHead.y <= (canvas.height - snakeSize)){
		// Bottom wall has been hit
		if (snakeHead.y == (canvas.height - snakeSize) && gameOverCount == 0)
			endGame();
		// Draw snake
		if (noDraw == false){
			snakeHead.y+=snakeSize;
			draw(snakeHead.x,snakeHead.y);
		}
	}
} // end moveDown

// A simple draw function
function draw(x,y){
	ctx.fillStyle = "#7F5217";
	if (!gameOver){
		ctx.font = "20px Arial, sans-serif";
		ctx.fillStyle = "#000000"; // Score font color
		ctx.fillText("Score: ", 5, 25);
		ctx.fillText(score, 100, 25);
		ctx.stroke();
		ctx.fillStyle = "#EDC9AF"; // Snake body color
	}
	else {
		ctx.font = "35px Arial, Sans-serif"
		ctx.fillStyle = "#000000"; // Game over font color
		ctx.fillText("Game Over - You scored "+score+" points!", 500, 200);
		ctx.fillStyle = "#EDC9AF"; // Snake body color
		return;
	}
	ctx.rect(x,y,snakeSize,snakeSize);
	ctx.fill();
	ctx.stroke();
	
} // end draw

// Refresh the canvas
function refreshCanvas(){
	ctx.fillStyle = backcolor;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

init();