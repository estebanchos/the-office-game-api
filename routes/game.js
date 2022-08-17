const express = require('express');
const router = express.Router();
const fs = require('fs');
var uniqid = require('uniqid')

// read and parse initial file
const dataFile = fs.readFileSync('./data/source.json')
const data = JSON.parse(dataFile)
const dataArray = data.data
// create unique charactes array
const characters = dataArray.map(quote => {
    const name = quote.character.firstname + ' ' + quote.character.lastname
    return name
})
const uniqueChars = [... new Set(characters)]

// shuffle any array
function shuffle(array) {
    return array.sort(() => 0.5 - Math.random())
}

// get new character
function newChars(correctChar) {
    const shuffledChars = shuffle(uniqueChars)
    const filteredChars = shuffledChars.filter(char => char !== correctChar)
    const selectedChars = filteredChars.slice(0, 3)
    return selectedChars
}

// score counter
let score = 0

// ******* ROUTES *******

// send initial questions
router.route('/start')
    .get((_req, res) => {
        const shuffledQuestions = shuffle(dataArray)
        const selectedQuestions = shuffledQuestions.slice(0, 5)
        const gameQuestions = selectedQuestions.map(question => {
            const name = question.character.firstname + ' ' + question.character.lastname
            const questionChars = newChars(name)
            questionChars.push(name)
            return (
                {
                    id: question.id,
                    quote: question.content,
                    options: shuffle(questionChars),
                    answer: name
                }
            )
        })

        const gameQuestionsClient = gameQuestions.map(question => {
            return ({
                id: question.id,
                quote: question.quote,
                options: question.options
            })
        })
        fs.writeFileSync('./data/currentGame.json', JSON.stringify(gameQuestions))
        res.status(201).send(gameQuestionsClient)
    })

// check answer
router.route('/check:id')
    .post((req, res) => {
        const answer = req.body.answer
        const timer = req.body.timer
        const questionId = req.params.id
        const questionsFile = fs.readFileSync('./data/currentGame.json')
        const questionsData = JSON.parse(questionsFile)
        let found = questionsData.find(question => question.id === questionId)
        if (found.answer === answer) {
            score += timer / 2
        }
        res.status(201).send(`${score}`)
    })

// save to leaderboard
router.route('/leaderboard')
    .post((req, res) => {
        const name = req.body.name
        const score = req.body.score
        const leaderFile = fs.readFileSync('./data/leaderboard.json')
        const leaderboard = JSON.parse(leaderFile)
        let leaderId = uniqid()
        let newRanking = [...leaderboard]
        newRanking.push({
            id: leaderId,
            name: name,
            score: score
        })
        newRanking.sort((a, b) => b.score - a.score)
        fs.writeFileSync('./data/leaderboard.json', JSON.stringify(newRanking))
        let position = newRanking.findIndex(leader => leader.id === leaderId) + 1
        res.status(201).send(JSON.stringify(position))
    })

    // get leaderboard data
router.route('/leaderboard')
    .get((_req, res) => {
        const leaderFile = fs.readFileSync('./data/leaderboard.json')
        const leaderboard = JSON.parse(leaderFile)
        res.status(201).send(JSON.stringify(leaderboard))
    })
module.exports = router