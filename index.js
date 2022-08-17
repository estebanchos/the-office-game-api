const express = require("express");
const app = express();
const cors = require('cors')
const PORT = 8080

const corsOptions = {
    origin: '*',
    optionSuccessStatus: 200
}

// Middleware
app.use(express.json())
app.use(cors(corsOptions))

const gameRoute = require('./routes/game')
app.use('/game', gameRoute)

app.get('/', (_req, res) => {
    res.send('server is running')
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});