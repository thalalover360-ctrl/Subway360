const SubwayView = {
  // Track, side walls aur lighting environment
  initEnvironment: function(scene) {
    // Ground / Track Base
    const groundGeo = new THREE.PlaneGeometry(10, 400);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x1f2026 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.z = -150;
    scene.add(ground);

    // Track rails (subway track lines)
    const railMat = new THREE.MeshBasicMaterial({ color: 0x5a6075 });
    for (let x of [-2.5, 0, 2.5]) {
      for (let offset of [-0.4, 0.4]) {
        const railGeo = new THREE.PlaneGeometry(0.08, 400);
        const rail = new THREE.Mesh(railGeo, railMat);
        rail.rotation.x = -Math.PI / 2;
        rail.position.set(x + offset, 0.02, -150);
        scene.add(rail);
      }
    }

    // Subway Tunnel Side Walls
    for (let side of [-6, 6]) {
      const wallGeo = new THREE.BoxGeometry(1.5, 8, 400);
      const wallMat = new THREE.MeshLambertMaterial({ color: 0x12141c });
      const wall = new THREE.Mesh(wallGeo, wallMat);
      wall.position.set(side, 3.5, -150);
      scene.add(wall);
    }
  },

  // Subway Train Obstacle
  createTrain: function(laneX) {
    const group = new THREE.Group();
    group.userData = { type: 'train' };

    // Main Train Body
    const trainGeo = new THREE.BoxGeometry(2.3, 2.7, 10);
    const trainMat = new THREE.MeshLambertMaterial({ color: 0xbf2626 });
    const train = new THREE.Mesh(trainGeo, trainMat);
    train.position.y = 1.35;
    group.add(train);

    // Train Front Window
    const winGeo = new THREE.PlaneGeometry(1.8, 0.9);
    const winMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
    const win = new THREE.Mesh(winGeo, winMat);
    win.position.set(0, 1.8, 5.01);
    group.add(win);

    group.position.set(laneX, 0, -120);
    return group;
  },

  // Low Hurdle / Barrier Obstacle (Jisko jump karke paar karna hota hai)
  createBarrier: function(laneX) {
    const group = new THREE.Group();
    group.userData = { type: 'barrier' };

    // Crossbar
    const barGeo = new THREE.BoxGeometry(2.2, 0.35, 0.3);
    const barMat = new THREE.MeshLambertMaterial({ color: 0xf59e0b });
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.y = 0.5;
    group.add(bar);

    // Side legs
    for (let side of [-0.9, 0.9]) {
      const legGeo = new THREE.BoxGeometry(0.2, 0.7, 0.2);
      const legMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(side, 0.35, 0);
      group.add(leg);
    }

    group.position.set(laneX, 0, -120);
    return group;
  },

  // Rotating Gold Coin
  createCoin: function(laneX, zOffset) {
    const coinGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 16);
    const coinMat = new THREE.MeshLambertMaterial({ color: 0xffd700 });
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.rotation.z = Math.PI / 2;
    coin.position.set(laneX, 0.75, zOffset);
    coin.userData = { type: 'coin' };
    return coin;
  }
};
