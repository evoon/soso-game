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

// Pixel-based collision from border.png
const borderImg = new Image()
borderImg.src = './img/border.png'
let borderCanvas = null
let borderCtx = null
let borderData = null
borderImg.onload = () => {
  borderCanvas = document.createElement('canvas')
  borderCanvas.width = borderImg.width
  borderCanvas.height = borderImg.height
  borderCtx = borderCanvas.getContext('2d')
  borderCtx.drawImage(borderImg, 0, 0)
  borderData = borderCtx.getImageData(0, 0, borderCanvas.width, borderCanvas.height)
}

function isBlocked(screenX, screenY) {
  if (!borderData) return false
  // Convert screen position to map pixel
  const mapX = Math.floor((screenX - background.position.x) / scaleFactor)
  const mapY = Math.floor((screenY - background.position.y) / scaleFactor)
  if (mapX < 0 || mapY < 0 || mapX >= borderData.width || mapY >= borderData.height) return true
  const index = (mapY * borderData.width + mapX) * 4
  const a = borderData.data[index + 3]
  // If pixel is not transparent, it's blocked
  return a > 10
}
const moveSpeed = 0.75 * scaleFactor
const offset = {
  x: -2260 * scaleFactor,
  y: -349 * scaleFactor
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

// Bruno - placed manually
const brunoImg = new Image()
brunoImg.src = './img/oldMan/Idle.png'
const bruno = new Character({
  position: {
    x: 21.5 * 48 * scaleFactor + offset.x,
    y: 10.6 * 48 * scaleFactor + offset.y
  },
  image: brunoImg,
  frames: {
    max: 4,
    hold: 60
  },
  scale: 3 * scaleFactor,
  animate: false,
  name: 'Bruno',
  defaultFrame: 0,
  talkFrame: 3,
  dialogue: [
    { speaker: 'Bruno', text: 'Salut Solène, mais qu\'est-ce que tu fais là ?', audio: './audio/question1.mp3' },
    { speaker: 'Solène', text: 'Je cherche Evan, est-ce que tu l\'as vu ?', audio: './audio/question_court.mp3', auto: true },
    { speaker: 'Bruno', text: 'Mhhh.. peut-être aux rochers à l\'entrée ?', audio: './audio/explication2.mp3' }
  ]
})
characters.push(bruno)

// Evan NPC - hidden initially
const evanDownImg = new Image()
evanDownImg.src = './img/evan/playerDown.png'
const evanUpImg = new Image()
evanUpImg.src = './img/evan/playerUp.png'
const evanLeftImg = new Image()
evanLeftImg.src = './img/evan/playerLeft.png'
const evanRightImg = new Image()
evanRightImg.src = './img/evan/playerRight.png'

const evan = new Character({
  position: {
    x: 41.8 * 48 * scaleFactor + offset.x,
    y: 6.18 * 48 * scaleFactor + offset.y
  },
  image: evanDownImg,
  frames: {
    max: 4,
    hold: 20
  },
  sprites: {
    up: evanUpImg,
    left: evanLeftImg,
    right: evanRightImg,
    down: evanDownImg
  },
  scale: (canvas.width / 1024),
  animate: false,
  name: 'Evan',
  dialogue: [
    { speaker: 'Evan', text: 'Ah Solène, tu es enfin là !', audio: './audio/explication_court.mp3' },
    { speaker: 'Evan', text: 'Assieds-toi sur le rocher', audio: './audio/explication_court.mp3', onComplete: 'evanSitScene' },
    { speaker: 'Evan', text: 'Tu te souviens de ce moment à Roz Armor, le soir, sur ces rochers ?', audio: './audio/explication1.mp3' },
    { speaker: 'Solène', text: 'Oui, c\'était trop bien !', audio: './audio/explication2.mp3' },
    { speaker: 'Evan', text: 'Il y avait une étoile filante qui était passée et tu m\'avais demandé de faire un voeu', audio: './audio/explication3.mp3' },
    { speaker: 'Solène', text: 'Oh oui ! Et tu ne m\'avais jamais dit ce que c\'était ?', audio: './audio/explication1.mp3' },
    { speaker: 'Evan', text: 'Oui, et je vais maintenant te le dire', audio: './audio/explication_court.mp3' },
    { speaker: 'Evan', text: 'Je ne te l\'ai pas dit car ça faisait encore peu de temps qu\'on était ensemble et je ne voulais pas te perturber', audio: './audio/explication1.mp3' },
    { speaker: 'Evan', text: 'Mon voeu ce soir là, lorsque cette étoile filante est passée', audio: './audio/explication2.mp3' },
    { speaker: 'Evan', text: 'Etait...', audio: './audio/explication_court.mp3' },
    { speaker: 'Evan', text: 'De passer le restant de mes jours avec toi', audio: './audio/explication3.mp3' },
    { speaker: 'Evan', text: 'Je ne suis pas très bon pour exprimer mes sentiments pour toi mais voici un petit poème qui j\'espère te plaira :', audio: './audio/explication1.mp3' },
    { speaker: 'Evan', text: 'Si Solène a un million de fans, alors je suis l\'un d\'entre eux.', audio: './audio/explication2.mp3' },
    { speaker: 'Evan', text: 'Si Solène a 10 fans, alors je suis l\'un d\'entre eux.', audio: './audio/explication_court.mp3' },
    { speaker: 'Evan', text: 'Si Solène n\'a qu\'un seul fan, alors c\'est moi.', audio: './audio/explication_court.mp3' },
    { speaker: 'Evan', text: 'Si Solène n\'a plus de fans, alors cela signifie que je ne suis plus sur cette Terre.', audio: './audio/explication3.mp3' },
    { speaker: 'Evan', text: 'Si le monde est contre Solène, alors je suis contre le monde.', audio: './audio/explication1.mp3', onComplete: 'endingScene' }
  ]
})
evan.opacity = 0
characters.push(evan)

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
  const radius = Math.max(canvas.width, canvas.height) * 0.5
  const vignette = c.createRadialGradient(centerX, centerY, radius * 0.15, centerX, centerY, radius)
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
  vignette.addColorStop(0.4, 'rgba(0, 0, 0, 0.3)')
  vignette.addColorStop(0.7, 'rgba(0, 0, 0, 0.6)')
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.95)')
  c.fillStyle = vignette
  c.fillRect(0, 0, canvas.width, canvas.height)

  // Limit movement updates to TARGET_FPS
  const elapsed = timestamp - lastFrameTime
  if (elapsed < FRAME_INTERVAL) return
  lastFrameTime = timestamp - (elapsed % FRAME_INTERVAL)

  let moving = true
  player.animate = false

  if (battle.initiated) return
  if (playerLocked) return

  // Check for nearby characters to interact with
  player.interactionAsset = null
  for (let i = 0; i < characters.length; i++) {
    const character = characters[i]
    const dx = (player.position.x + player.width / 2) - (character.position.x + character.width / 2)
    const dy = (player.position.y + player.height / 2) - (character.position.y + character.height / 2)
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 80 * scaleFactor) {
      player.interactionAsset = character
      break
    }
  }

  // Player feet position (bottom center of sprite)
  const playerFeetX = player.position.x + player.width / 2
  const playerFeetY = player.position.y + player.height

  if (keys.z.pressed && lastKey === 'z') {
    player.animate = true
    player.image = player.sprites.up
    if (!isBlocked(playerFeetX, playerFeetY - moveSpeed)) {
      movables.forEach((movable) => {
        movable.position.y += moveSpeed
      })
    }
  } else if (keys.q.pressed && lastKey === 'q') {
    player.animate = true
    player.image = player.sprites.left
    if (!isBlocked(playerFeetX - moveSpeed, playerFeetY)) {
      movables.forEach((movable) => {
        movable.position.x += moveSpeed
      })
    }
  } else if (keys.s.pressed && lastKey === 's') {
    player.animate = true
    player.image = player.sprites.down
    if (!isBlocked(playerFeetX, playerFeetY + moveSpeed)) {
      movables.forEach((movable) => {
        movable.position.y -= moveSpeed
      })
    }
  } else if (keys.d.pressed && lastKey === 'd') {
    player.animate = true
    player.image = player.sprites.right
    if (!isBlocked(playerFeetX + moveSpeed, playerFeetY)) {
      movables.forEach((movable) => {
        movable.position.x -= moveSpeed
      })
    }
  }
}
//animate()

