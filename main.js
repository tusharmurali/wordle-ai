document.addEventListener('DOMContentLoaded', async () => {
    createSquares()

    let guesses = [], hint = []
    let colors = ['rgb(120, 124, 126)', 'rgb(201, 180, 88)', 'rgb(106, 170, 100)']
    const root = document.documentElement
    const darkModeButton = document.getElementById('darkMode')
    if (localStorage.getItem('darkMode')) {
        darkModeButton.checked = JSON.parse(localStorage.getItem('darkMode'))
    } else {
        darkModeButton.checked = false
    }
    if (darkModeButton.checked) {
        enableDarkMode()
    }
    darkModeButton.addEventListener('click', () => {
        localStorage.setItem('darkMode', darkModeButton.checked)
        if (darkModeButton.checked) {
            enableDarkMode()
        } else {
            disableDarkMode()
        }
    })

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
                        square.style.backgroundColor = colors[2]
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
                        square.style.backgroundColor = colors[0]
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

    const nextGuessButton = document.querySelectorAll('.button-row button')[1]
    nextGuessButton.addEventListener('click', () => {
        if (Object.keys(data.hints).length > 0) {
            const hintString = hint.join('')
            const newData = data.hints[hintString]
            if (newData) {
                data = newData
                addGuess(newData.guess, Object.keys(newData.hints).length === 0)
            } else if (hintString === '22222') {
                const prev = (guesses.length - 1) * 5 + 1
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => document.getElementById(String(prev + i)).setAttribute('data-animation', 'bounce'), i * 100)
                }
            } else{
                const prev = (guesses.length - 1) * 5 + 1
                for (let i = 0; i < 5; i++) {
                    document.getElementById(String(prev + i)).setAttribute('data-animation', 'shake')
                }
            }
        } else {
            const prev = (guesses.length - 1) * 5 + 1
            for (let i = 0; i < 5; i++) {
                setTimeout(() => document.getElementById(String(prev + i)).setAttribute('data-animation', 'bounce'), i * 100)
            }
        }
    })
    document.addEventListener('keydown', event => {
        if (event.key === "Enter")
            nextGuessButton.click()
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

    const colorBlindButton = document.getElementById('colorBlindMode')
    if (localStorage.getItem('colorBlindMode')) {
        colorBlindButton.checked = JSON.parse(localStorage.getItem('colorBlindMode'))
    } else {
        colorBlindButton.checked = false
    }
    if (colorBlindButton.checked) {
        enableColorBlindMode()
    }
    colorBlindButton.addEventListener('click', () => {
        localStorage.setItem('colorBlindMode', colorBlindButton.checked)
        if (colorBlindButton.checked) {
            enableColorBlindMode()
        } else {
            disableColorBlindMode()
        }
    })

    function enableDarkMode() {
        root.style.setProperty('--border', '#3a3a3c')
        root.style.setProperty('--title', '#d7dadc')
        root.style.setProperty('--text', '#121213')
        root.style.setProperty('--description', '#818384')
        root.style.setProperty('--icon', '#565758')
        if (colors[1] === 'rgb(133, 192, 249)')
            colors = setNewColors(['rgb(58, 58, 60)', colors[1], colors[2]])
        else
            colors = setNewColors(['rgb(58, 58, 60)', 'rgb(181, 159, 59)', 'rgb(83, 141, 78)'])
    }

    function disableDarkMode() {
        root.style.setProperty('--border', '#d3d6da')
        root.style.setProperty('--title', '#1a1a1b')
        root.style.setProperty('--text', '#ffffff')
        root.style.setProperty('--description', '#787c7e')
        root.style.setProperty('--icon', '#878a8c')
        if (colors[1] === 'rgb(133, 192, 249)')
            colors = setNewColors(['rgb(120, 124, 126)', colors[1], colors[2]])
        else
            colors = setNewColors(['rgb(120, 124, 126)', 'rgb(201, 180, 88)', 'rgb(106, 170, 100)'])
    }

    function enableColorBlindMode() {
        root.style.setProperty('--checked', '#f5793a')
        colors = setNewColors([colors[0], 'rgb(133, 192, 249)', 'rgb(245, 121, 58)'])
    }

    function disableColorBlindMode() {
        root.style.setProperty('--checked', '#538d4e')
        colors = setNewColors([colors[0], 'rgb(201, 180, 88)', 'rgb(106, 170, 100)'])
    }

    function setNewColors(newColors) {
        for (let i = 0; i < guesses.length * 5; i++) {
            const square = document.getElementById(String(i + 1))
            square.style.backgroundColor = newColors[colors.indexOf(square.style.backgroundColor)]
        }
        return newColors
    }
})