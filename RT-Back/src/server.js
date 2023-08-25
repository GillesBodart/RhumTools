const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const session = require('express-session')

const SESSION_SECRET = process.env.SESSION_SECRET || '1fv65er1v91erv989er2v89rv2'

const app = express()

app.use(morgan('tiny'))
app.use(cors({
  origin: [
    'http://localhost:8080',
    'https://localhost:8080',
    'http://localhost:5173',
    'https://localhost:5173'
  ],
  credentials: true,
  exposedHeaders: ['set-cookie']
}))
app.use(session({
  secret: SESSION_SECRET,
  cookie: {
    maxAge: 60000 * 60,
    secure: false // true for https
  },
  saveUninitialized: false,
  resave: false,
  unset: 'destroy'
}))
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/users', require('./api/userAPI'))
app.use('/authentication', require('./api/authAPI'))

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
