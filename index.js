const express = require("express");
const app = express();
const cors = require('cors')
const gameRoute = require('./routes/game')

app.use(express.json())
app.use(cors())



app.listen(port, () => {
    console.log("Server is listening on port 8080");
});