const fs = require('fs')

// Words are from the source code of https://www.powerlanguage.co.uk/wordle/
const wordles = JSON.parse(fs.readFileSync('wordles.json'))
const guesses = JSON.parse(fs.readFileSync('guesses.json'))
guesses.push(...wordles)

const secondTurn = JSON.parse(fs.readFileSync('second-turn.json'))

/*
Generates a hint given a guess for a wordle.

2 the letter is in the word and in the correct spot
1 the letter is in the word but in the wrong spot
0 the letter is not in the word in any spot
 */
function getHint(guess, wordle) {
    let hint = [0, 0, 0, 0, 0]
    let available = wordle
    for (let i = 0; i < guess.length; i++) {
        if (guess.charAt(i) === wordle.charAt(i)) {
            hint[i] = 2
            available = available.replace(guess.charAt(i), '')
        }
    }
    for (let i = 0; i < guess.length; i++) {
        if (hint[i] === 0 && available.includes(guess.charAt(i))) {
            hint[i] = 1
            available = available.replace(guess.charAt(i), '')
        }
    }
    return hint.join('')
}

/*
Filters the remaining possibilities for the wordle given a returned hint for a guess.
 */
function filter(possibilities, guess, hint) {
    return possibilities.filter(wordle => hint === getHint(guess, wordle))
}

/*
Gets the next guess of the AI given the remaining possibilities for the wordle.
 */
function getGuess(possibilities) {
    let bestGuess = possibilities[0], maxUniqueHints = 0, minSumSq = Infinity
    for (const guess of guesses) {
        let hintCounts = {}
        for (const wordle of possibilities) {
            const hint = getHint(guess, wordle)
            if (hintCounts[hint]) hintCounts[hint]++
            else hintCounts[hint] = 1
        }
        const uniqueHints = Object.keys(hintCounts).length
        const sumSq = Object.values(hintCounts).reduce((sum, count) => sum + (count - 1) * (count - 1), 0) - (hintCounts['22222'] << 2)
        if (uniqueHints > maxUniqueHints) {
            bestGuess = guess
            maxUniqueHints = uniqueHints
            minSumSq = sumSq
        } else if (uniqueHints === maxUniqueHints) {
            if (sumSq < minSumSq) {
                bestGuess = guess
                minSumSq = sumSq
            } else if (sumSq === minSumSq && !possibilities.includes(bestGuess) && possibilities.includes(guess)) {
                bestGuess = guess
            }
        }
    }
    return bestGuess
}


/*
Tests the AI on all wordles and writes the game tree to the ai.json file.
 */
function run() {
    let totalGuesses = 0, count = 1
    let distribution = {}, ai = { guess: '', hints: {} }
    for (const wordle of wordles) {
        console.log(count + ' / ' + wordles.length)
        console.log('WORDLE: ' + wordle)
        let possibilities = wordles
        let node = ai
        let guess, hint = ''
        for (let i = 0; i < 6; i++) {
            if (i === 0) {
                guess = 'salet'
                node.guess = guess
                node = node.hints
            } else {
                guess = i === 1 ? secondTurn[hint] : getGuess(possibilities)
                if (node[hint]) node[hint] = { guess, hints: node[hint].hints }
                else node[hint] = { guess, hints: {} }
                node = node[hint].hints
            }
            console.log('GUESS: ' + guess)

            hint = getHint(guess, wordle)
            if (hint === '22222') {
                console.log('Guessed in ' + (i + 1) + ' tries!')
                totalGuesses += i + 1
                if (distribution[i + 1]) distribution[i + 1]++
                else distribution[i + 1] = 1
                break
            }
            possibilities = filter(possibilities, guess, hint)
        }
        console.log('TOTAL: ' + totalGuesses)
        console.log('AVG: ' + totalGuesses / count++)
        console.log(distribution)
    }
    fs.writeFileSync('ai.json', JSON.stringify(ai))
}

run()