let lastKey = ''
let playerLocked = false
let currentDialogueAudio = null

function showDialogueLine(line) {
  const dialogueBox = document.querySelector('#characterDialogueBox')
  const nameTag = document.querySelector('#characterDialogueName')
  const textEl = document.querySelector('#characterDialogueText')
  const arrow = document.querySelector('#characterDialogueArrow')
  arrow.style.display = 'none'

  // Handle structured dialogue (with speaker/text/audio)
  if (typeof line === 'object') {
    nameTag.textContent = line.speaker
    nameTag.style.display = 'block'
    textEl.textContent = line.text

    // Pink style for Solène, default brown for others
    if (line.speaker.toLowerCase() === 'solène') {
      dialogueBox.style.borderColor = '#E91E7B'
      dialogueBox.style.boxShadow = '0 0 0 3px #F06BA8, 4px 6px 12px rgba(0,0,0,0.4)'
      nameTag.style.backgroundColor = '#E91E7B'
      arrow.style.color = '#E91E7B'
    } else {
      dialogueBox.style.borderColor = '#8B6914'
      dialogueBox.style.boxShadow = '0 0 0 3px #C4A44A, 4px 6px 12px rgba(0,0,0,0.4)'
      nameTag.style.backgroundColor = '#8B6914'
      arrow.style.color = '#8B6914'
    }

    // Stop previous audio
    if (currentDialogueAudio) {
      currentDialogueAudio.stop()
      currentDialogueAudio = null
    }

    // Play audio if specified
    if (line.audio) {
      currentDialogueAudio = new Howl({
        src: [line.audio],
        volume: 1
      })
      currentDialogueAudio.play()
    }
  } else {
    // Legacy string dialogue
    nameTag.style.display = 'none'
    textEl.textContent = line
    arrow.style.color = '#8B6914'
  }

  dialogueBox.style.display = 'block'

  // Show arrow after a short delay
  setTimeout(() => {
    arrow.style.display = 'block'
  }, 500)
}

