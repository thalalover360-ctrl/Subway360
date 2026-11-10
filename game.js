let scene, camera, renderer, player;
const lanes = [-2.5, 0, 2.5];
let currentLane = 1;

// Physics
let jumping = false;
let jumpVel = 0;
const gravity = 0.018;

// Spawning & Objects
let obstacles = [];
let coins = [];
let speed = 0.55;
let score = 0;
let runCoins = 0;
let isGameOver = false;

// Controls
let touchX = 0;
let touchY = 0;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0e111a);
  scene.fog = new THREE.Fog(0x0e111a, 30, 95);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 150);
  camera.position.set(0, 4.2, 7.5);
  camera.lookAt(0, 1.2, -3);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.HemisphereLight(0xffffff, 0x333845, 1.2));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5, 15, 10);
  scene.add(dirLight);

  // Subway Environment
  SubwayView.initEnvironment(scene);

  // Equipped Character
  const selectedChar = localStorage.getItem('selectedCharacter') || 'neon';
  player = CharacterManager.createPlayer(selectedChar);
  player.position.set(lanes[currentLane], 0, 0);
  scene.add(player);

  setupControls();
  window.addEventListener('resize', onResize);
  gameLoop();
}

let spawnTimer = 0;

function gameLoop() {
  requestAnimationFrame(gameLoop);
  if (isGameOver) return;

  // Jump physics
  if (jumping) {
    player.position.y += jumpVel;
    jumpVel -= gravity;
    if (player.position.y <= 0) {
      player.position.y = 0;
      jumping = false;
    }
  }

  // Smooth lane shift
  player.position.x += (lanes[currentLane] - player.position.x) * 0.22;

  // Running leg animation
  CharacterManager.animateRunning(player, jumping);

  // Spawner (Trains, Barriers & Coins)
  spawnTimer++;
  if (spawnTimer > 55) {
    const laneIndex = Math.floor(Math.random() * lanes.length);
    const chosenLane = lanes[laneIndex];

    // 50% Train, 50% Hurdle
    if (Math.random() > 0.5) {
      const train = SubwayView.createTrain(chosenLane);
      scene.add(train);
      obstacles.push(train);
    } else {
      const barrier = SubwayView.createBarrier(chosenLane);
      scene.add(barrier);
      obstacles.push(barrier);
    }

    // Spawn 3 coins in a row on another lane
    const otherLane = lanes[(laneIndex + 1) % 3];
    for (let c = 0; c < 3; c++) {
      const coin = SubwayView.createCoin(otherLane, -120 - (c * 4));
      scene.add(coin);
      coins.push(coin);
    }

    spawnTimer = 0;
  }

  const pBox = new THREE.Box3().setFromObject(player);

  // Move & check obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    obs.position.z += speed;

    const oBox = new THREE.Box3().setFromObject(obs);

    // Collision check
    if (pBox.intersectsBox(oBox)) {
      handleGameOver();
      return;
    }

    // Cleanup offscreen
    if (obs.position.z > 15) {
      scene.remove(obs);
      obstacles.splice(i, 1);
      score += 15;
      document.getElementById('scoreText').innerText = score;
    }
  }

  // Move & collect coins
  for (let j = coins.length - 1; j >= 0; j--) {
    const coin = coins[j];
    coin.position.z += speed;
    coin.rotation.y += 0.05; // Spin coin

    const cBox = new THREE.Box3().setFromObject(coin);
    if (pBox.intersectsBox(cBox)) {
      scene.remove(coin);
      coins.splice(j, 1);
      runCoins += 1;
      document.getElementById('coinText').innerText = runCoins;
      continue;
    }

    if (coin.position.z > 15) {
      scene.remove(coin);
      coins.splice(j, 1);
    }
  }

  // Gradual speed acceleration
  speed += 0.00004;

  renderer.render(scene, camera);
}

function handleGameOver() {
  isGameOver = true;

  // Save Highscore & Coins into LocalStorage
  const prevBest = parseInt(localStorage.getItem('subway_highscore') || '0');
  if (score > prevBest) {
    localStorage.setItem('subway_highscore', score);
  }

  const totalCoins = parseInt(localStorage.getItem('subway_coins') || '250');
  localStorage.setItem('subway_coins', totalCoins + runCoins);

  document.getElementById('finalScore').innerText = score;
  document.getElementById('finalCoins').innerText = runCoins;
  document.getElementById('gameover').style.display = 'block';
}

function setupControls() {
  window.addEventListener('touchstart', e => {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', e => {
    if (isGameOver) return;
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 35 && currentLane < 2) currentLane++;
      else if (dx < -35 && currentLane > 0) currentLane--;
    } else {
      if (dy < -35 && !jumping) {
        jumping = true;
        jumpVel = 0.28;
      }
    }
  }, { passive: true });

  // Keyboard controls (Arrow keys & Space)
  window.addEventListener('keydown', e => {
    if (isGameOver) return;
    if (e.key === 'ArrowLeft' && current
        
