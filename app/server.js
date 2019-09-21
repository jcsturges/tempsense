import express from 'express'
const app = express()

const APP_SRC = 'src'
const APP_PORT = 3000

app.use(express.static(APP_SRC))

console.log('starting up server...')
app.listen(APP_PORT, function () {
    console.log(` > server up, listening on port ${APP_PORT}`);
});
