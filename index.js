const express = require('express')
const app = express()
const ejs = require('ejs')
const expressSession = require('express-session')
const {createClient} = require('redis')
const RedisStore = require('connect-redis').default
const flash = require('connect-flash')

// MongoDB Connection
// mongoose.connect('mongodb+srv://ponchai2057:Junjao2057@cluster0.eqcz3yh.mongodb.net/?retryWrites=true&w=majority', {
//     useNewUrlParser: true
// })
let redisClient = createClient({
    url: process.env.REDIS_URL
})
redisClient.connect().catch(console.error)

let redisStore = new RedisStore({
    client: redisClient,
    prefix: "myapp:",
  })
global.loggedIn = null

// Controllers
const indexController = require('./controllers/indexController')
const loginController = require('./controllers/loginController')
const registerController = require('./controllers/registerController')
const storeUserController = require('./controllers/storeUserController')
const loginUserController = require('./controllers/loginUserController')
const logoutController = require('./controllers/logoutController')
const homeController = require('./controllers/homeController')
const stravaController = require('./controllers/stravaController')
const stravaConnectController = require('./controllers/stravaConnectController')
const stravaUpdateController = require('./controllers/stravaUpdateController')

// Middleware
const redirectIfAuth = require('./middleware/redirectIfAuth')
const authMiddleware = require('./middleware/authMiddleware')

app.set('trust proxy', 1)
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded())
app.use(flash())

app.use(expressSession({
    store: redisStore,
    secret: 'secret',
    saveUninitialized: true,
    resave: false
}))
app.use("*", async (req, res, next) => {
    loggedIn = req.session.userId;
    next()
})
app.set('view engine', 'ejs')

app.get('/', indexController)
app.get('/home', authMiddleware, homeController)
app.get('/login', redirectIfAuth, loginController)
app.get('/register', redirectIfAuth, registerController)
app.post('/user/register', redirectIfAuth, storeUserController)
app.post('/user/login', redirectIfAuth, loginUserController)
app.get('/logout', logoutController)
app.get('/strava', authMiddleware, stravaController)
app.get('/exchangetoken', authMiddleware, stravaConnectController)
app.get('/sync/data', authMiddleware, stravaUpdateController)

app.listen(4000, () => {
    console.log("App listening on port 4000")
})