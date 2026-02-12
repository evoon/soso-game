function playIntro() {
  const introScreen = document.querySelector('#introScreen')
  const introContent = document.querySelector('#introContent')
  const introVideo = document.querySelector('#introVideo')
  const introDialogueBox = document.querySelector('#introDialogue')
  const introDialogueText = document.querySelector('#introDialogueText')
  const introDialogueArrow = document.querySelector('#introDialogueArrow')

  const bonjourAudio = new Howl({
    src: ['./audio/bonjour.mp3'],
    volume: 1
  })

  const explication1Audio = new Howl({
    src: ['./audio/explication1.mp3'],
    volume: 1
  })

  const question2Audio = new Howl({
    src: ['./audio/question2_choix.mp3'],
    volume: 1
  })

  function typeMessage(message, callback) {
    let charIndex = 0
    introDialogueArrow.style.display = 'none'

    function typeChar() {
      if (charIndex < message.length) {
        introDialogueText.innerHTML =
          message.substring(0, charIndex + 1) +
          '<span id="introDialogueCursor">|</span>'
        charIndex++
        const delay = message[charIndex - 1] === ' ' ? 80 : 65
        setTimeout(typeChar, delay)
      } else {
        introDialogueText.innerHTML = message
        introDialogueArrow.style.display = 'block'
        if (callback) {
          setTimeout(() => {
            function onInteract() {
              window.removeEventListener('keydown', onInteract)
              window.removeEventListener('click', onInteract)
              callback()
            }
            window.addEventListener('keydown', onInteract)
            window.addEventListener('click', onInteract)
          }, 500)
        }
      }
    }

    setTimeout(typeChar, 300)
  }

  // Phase 1: Black screen for 2.5 seconds
  setTimeout(() => {
    // Phase 2: Circle expands to reveal video
    introVideo.play()

    gsap.to(introContent, {
      clipPath: 'circle(75% at 50% 50%)',
      duration: 1.5,
      ease: 'power2.inOut',
      onComplete() {
        // Phase 3: Play audio and show dialogue
        setTimeout(() => {
          bonjourAudio.play()
        }, 500)
        introDialogueBox.style.display = 'block'

        // Message 1: Bonjour solène !!
        typeMessage('Bonjour solène !!', function showMessage2() {
          // Message 2: Switch video and audio
          introVideo.src = './video/question.mp4'
          introVideo.play()
          explication1Audio.play()

          typeMessage('Il faut que je te demande quelque chose de très important...', function showMessage3() {
            // Message 3: The big question
            introVideo.src = './video/question.mp4'
            introVideo.play()
            question2Audio.play()

            typeMessage('Veux-tu être ma Valentine ??', function showChoices() {
              // Hide the arrow, show choices instead
              introDialogueArrow.style.display = 'none'
              const choicesBox = document.querySelector('#introChoices')
              choicesBox.style.display = 'flex'

              const btnOui = document.querySelector('#btnOui')
              const btnNon = document.querySelector('#btnNon')

              btnOui.addEventListener('click', () => {
                choicesBox.style.display = 'none'

                // Fade out the intro screen
                gsap.to(introScreen, {
                  opacity: 0,
                  duration: 1,
                  onComplete() {
                    introScreen.style.display = 'none'
                    introVideo.pause()
                    introVideo.remove()

                    // Start the game
                    audio.Map.play()
                    animate()
                  }
                })
              })

              btnNon.addEventListener('click', () => {
                choicesBox.style.display = 'none'
                introDialogueBox.style.display = 'none'

                // Stop all current audio
                bonjourAudio.stop()
                explication1Audio.stop()
                question2Audio.stop()

                // Switch to black background with Karine gif
                introContent.style.clipPath = 'circle(75% at 50% 50%)'
                introContent.style.backgroundColor = 'black'
                introVideo.style.display = 'none'

                // Create looping gif
                const karineGif = document.createElement('img')
                karineGif.src = './video/karine/giphy.gif'
                karineGif.style.cssText = 'width: 40%; height: auto; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); object-fit: contain; pointer-events: none;'
                introContent.appendChild(karineGif)

                // Play Karine audio in loop
                const karineAudio = new Howl({
                  src: ['./video/karine/karine.mp3'],
                  volume: 1,
                  loop: true
                })
                karineAudio.play()
              })
            })
          })
        })
      }
    })
  }, 2500)
}

// Start intro when page loads
window.addEventListener('load', playIntro)
