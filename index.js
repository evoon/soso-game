const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, 70 + i))
}

const charactersMap = []
for (let i = 0; i < charactersMapData.length; i += 70) {
  charactersMap.push(charactersMapData.slice(i, 70 + i))
}
console.log(charactersMap)

const boundaries = []
const zoomLevel = 1.4
const scaleFactor = (canvas.width / 1024) * zoomLevel
const moveSpeed = 1.5 * scaleFactor
const offset = {
  x: -2033 * scaleFactor,
  y: -204 * scaleFactor
}

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * 48 * scaleFactor + offset.x,
            y: i * 48 * scaleFactor + offset.y
          },
          scale: scaleFactor
        })
      )
  })
})

const battleZones = []

battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      battleZones.push(
        new Boundary({
          position: {
            x: j * 48 * scaleFactor + offset.x,
            y: i * 48 * scaleFactor + offset.y
          },
          scale: scaleFactor
        })
      )
  })
})

const characters = []
const villagerImg = new Image()
villagerImg.src = './img/villager/Idle.png'

const oldManImg = new Image()
oldManImg.src = './img/oldMan/Idle.png'

charactersMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    // 1026 === villager
    if (symbol === 1026) {
      characters.push(
        new Character({
          position: {
            x: j * 48 * scaleFactor + offset.x,
            y: i * 48 * scaleFactor + offset.y
          },
          image: villagerImg,
          frames: {
            max: 4,
            hold: 60
          },
          scale: 3 * scaleFactor,
          animate: true,
          dialogue: ['...', 'Hey mister, have you seen my Doggochu?']
        })
      )
    }
    // 1031 === oldMan
    else if (symbol === 1031) {
      characters.push(
        new Character({
          position: {
            x: j * 48 * scaleFactor + offset.x,
            y: i * 48 * scaleFactor + offset.y
          },
          image: oldManImg,
          frames: {
            max: 4,
            hold: 60
          },
          scale: 3 * scaleFactor,
          dialogue: ['My bones hurt.']
        })
      )
    }
  })
})

const image = new Image()
image.src = './img/map.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foregroundObjects.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

const playerScale = canvas.width / 1024
const player = new Sprite({
  position: {
    x: canvas.width / 2 - (192 / 4 / 2) * playerScale,
    y: canvas.height / 2 - (68 / 2) * playerScale
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 20
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage
  },
  scale: playerScale
})

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: image,
  scale: scaleFactor
})

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: foregroundImage,
  scale: scaleFactor
})

const keys = {
  z: {
    pressed: false
  },
  q: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
}

const movables = [
  background,
  foreground,
  ...boundaries,
  ...battleZones,
  ...characters
]
const renderables = [
  background,
  ...boundaries,
  ...battleZones,
  ...characters,
  player,
  foreground
]

const battle = {
  initiated: false
}

const TARGET_FPS = 30
const FRAME_INTERVAL = 1000 / TARGET_FPS
let lastFrameTime = 0

function animate(timestamp) {
  const animationId = window.requestAnimationFrame(animate)
  console.log('Player screen:', player.position.x.toFixed(1), player.position.y.toFixed(1), '| Map offset:', background.position.x.toFixed(1), background.position.y.toFixed(1))
  renderables.forEach((renderable) => {
    renderable.draw()
  })

  // Vignette effect
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = Math.max(canvas.width, canvas.height) * 0.55
  const vignette = c.createRadialGradient(centerX, centerY, radius * 0.3, centerX, centerY, radius)
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
  vignette.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)')
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.85)')
  c.fillStyle = vignette
  c.fillRect(0, 0, canvas.width, canvas.height)

  // Limit movement updates to TARGET_FPS
  const elapsed = timestamp - lastFrameTime
  if (elapsed < FRAME_INTERVAL) return
  lastFrameTime = timestamp - (elapsed % FRAME_INTERVAL)

  let moving = true
  player.animate = false

  if (battle.initiated) return

  if (keys.z.pressed && lastKey === 'z') {
    player.animate = true
    player.image = player.sprites.up
    movables.forEach((movable) => {
      movable.position.y += moveSpeed
    })
  } else if (keys.q.pressed && lastKey === 'q') {
    player.animate = true
    player.image = player.sprites.left
    movables.forEach((movable) => {
      movable.position.x += moveSpeed
    })
  } else if (keys.s.pressed && lastKey === 's') {
    player.animate = true
    player.image = player.sprites.down
    movables.forEach((movable) => {
      movable.position.y -= moveSpeed
    })
  } else if (keys.d.pressed && lastKey === 'd') {
    player.animate = true
    player.image = player.sprites.right
    movables.forEach((movable) => {
      movable.position.x -= moveSpeed
    })
  }
}
//animate()

let lastKey = ''
window.addEventListener('keydown', (e) => {
  if (player.isInteracting) {
    switch (e.key) {
      case ' ':
        player.interactionAsset.dialogueIndex++

        const { dialogueIndex, dialogue } = player.interactionAsset
        if (dialogueIndex <= dialogue.length - 1) {
          document.querySelector('#characterDialogueBox').innerHTML =
            player.interactionAsset.dialogue[dialogueIndex]
          return
        }

        // finish conversation
        player.isInteracting = false
        player.interactionAsset.dialogueIndex = 0
        document.querySelector('#characterDialogueBox').style.display = 'none'

        break
    }
    return
  }

  switch (e.key) {
    case ' ':
      if (!player.interactionAsset) return

      // beginning the conversation
      const firstMessage = player.interactionAsset.dialogue[0]
      document.querySelector('#characterDialogueBox').innerHTML = firstMessage
      document.querySelector('#characterDialogueBox').style.display = 'flex'
      player.isInteracting = true
      break
    case 'z':
      keys.z.pressed = true
      lastKey = 'z'
      break
    case 'q':
      keys.q.pressed = true
      lastKey = 'q'
      break

    case 's':
      keys.s.pressed = true
      lastKey = 's'
      break

    case 'd':
      keys.d.pressed = true
      lastKey = 'd'
      break
  }
})

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'z':
      keys.z.pressed = false
      break
    case 'q':
      keys.q.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
  }
})

// Handle window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})
