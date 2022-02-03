document.addEventListener('DOMContentLoaded', async () => {
    createSquares()

    let guesses = [], hint = []
    let colors = ['rgb(120, 124, 126)', 'rgb(201, 180, 88)', 'rgb(106, 170, 100)']
    const changeColor = ({ target }) => {
        const index = (colors.indexOf(target.style.backgroundColor) + 1) % 3
        target.setAttribute('data-animation', 'flip-in')
        target.addEventListener('animationend', () => {
            target.style.backgroundColor = colors[index]
            if (target.getAttribute('data-animation') === 'flip-in') {
                target.setAttribute('data-animation', 'flip-out')
            }
        })
        hint[(target.id - 1) % 5] = index
    }
    const response = await fetch('ai/ai.json')
    let data = await response.json()
    addGuess(data.guess)

    function addGuess(guess, final) {
        if (guesses.length < 6) {
            if (guesses.length !== 0) {
                const prev = (guesses.length - 1) * 5 + 1
                for (let i = 0; i < guess.length; i++) {
                    const square = document.getElementById(String(prev + i))
                    square.removeEventListener('click', changeColor)
                    square.style.cursor = 'auto'
                }
            }
            const start = guesses.length * 5 + 1
            const letters = guess.split('')
            guesses.push(letters)
            hint = [0, 0, 0, 0, 0]
            for (let i = 0; i < guess.length; i++) {
                const square = document.getElementById(String(start + i))
                if (final) {
                    setTimeout(() => {
                        square.innerText = letters[i]
                        square.style.backgroundColor = '#6aaa64'
                        square.style.borderColor = 'transparent'
                        square.style.cursor = 'auto'
                        square.setAttribute('data-animation', 'flip-in')
                        square.addEventListener('animationend', () => {
                            if (square.getAttribute('data-animation') === 'flip-in') {
                                square.setAttribute('data-animation', 'flip-out')
                            } else {
                                square.removeAttribute('data-animation')
                            }
                        })
                    }, i * 100)
                    setTimeout(() => {
                        square.setAttribute('data-animation', 'bounce')
                    }, (i + 10) * 100)
                } else {
                    setTimeout(() => {
                        square.addEventListener('click', changeColor)
                        square.innerText = letters[i]
                        square.style.backgroundColor = '#787c7e'
                        square.style.borderColor = 'transparent'
                        square.style.cursor = 'pointer'
                        square.setAttribute('data-animation', 'flip-in')
                        square.addEventListener('animationend', () => {
                            if (square.getAttribute('data-animation') === 'flip-in') {
                                square.setAttribute('data-animation', 'flip-out')
                            } else {
                                square.removeAttribute('data-animation')
                            }
                        })
                    }, i * 100)
                }
            }
        }
    }

    function createSquares() {
        const gameBoard = document.getElementById('board')
        for (let i = 0; i < 30; i++) {
            let square = document.createElement('div')
            square.classList.add('square')
            square.id = String(i + 1)
            gameBoard.appendChild(square)
        }
    }

    document.querySelectorAll('.button-row button')[1].addEventListener('click', () => {
        if (Object.keys(data.hints).length > 0) {
            const hintString = hint.join('')
            const newData = data.hints[hintString]
            if (newData) {
                data = newData
                addGuess(newData.guess, Object.keys(newData.hints).length === 0)
            } else if (hintString === '22222') {
                const prev = (guesses.length - 1) * 5 + 1
                for (let i = 0; i < 5; i++) {
                    const square = document.getElementById(String(prev + i))
                    setTimeout(() => square.setAttribute('data-animation', 'bounce'), i * 100)
                }
            } else{
                const prev = (guesses.length - 1) * 5 + 1
                for (let i = 0; i < 5; i++) {
                    const square = document.getElementById(String(prev + i))
                    square.setAttribute('data-animation', 'shake')
                }
            }
        } else {
            const prev = (guesses.length - 1) * 5 + 1
            for (let i = 0; i < 5; i++) {
                const square = document.getElementById(String(prev + i))
                setTimeout(() => square.setAttribute('data-animation', 'bounce'), i * 100)
            }
        }
    })

    const [instructionsModal, settingsModal] = document.getElementsByClassName('modal')
    const [instructionsButton, settingsButton] = document.getElementsByClassName('modal-button')
    instructionsButton.addEventListener('click', () => {
        instructionsModal.style.display = 'block'
    })
    settingsButton.addEventListener('click', () => {
        settingsModal.style.display = 'block'
    })

    const closeButtons = document.getElementsByClassName('close')
    closeButtons[1].addEventListener('click', () => {
        instructionsModal.style.display = 'none'
    })
    closeButtons[3].addEventListener('click', () => {
        settingsModal.style.display = 'none'
    })

    const root = document.documentElement
    const darkModeButton = document.getElementById('darkMode')
    if (localStorage.getItem('darkMode')) {
        darkModeButton.checked = JSON.parse(localStorage.getItem('darkMode'))
    } else {
        darkModeButton.checked = false
    }
    if (darkModeButton.checked) {
        root.style.setProperty('--border', '#3a3a3c')
        root.style.setProperty('--title', '#d7dadc')
        root.style.setProperty('--text', '#121213')
        root.style.setProperty('--description', '#818384')
        root.style.setProperty('--icon', '#565758')
    }
    darkModeButton.addEventListener('click', () => {
        localStorage.setItem('darkMode', darkModeButton.checked)
        if (darkModeButton.checked) {
            root.style.setProperty('--border', '#3a3a3c')
            root.style.setProperty('--title', '#d7dadc')
            root.style.setProperty('--text', '#121213')
            root.style.setProperty('--description', '#818384')
            root.style.setProperty('--icon', '#565758')
        } else {
            root.style.setProperty('--border', '#d3d6da')
            root.style.setProperty('--title', '#1a1a1b')
            root.style.setProperty('--text', '#ffffff')
            root.style.setProperty('--description', '#787c7e')
            root.style.setProperty('--icon', '#878a8c')
        }
    })

    const colorBlindButton = document.getElementById('colorBlindMode')
    if (localStorage.getItem('colorBlindMode')) {
        colorBlindButton.checked = JSON.parse(localStorage.getItem('colorBlindMode'))
    } else {
        colorBlindButton.checked = false
    }
    if (colorBlindButton.checked) {
        const newColors = ['rgb(120, 124, 126)', 'rgb(133, 192, 249)', 'rgb(245, 121, 58)']
        for (let i = 0; i < guesses.length * 5; i++) {
            const square = document.getElementById(String(i + 1))
            square.style.backgroundColor = newColors[colors.indexOf(square.style.backgroundColor)]
        }
        colors = newColors
        root.style.setProperty('--checked', '#f5793a')
    }
    colorBlindButton.addEventListener('click', () => {
        localStorage.setItem('colorBlindMode', darkModeButton.checked)
        if (colorBlindButton.checked) {
            const newColors = ['rgb(120, 124, 126)', 'rgb(133, 192, 249)', 'rgb(245, 121, 58)']
            for (let i = 0; i < guesses.length * 5; i++) {
                const square = document.getElementById(String(i + 1))
                square.style.backgroundColor = newColors[colors.indexOf(square.style.backgroundColor)]
            }
            colors = newColors
            root.style.setProperty('--checked', '#f5793a')
        } else {
            const newColors = ['rgb(120, 124, 126)', 'rgb(201, 180, 88)', 'rgb(106, 170, 100)']
            for (let i = 0; i < guesses.length * 5; i++) {
                const square = document.getElementById(String(i + 1))
                square.style.backgroundColor = newColors[colors.indexOf(square.style.backgroundColor)]
            }
            colors = newColors
            root.style.setProperty('--checked', '#538d4e')
        }
    })
})