const scraper = require('./scraper/mixologyRecipies')
const crawlerMR = require('./crawlers/mixologyRecipies')
const crawlerTDB = require('./crawlers/thecocktaildb')
const userManager = require('./managers/UserManager')
const cocktailManager = require('./managers/CocktailManager')
const rhumArrangeFr = require('./scraper/rhumArrangeFr')
const axios = require('axios')
/*
var Xray = require('x-ray')
var x = Xray()

x('https://www.mixology.recipes/cocktails?page=1', 'body > main > div > div > div.col-md-3.col-lg-3.col-xl-3.text-truncate', [
    {
        title: ' a',
        link: 'a@href'
    }
])
    .paginate('body > main > div.container > div.d-none.d-lg-block.mt-3 > nav > ul.pagination  > li.page-item > a[rel="next"]@href')
    .limit(99)
    .then(function(res) {
        console.log(res[0]) // prints first result
    })*/
/*user = {
    email: "gillesthedev@twitch.tv",
    firstName: "Gilles",
    lastName: "Bodart",
    dob: "14/04/1992",
}
userManager.createUser(user)*/

/*
axios.get(`https://www.mixology.recipes/cocktails?page=1`).then(value => {
    console.log(value)
})*/

async function mainRAF () {
  /* let cocktail = await cocktailManager.fetchCocktailByName("Mojito")
   console.log(cocktail)*/
  console.log('START')
  await rhumArrangeFr.fetch()
  console.log('END')
}
async function mainTDB () {
  /* let cocktail = await cocktailManager.fetchCocktailByName("Mojito")
   console.log(cocktail)*/
  console.log('START')
  await crawlerTDB.crawl()
  console.log('END')
}

async function mainMR () {
  /* let cocktail = await cocktailManager.fetchCocktailByName("Mojito")
   console.log(cocktail)*/
  console.log('START')
  await crawlerMR.crawl()
  console.log('END')
}

async function createUser () {
  const firstName = 'Gilles'
  const lastName = 'Bodart'
  const email = 'gillesbod@gmail.com'
  const dob = '14/04/1992'
  const user = {
    email: email,
    firstName: firstName,
    lastName: lastName,
    dob: dob,
  }
  console.log(await userManager.createUser(user))

}

async function like (email, recipeId) {
  const user = await userManager.fetchByEmail(email)
  await userManager.like(user.id, recipeId)
}

async function hate (email, recipeId) {
  const user = await userManager.fetchByEmail(email)
  await userManager.hate(user.id, recipeId)
}

async function statistics (userId) {
  return await userManager.statistics(userId)
}

async function getGuess (userList) {
  return await userManager.getGuess(userList)
}

//like("darkmoulus@hotmail.fr", 12651)
//like("darkmoulus@hotmail.fr", 3591 )
//like("darkmoulus@hotmail.fr", 3946 )
//like("Mister.Dlef@bar.fr", 3946 )
//hate("darkmoulus@hotmail.fr", 2740 )
//hate("Mister.Dlef@bar.fr", 2740 )
//statistics(163)
/* statistics(163).then(res => {
  console.log(res)
})
statistics(164).then(res => {
  console.log(res)
}) */
/*getGuess([163, 164]).then(res => {
  console.log(res)
})*/
mainRAF()

//jhondoe@email.com"
//Antoine.Lemoche@onem.com"
//darkmoulus@hotmail.fr"
