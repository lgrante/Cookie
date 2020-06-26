/**
 * @note First we connect to the mongodb base.
 */
const mongoose = require('mongoose')
const serverConsole = require('./utils/serverConsole')
const dbConfig = require('./config/mongo')
const mongoAuth = dbConfig.auth

mongoose
    .connect('mongodb://' + mongoAuth.user + ':' + mongoAuth.pwd + '@' + dbConfig.addr + '/admin', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: mongoAuth.user,
        pass: mongoAuth.pwd,
        dbName: dbConfig.dbName
    })
    .then(() => serverConsole.log('Connected to MongoDB database.'))
    .catch(err => serverConsole.error(err.stack))

mongoose.set('useFindAndModify', false);

/**
 * @note Then we create the express api and use all the routes.
 */
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 5000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})
app.use('/cookie-api/ingredients', require('./routes/ingredients'))
app.use('/cookie-api/fridges', require('./routes/fridges'))
app.listen(port, () => serverConsole.log('Server running on port ' + port + '...'))