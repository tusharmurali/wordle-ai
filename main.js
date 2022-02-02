document.addEventListener('DOMContentLoaded', async () => {
    createSquares()

    let guesses = [], hint = []
    const colors = ['rgb(120, 124, 126)', 'rgb(201, 180, 88)', 'rgb(106, 170, 100)']
    const changeColor = ({ target }) => {
        const index = (colors.indexOf(target.style.backgroundColor) + 1) % 3
        target.style.backgroundColor = colors[index]
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
                square.innerText = letters[i]
                square.classList.add('animate__bounceIn')
                square.style.backgroundColor = final ? '#6aaa64' : '#787c7e'
                square.style.borderColor = 'transparent'
                square.style.cursor = 'pointer'
                square.addEventListener('click', changeColor)
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

    document.querySelector('.button-row button').addEventListener('click', () => {
        // ONLY DO SOMETHING IF data OBJ HAS CHILDREN HINTS
        if (Object.keys(data.hints).length > 0) {
            const newData = data.hints[hint.join('')]
            if (newData) {
                data = newData
                addGuess(newData.guess, Object.keys(newData.hints).length === 0)
            } else {
                // NO MATCHING HINT
                // ERROR AND SHAKE
                alert('Invalid hint!')
            }
        } else {
            alert('Game finished!')
        }
        // !!!!!!AUTO DISPLAY GREEN IF THE OBJECT HAS NO HINTS!!!!!!!
    })
})