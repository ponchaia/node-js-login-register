const express = require('express')
const app = express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const session = require('express-session')
const {createClient} = require('redis')
const RedisStore = require('connect-redis').default
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

// MongoDB Connection
mongoose.connect('mongodb+srv://ponchai2057:Junjao2057@cluster0.eqcz3yh.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true
}).then(() => console.log('mongoose connection successfully!'))
.catch((err) => console.error(err))

let redisClient = createClient({
    url: process.env.REDIS_URL
})
redisClient.connect().catch(console.error)
redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});
let redisStore = new RedisStore({
    client: redisClient,
    prefix: "myapp:",
  })
//Configure session middleware


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

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded())
app.set('trust proxy', 1)
app.use(flash())
app.use(cookieParser('node secret'));
app.use(session({
    store: redisStore,
    secret: 'node secret',
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie 
        maxAge: 1000 * 60 * 10, // session max age in miliseconds
        sameSite: true
    }
}))
app.use("*", async (req, res, next) => {    
    if (req.cookies.nodeToken) {        
        const decodeToken = jwt.verify(req.cookies.nodeToken, process.env.JWT_SECRET_KEY);
        if (decodeToken.id){
            loggedIn = decodeToken.id;
        } else {
            loggedIn = null
        }
    } else {
        loggedIn = null
    }
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