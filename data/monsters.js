const monsters = {
  Emby: {
    position: {
      x: window.innerWidth * 0.27,  // 280/1024 ≈ 0.27
      y: window.innerHeight * 0.56   // 325/576 ≈ 0.56
    },
    image: {
      src: './img/embySprite.png'
    },
    frames: {
      max: 4,
      hold: 30
    },
    animate: true,
    name: 'Emby',
    attacks: [attacks.Tackle, attacks.Fireball]
  },
  Draggle: {
    position: {
      x: window.innerWidth * 0.78,   // 800/1024 ≈ 0.78
      y: window.innerHeight * 0.17   // 100/576 ≈ 0.17
    },
    image: {
      src: './img/draggleSprite.png'
    },
    frames: {
      max: 4,
      hold: 30
    },
    animate: true,
    isEnemy: true,
    name: 'Draggle',
    attacks: [attacks.Tackle, attacks.Fireball]
  }
}
