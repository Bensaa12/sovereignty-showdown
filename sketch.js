let explosionSize = 0;
let targetExplosionSize = 0;
let animationFrame = 0;
let gameState = "start";
let isPlayerTurn = true;
let turnCount = 0;
const maxTurns = 10;
let pmouseIsPressed = false;
let processingTurn = false;
let lastActionTime = 0;

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER);
  textSize(20);
}

function draw() {
  background(20, 40, 60); // Dark blue sky
  drawBackground();
  drawTrump();
  drawMacron();
  drawExplosion();
  
  if (gameState === "start") {
    fill(255);
    text("Sovereignty Showdown", width / 2, height / 2 - 50);
    text("Click to Start", width / 2, height / 2);
    if (mouseIsPressed && !pmouseIsPressed) {
      gameState = "playing";
      explosionSize = 0;
      targetExplosionSize = 0;
      turnCount = 0;
      isPlayerTurn = true;
    }
  } else if (gameState === "playing") {
    if (isPlayerTurn && !processingTurn) {
      drawPlayerActions();
      if (mouseIsPressed && !pmouseIsPressed) {
        checkButtonClicks();
      }
    } else if (!isPlayerTurn && !processingTurn) {
      if (animationFrame === 0 && millis() - lastActionTime > 1000) {
        processingTurn = true;
        aiAction();
        processingTurn = false;
      }
      animateExplosion();
    }
    fill(255);
    text(`Explosion Size: ${floor(explosionSize)}`, width / 2, 50);
    text(`Turn: ${turnCount}/${maxTurns}`, width / 2, 80);
    fill(255, 255, 0);
    text(`Player Turn: ${isPlayerTurn ? "Yes" : "No"}`, width / 2, height - 50);
  } else if (gameState === "gameOver") {
    fill(255);
    if (explosionSize >= 100) {
      text("Trump Wins! Tremendous Victory!", width / 2, height / 2);
    } else if (explosionSize < 50) {
      text("Macron Wins! Liberté Triumphs!", width / 2, height / 2);
    } else {
      text("Stalemate! The World Watches.", width / 2, height / 2);
    }
    text("Click to Restart", width / 2, height / 2 + 50);
    if (mouseIsPressed && !pmouseIsPressed) {
      resetGame();
    }
  }
  
  pmouseIsPressed = mouseIsPressed;
}

function checkButtonClicks() {
  if (millis() - lastActionTime < 500) return;
  
  if (mouseY > height - 150 && mouseY < height - 100) {
    if (mouseX > 50 && mouseX < 200) {
      playerAction("rally");
      lastActionTime = millis();
    } else if (mouseX > 250 && mouseX < 400) {
      playerAction("speech");
      lastActionTime = millis();
    } else if (mouseX > 450 && mouseX < 600) {
      playerAction("chaos");
      lastActionTime = millis();
    }
  }
}

function mousePressed() {
  if (gameState === "start") {
    gameState = "playing";
    explosionSize = 0;
    targetExplosionSize = 0;
    turnCount = 0;
    isPlayerTurn = true;
    return;
  }
  
  if (gameState === "playing" && isPlayerTurn && !processingTurn) {
    if (millis() - lastActionTime < 500) return;
    
    if (mouseY > height - 150 && mouseY < height - 100) {
      if (mouseX > 50 && mouseX < 200) {
        playerAction("rally");
        lastActionTime = millis();
      } else if (mouseX > 250 && mouseX < 400) {
        playerAction("speech");
        lastActionTime = millis();
      } else if (mouseX > 450 && mouseX < 600) {
        playerAction("chaos");
        lastActionTime = millis();
      }
    }
  }
  
  if (gameState === "gameOver") {
    resetGame();
  }
}

function mouseClicked() {
  if (gameState === "start") {
    gameState = "playing";
    return;
  }
  
  if (gameState === "playing" && isPlayerTurn) {
    if (mouseY > height - 150 && mouseY < height - 100) {
      if (mouseX > 50 && mouseX < 200) {
        playerAction("rally");
      } else if (mouseX > 250 && mouseX < 400) {
        playerAction("speech");
      } else if (mouseX > 450 && mouseX < 600) {
        playerAction("chaos");
      }
    }
  }
  
  if (gameState === "gameOver") {
    resetGame();
  }
}

/** Draws the background with a cityscape */
function drawBackground() {
  // Ground
  fill(80, 60, 40);
  rect(0, height - 100, width, 100);
  // Buildings
  fill(120, 100, 80);
  rect(50, height - 180, 60, 80);
  rect(150, height - 220, 40, 120);
  rect(650, height - 200, 50, 100);
  rect(750, height - 160, 30, 60);
}

