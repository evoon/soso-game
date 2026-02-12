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
        }, 1000)
        introDialogueBox.style.display = 'block'

        // Typewriter effect for "Bonjour solène !!"
        const message = 'Bonjour solène !!'
        let charIndex = 0

        function typeChar() {
          if (charIndex < message.length) {
            introDialogueText.innerHTML =
              message.substring(0, charIndex + 1) +
              '<span id="introDialogueCursor">|</span>'
            charIndex++
            // Vary speed slightly for natural feel
            const delay = message[charIndex - 1] === ' ' ? 80 : 65
            setTimeout(typeChar, delay)
          } else {
            // Typing done - remove cursor, show arrow
            introDialogueText.innerHTML = message
            introDialogueArrow.style.display = 'block'

            // Wait for click/keypress to dismiss intro
            function dismissIntro() {
              window.removeEventListener('keydown', dismissIntro)
              window.removeEventListener('click', dismissIntro)

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
            }

            // Small delay before allowing dismissal
            setTimeout(() => {
              window.addEventListener('keydown', dismissIntro)
              window.addEventListener('click', dismissIntro)
            }, 500)
          }
        }

        // Start typing after a small pause
        setTimeout(typeChar, 300)
      }
    })
  }, 2500)
}

// Start intro when page loads
window.addEventListener('load', playIntro)
