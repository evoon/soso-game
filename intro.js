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

  function typeMessage(message, callback, showChoicesDirectly) {
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
        if (callback) {
          if (showChoicesDirectly) {
            setTimeout(callback, 500)
          } else {
            introDialogueArrow.style.display = 'block'
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

        // Message 1
        typeMessage('Bonjour sol\u00e8ne !!', function showMessage2() {
          // Message 2: Switch video and audio
          introVideo.src = './video/question.mp4'
          introVideo.play()
          explication1Audio.play()

          typeMessage('Il faut que je te demande quelque chose de tr\u00e8s important...', function showMessage3() {
            // Message 3: The big question
            introVideo.src = './video/question.mp4'
            introVideo.play()
            question2Audio.play()

            typeMessage('Veux-tu \u00eatre ma Valentine ??', function showChoices() {
              // Hide the arrow, show choices instead
              introDialogueArrow.style.display = 'none'
              const choicesBox = document.querySelector('#introChoices')
              choicesBox.style.display = 'flex'

              const btnOui = document.querySelector('#btnOui')
              const btnNon = document.querySelector('#btnNon')

              btnOui.addEventListener('click', (e) => {
                e.stopPropagation()
                choicesBox.style.display = 'none'
                introDialogueBox.style.display = 'none'

                // Stop all audio
                bonjourAudio.stop()
                explication1Audio.stop()
                question2Audio.stop()

                // Phase 1: Fireworks celebration (5 seconds)
                const fireworksAudio = new Howl({
                  src: ['./audio/fireworks.mp3'],
                  volume: 1
                })
                fireworksAudio.play()

                // Show celebration emojis flooding the screen
                const celebrationEmojis = ['🎉', '🎊', '🥳', '🎆', '🎇', '✨', '💖', '❤️', '💕', '🏆', '🥂', '🍾', '💃', '🪩', '💗']
                introContent.style.clipPath = 'circle(75% at 50% 50%)'
                introContent.style.backgroundColor = 'black'
                introVideo.style.display = 'none'

                const emojiContainer = document.createElement('div')
                emojiContainer.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 200;'
                introContent.appendChild(emojiContainer)

                // Spawn emojis continuously
                const emojiInterval = setInterval(() => {
                  for (let i = 0; i < 5; i++) {
                    const emoji = document.createElement('div')
                    emoji.textContent = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)]
                    emoji.style.cssText = `
                      position: absolute;
                      font-size: ${24 + Math.random() * 40}px;
                      left: ${Math.random() * 100}%;
                      top: -50px;
                      pointer-events: none;
                      user-select: none;
                    `
                    emojiContainer.appendChild(emoji)

                    gsap.to(emoji, {
                      y: window.innerHeight + 100,
                      x: (Math.random() - 0.5) * 200,
                      rotation: Math.random() * 720 - 360,
                      duration: 2 + Math.random() * 2,
                      ease: 'power1.in',
                      onComplete() {
                        emoji.remove()
                      }
                    })
                  }
                }, 150)

                // After 5 seconds: stop fireworks, go to black + silent for 3 seconds
                setTimeout(() => {
                  clearInterval(emojiInterval)
                  fireworksAudio.stop()
                  emojiContainer.remove()

                  // Circle-close to black
                  gsap.to(introContent, {
                    clipPath: 'circle(0% at 50% 50%)',
                    duration: 0.8,
                    ease: 'power2.inOut',
                    onComplete() {
                      introContent.style.display = 'none'
                      introVideo.pause()
                      introVideo.remove()

                      // Phase 2: Messages on black screen
                      const blackMsg = document.createElement('div')
                      blackMsg.style.cssText = `
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        font-family: 'Press Start 2P', cursive;
                        font-size: 22px;
                        color: white;
                        text-align: center;
                        line-height: 1.8;
                        max-width: 80%;
                        opacity: 0;
                      `
                      introScreen.appendChild(blackMsg)

                      const messages = [
                        { text: 'Et c\'est tout !!', duration: 4000 },
                        { text: 'Quoi que...', duration: 2000 },
                        { text: 'Tu as été très gentille avec moi dernièrement...', duration: 3000 },
                        { text: 'Tu croyais que je t\'avais juste fait ça ?', duration: 3000 },
                        { text: 'Ce serait mal me connaître', duration: 3000 },
                        { text: 'Tu ne sors pas avec n\'importe qui !!', duration: 3000 }
                      ]

                      let msgIndex = 0
                      function showNextMessage() {
                        if (msgIndex >= messages.length) {
                          // Fade out last message then continue to car phase
                          gsap.to(blackMsg, {
                            opacity: 0,
                            duration: 0.4,
                            onComplete() {
                              blackMsg.remove()
                              startCarPhase()
                            }
                          })
                          return
                        }

                        blackMsg.textContent = messages[msgIndex].text
                        gsap.fromTo(blackMsg,
                          { opacity: 0 },
                          {
                            opacity: 1,
                            duration: 0.4,
                            onComplete() {
                              setTimeout(() => {
                                gsap.to(blackMsg, {
                                  opacity: 0,
                                  duration: 0.4,
                                  onComplete() {
                                    msgIndex++
                                    setTimeout(() => showNextMessage(), 300)
                                  }
                                })
                              }, messages[msgIndex].duration)
                            }
                          }
                        )
                      }

                      showNextMessage()

                      function startCarPhase() {
                        // Phase 3: Silent pause for 3 seconds
                        setTimeout(() => {
                          // Phase 4: Play car.mp3, black screen for 9 more seconds
                          const carAudio = new Howl({
                            src: ['./audio/car.mp3'],
                            volume: 1
                          })
                          carAudio.play()

                          setTimeout(() => {
                            // Phase 5: Reveal the game with circle
                            audio.Map.play()
                            animate()

                            introScreen.style.display = 'none'
                            const gameReveal = document.querySelector('#gameRevealOverlay')
                            gameReveal.style.display = 'block'
                            gameReveal.style.clipPath = 'circle(100% at 50% 50%)'
                            gsap.fromTo(gameReveal,
                              { clipPath: 'circle(100% at 50% 50%)' },
                              {
                                clipPath: 'circle(0% at 50% 50%)',
                                duration: 1.5,
                                ease: 'power2.inOut',
                                onComplete() {
                                  gameReveal.style.display = 'none'
                                }
                              }
                            )
                          }, 9000)
                        }, 3000)
                      }
                    }
                  })
                }, 5000)
              })

              btnNon.addEventListener('click', (e) => {
                e.stopPropagation()
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
            }, true)
          })
        })
      }
    })
  }, 2500)
}

// Start intro when page loads
window.addEventListener('load', playIntro)
