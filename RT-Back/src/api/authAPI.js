const express = require('express')
const router = express.Router()
const userManager = require('../managers/UserManager')
const bcrypt = require('bcrypt')

const saltRounds = 14

router.post('/login', async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  if (!email || !password) {
    res.send({ message: 'Bad request' }).status(400)
  } else {
    await userManager.fetchByEmail(email)
      .then(async (usr) => {
        await bcrypt.compare(password, usr.password, async (err, result) => {
          if (result) {
            req.session.loggedin = true
            req.session.username = usr.email
            req.session.id = usr.id
            res.send(usr).status(200)
          } else {
            res.send('Incorrect password').status(401)
          }
        })
      })
      .catch(e => {
        res.send(e).status(400)
      })
  }
}
)

router.post('/logout', (req, res) => {
  req.session.loggedin = false
  req.session.username = null
  req.session.destroy()
})
router.post('/register', async (req, res) => {
  const userDetails = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password
  }
  await bcrypt.hash(userDetails.password, saltRounds, async (err, hash) => {
    userDetails.password = hash
    await userManager.createUser(userDetails)
      .then((u) => {
        req.session.loggedin = true
        req.session.username = u.email
        req.session.id = u.id
        res.send(u).status(200)
      })
      .catch(e => {
        res.send(e).status(400)
      })
  })
})

module.exports = router