function executeDialogueCallback(callbackName, onDone) {
  if (callbackName === 'evanSitScene') {
    // Evan faces up
    evan.image = evanUpImg
    evan.frames.val = 0
    evan.animate = false

    // Move Solène to the target position
    // Target map offset: (-4455.9, -329.4)
    // Current map offset: background.position
    const targetOffsetX = -4455.9
    const targetOffsetY = -329.4
    const deltaX = targetOffsetX - background.position.x
    const deltaY = targetOffsetY - background.position.y

    movables.forEach((movable) => {
      movable.position.x += deltaX
      movable.position.y += deltaY
    })

    // Force Solène to face up
    player.image = player.sprites.up
    player.frames.val = 0
    player.animate = false

    // Lock player movement permanently
    playerLocked = true

    // Hide dialogue box and pause for 2.5 seconds
    document.querySelector('#characterDialogueBox').style.display = 'none'
    setTimeout(() => {
      if (onDone) onDone()
    }, 2500)
    return
  }
  if (callbackName === 'endingScene') {
    // Hide dialogue box
    document.querySelector('#characterDialogueBox').style.display = 'none'

    // Stop music
    audio.Map.stop()

    // Create a black overlay that covers everything
    const endingOverlay = document.createElement('div')
    endingOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 150; pointer-events: none;'
    document.body.appendChild(endingOverlay)

    // Use SVG for inverted circle (black outside, transparent inside)
    const size = Math.max(window.innerWidth, window.innerHeight) * 1.5
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2

    endingOverlay.innerHTML = `
      <svg width="100%" height="100%" style="position:absolute;top:0;left:0;">
        <defs>
          <mask id="circleMask">
            <rect width="100%" height="100%" fill="white"/>
            <circle cx="${cx}" cy="${cy}" r="${size}" fill="black" id="endingCircle"/>
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="black" mask="url(#circleMask)"/>
      </svg>
    `

    const circle = endingOverlay.querySelector('#endingCircle')
    gsap.to(circle, {
      attr: { r: 0 },
      duration: 2,
      ease: 'power2.inOut',
      onComplete() {
        // Full black screen
        endingOverlay.innerHTML = ''
        endingOverlay.style.background = 'black'

        setTimeout(() => {
          // Show "Je t'aime <3"
          const loveMsg = document.createElement('div')
          loveMsg.textContent = 'Je t\'aime \u2764'
          loveMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-family: "Press Start 2P", cursive; font-size: 42px; z-index: 200; opacity: 0; text-align: center;'
          document.body.appendChild(loveMsg)
          gsap.to(loveMsg, {
            opacity: 1,
            duration: 1.5,
            ease: 'power2.inOut'
          })
        }, 2500)
      }
    })
    return
  }
  if (onDone) onDone()
}