/** Draws Trump with custom sprite */
function drawTrump() {
  // Hair (golden swoop)
  fill(255, 215, 0);
  beginShape();
  vertex(100, 140);
  vertex(150, 140);
  vertex(160, 160);
  vertex(140, 150);
  vertex(120, 160);
  endShape(CLOSE);
  // Body (suit)
  fill(0, 0, 180);
  rect(100, 200, 60, 120);
  // Head
  fill(245, 200, 150);
  ellipse(130, 170, 50, 60);
  // Eyes
  fill(255);
  ellipse(120, 165, 10, 8);
  ellipse(140, 165, 10, 8);
  fill(0);
  ellipse(120, 165, 4, 4);
  ellipse(140, 165, 4, 4);
  // Mouth (confident smirk)
  noFill();
  stroke(0);
  arc(130, 185, 20, 10, 0, PI / 2);
  noStroke();
  // Tie (long red tie)
  fill(255, 0, 0);
  beginShape();
  vertex(130, 200);
  vertex(120, 260);
  vertex(140, 260);
  endShape(CLOSE);
}

/** Draws Macron with custom sprite */
function drawMacron() {
  // Hair (neat and dark)
  fill(50, 30, 20);
  ellipse(width - 130, 150, 50, 30);
  // Body (suit)
  fill(0, 50, 100);
  rect(width - 160, 200, 60, 120);
  // Head
  fill(245, 200, 150);
  ellipse(width - 130, 170, 50, 60);
  // Eyes
  fill(255);
  ellipse(width - 140, 165, 10, 8);
  ellipse(width - 120, 165, 10, 8);
  fill(0);
  ellipse(width - 140, 165, 4, 4);
  ellipse(width - 120, 165, 4, 4);
  // Mouth (calm line)
  stroke(0);
  line(width - 140, 185, width - 120, 185);
  noStroke();
  // Tie (blue and short)
  fill(0, 100, 255);
  rect(width - 140, 200, 20, 40);
}

/** Draws the explosion with dynamic size */
function drawExplosion() {
  let radius = map(explosionSize, 0, 100, 0, 200);
  for (let i = 5; i > 0; i--) {
    fill(255, 150 - i * 30, 0, 100 - i * 20);
    ellipse(width / 2, height / 2, radius * i / 5, radius * i / 5);
  }
}

/** Displays player action buttons */
function drawPlayerActions() {
  fill(0, 200, 0);
  rect(50, height - 150, 150, 50);
  rect(250, height - 150, 150, 50);
  rect(450, height - 150, 150, 50);
  fill(255);
  text("Rally (+10)", 125, height - 125);
  text("Speech (+15)", 325, height - 125);
  text("Chaos (+25, 20% -10)", 525, height - 125);
}

/** Processes player's chosen action */
function playerAction(action) {
  processingTurn = true;
  
  let change = 0;
  if (action === "rally") {
    change = 10;
  } else if (action === "speech") {
    change = 15;
  } else if (action === "chaos") {
    change = random() < 0.2 ? -10 : 25;
  }
  
  targetExplosionSize += change;
  targetExplosionSize = constrain(targetExplosionSize, 0, 200);
  animationFrame = 30;
  isPlayerTurn = false;
  turnCount++;
  
  if (turnCount >= maxTurns) {
    checkGameOver();
  }
  
  processingTurn = false;
}

/** AI decides Macron's action */
function aiAction() {
  processingTurn = true;
  
  let action = explosionSize < 40 ? "talks" : explosionSize < 60 ? "peace" : "sanctions";
  if (random() < 0.2) {
    action = ["talks", "peace", "sanctions"][floor(random(3))];
  }
  
  let change = 0;
  if (action === "talks") {
    change = -5;
  } else if (action === "peace") {
    change = -10;
  } else if (action === "sanctions") {
    change = random() < 0.1 ? 10 : -20;
  }
  
  targetExplosionSize += change;
  targetExplosionSize = constrain(targetExplosionSize, 0, 200);
  animationFrame = 30;
  isPlayerTurn = true;
  
  checkGameOver();
  
  processingTurn = false;
}

/** Animates the explosion size transition */
function animateExplosion() {
  if (animationFrame > 0) {
    explosionSize = lerp(explosionSize, targetExplosionSize, 0.1);
    animationFrame--;
  } else {
    explosionSize = targetExplosionSize;
  }
}

/** Checks if the game should end */
function checkGameOver() {
  if (explosionSize >= 100 || (explosionSize < 50 && !isPlayerTurn)) {
    gameState = "gameOver";
  }
  else if (turnCount >= maxTurns) {
    gameState = "gameOver";
  }
}

/** Resets the game to initial state */
function resetGame() {
  explosionSize = 0;
  targetExplosionSize = 0;
  animationFrame = 0;
  gameState = "start";
  isPlayerTurn = true;
  turnCount = 0;
  processingTurn = false;
  lastActionTime = 0;
}
