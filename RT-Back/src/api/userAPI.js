const express = require('express')
const router = express.Router()
const userManager = require('../managers/UserManager')

const checkSecured = (req, res) => {
  console.log(req.session)
  if (!req.session.loggedin) {
    res.send({ message: 'Unauthorized' }).status(401)
  }
  return req.session.loggedin
}

router.get('/me', (req, res) => {
  if (checkSecured(req, res)) {
    userManager.fetchById(req.session.id)
      .then((usr) => {
        res.send(usr).status(200)
      })
      .catch(e => {
        res.send(e).status(400)
      })
  }
})
router.get('/', async (req, res) => {
  if (checkSecured(req, res)) {
    await userManager.fetchAll()
      .then((usrs) => {
        res.send(usrs).status(200)
      })
      .catch(e => {
        res.send(e).status(400)
      })
  }
})

router.get('/:id', (req, res) => {
  if (checkSecured(req, res)) {
    userManager.fetchById(parseInt(req.params.id))
      .then((usr) => {
        res.send(usr).status(200)
      })
      .catch(e => {
        res.send(e).status(400)
      })
  }
})

router.get('/me/statistics', async (req, res) => {
  if (checkSecured(req, res)) {
    await userManager.fetchById(req.session.id)
      .then(async (usr) => {
        console.log(usr)
        const stat = await userManager.statistics(usr.id)
        console.log(stat)
        res.send(stat).status(200)
      })
      .catch(e => {
        res.send(e).status(400)
      })
  }
})

router.get('/:id/statistics', async (req, res) => {
  if (checkSecured(req, res)) {
    await userManager.fetchById(parseInt(req.params.id))
      .then(async (usr) => {
        console.log(usr)
        const stat = await userManager.statistics(usr.id)
        console.log(stat)
        res.send(stat).status(200)
      })
      .catch(e => {
        res.send(e).status(400)
      })
  }
})

router.post('/profiler/guess', async (req, res) => {
  if (checkSecured(req, res)) {
    await userManager.getGuess(req.body.users)
      .then(async (guesses) => {
        console.log(guesses)
        res.send(guesses).status(200)
      })
      .catch(e => {
        res.send(e).status(400)
      })
  }
})

module.exports = router