function advanceDialogue() {
  const asset = player.interactionAsset

  // Check if the current line has an onComplete callback before advancing
  const prevLine = asset.dialogue[asset.dialogueIndex]
  if (typeof prevLine === 'object' && prevLine.onComplete) {
    executeDialogueCallback(prevLine.onComplete, () => {
      continueAdvance(asset)
    })
    return
  }

  continueAdvance(asset)
}

function continueAdvance(asset) {
  asset.dialogueIndex++

  const { dialogueIndex, dialogue } = asset
  if (dialogueIndex <= dialogue.length - 1) {
    const line = dialogue[dialogueIndex]
    showDialogueLine(line)

    // Auto-advance if the line has auto: true (player's own line)
    if (typeof line === 'object' && line.auto) {
      const autoDelay = line.audio ? 2500 : 1500
      setTimeout(() => {
        if (player.isInteracting && asset.dialogueIndex === dialogueIndex) {
          advanceDialogue()
        }
      }, autoDelay)
    }
    return
  }

  // Finish conversation
  if (currentDialogueAudio) {
    currentDialogueAudio.stop()
    currentDialogueAudio = null
  }
  // Reset character face direction
  if (asset.defaultFrame !== undefined) {
    asset.frames.val = asset.defaultFrame
  }
  player.isInteracting = false
  asset.dialogueIndex = 0
  document.querySelector('#characterDialogueBox').style.display = 'none'

  // Make Evan appear after talking to Bruno
  if (asset === bruno && evan.opacity === 0) {
    gsap.to(evan, {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.inOut'
    })
  }
}

window.addEventListener('keydown', (e) => {
  if (player.isInteracting) {
    switch (e.key) {
      case ' ':
        // Don't advance if current line is auto-advancing
        const currentLine = player.interactionAsset.dialogue[player.interactionAsset.dialogueIndex]
        if (typeof currentLine === 'object' && currentLine.auto) return

        advanceDialogue()
        break
    }
    return
  }

  switch (e.key) {
    case ' ':
      if (!player.interactionAsset) return

      // Face the player when talked to
      if (player.interactionAsset.talkFrame !== undefined) {
        player.interactionAsset.frames.val = player.interactionAsset.talkFrame
      }

      // beginning the conversation
      const firstLine = player.interactionAsset.dialogue[0]
      showDialogueLine(firstLine)
      player.isInteracting = true

      // Auto-advance if first line is auto
      if (typeof firstLine === 'object' && firstLine.auto) {
        const autoDelay = firstLine.audio ? 2500 : 1500
        setTimeout(() => {
          if (player.isInteracting && player.interactionAsset.dialogueIndex === 0) {
            advanceDialogue()
          }
        }, autoDelay)
      }
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
