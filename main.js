document.addEventListener('DOMContentLoaded', async () => {
    createSquares()

    let guesses = [], hint = []
    const colors = ['rgb(120, 124, 126)', 'rgb(201, 180, 88)', 'rgb(106, 170, 100)']
    const changeColor = ({ target }) => {
        const index = (colors.indexOf(target.style.backgroundColor) + 1) % 3
        target.setAttribute('data-animation', 'flip-in')
        target.addEventListener('animationend', () => {
            target.style.backgroundColor = colors[index]
            target.setAttribute('data-animation', 'flip-out')
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
                            if (square.getAttribute('data-animation') === 'flip-in')
                                square.setAttribute('data-animation', 'flip-out')
                            else
                                square.removeAttribute('data-animation')
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
            const newData = data.hints[hint.join('')]
            if (newData) {
                data = newData
                addGuess(newData.guess, Object.keys(newData.hints).length === 0)
            } else {
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

    const modal = document.getElementById('modal')
    const modalButton = document.getElementsByClassName('modal-button')[0]
    modalButton.addEventListener('click', () => {
        modal.style.display = 'block'
    })

    const close = document.getElementsByClassName('close')[1]
    close.addEventListener('click', () => {
        modal.style.display = 'none'
    })

})