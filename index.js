const express = require("express");
const app = express();
const cors = require('cors')

// Middleware
app.use(express.json())
app.use(cors())

const gameRoute = require('./routes/game')
app.use('/game', gameRoute)

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});