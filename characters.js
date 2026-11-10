const CharacterManager = {
  // Stats and colors for all runners
  profiles: {
    neon: {
      name: "Neon Runner",
      bodyColor: 0x00ff88,
      headColor: 0x111111,
      limbsColor: 0x00cc6a,
      speedMultiplier: 1.0
    },
    blaze: {
      name: "Blaze Flash",
      bodyColor: 0xff3300,
      headColor: 0xffcc00,
      limbsColor: 0x991100,
      speedMultiplier: 1.05
    },
    cyber: {
      name: "Cyber Proto",
      bodyColor: 0x00bbff,
      headColor: 0xff00cc,
      limbsColor: 0x0077aa,
      speedMultiplier: 1.1
    }
  },

  createPlayer: function(id) {
    const p = this.profiles[id] || this.profiles.neon;
    const playerGroup = new THREE.Group();

    // Body (Torso)
    const torsoGeo = new THREE.BoxGeometry(0.8, 1.0, 0.5);
    const torsoMat = new THREE.MeshLambertMaterial({ color: p.bodyColor });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 0.9;
    playerGroup.add(torso);

    // Head
    const headGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const headMat = new THREE.MeshLambertMaterial({ color: p.headColor });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.7;
    playerGroup.add(head);

    // Left Leg
    const legGeo = new THREE.BoxGeometry(0.25, 0.7, 0.3);
    const legMat = new THREE.MeshLambertMaterial({ color: p.limbsColor });
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.25, 0.35, 0);
    playerGroup.add(leftLeg);

    // Right Leg
    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(0.25, 0.35, 0);
    playerGroup.add(rightLeg);

    // Store references for running animation
    playerGroup.userData = {
      leftLeg: leftLeg,
      rightLeg: rightLeg,
      animClock: 0
    };

    return playerGroup;
  },

  animateRunning: function(playerGroup, isJumping) {
    if (!playerGroup || !playerGroup.userData) return;
    const data = playerGroup.userData;

    if (isJumping) {
      // Legs tucked when jumping
      data.leftLeg.rotation.x = -0.6;
      data.rightLeg.rotation.x = 0.3;
      return;
    }

    // Running legs swing
    data.animClock += 0.25;
    data.leftLeg.rotation.x = Math.sin(data.animClock) * 0.7;
    data.rightLeg.rotation.x = -Math.sin(data.animClock) * 0.7;
  }
};
