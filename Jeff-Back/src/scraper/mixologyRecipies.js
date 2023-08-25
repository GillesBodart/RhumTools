const Xray = require('x-ray')

const START_PAGES = 1
const MAX_PAGES = 99

// Profile N4ms => bon-appetit-cocktail !! grenadine+++ alcool ---
const ingredient_set = {}

module.exports = {

    fetch: async (startPage = START_PAGES, maxPage = MAX_PAGES) => {
        const x = Xray({
            filters: {
                trim: function (value) {
                    return typeof value === 'string' ? value.trim() : value
                }, slice: function (value, start, end) {
                    return typeof value === 'string' ? value.slice(start, end) : value
                }
            }
        })
        const cocktails = await x(`https://www.mixology.recipes/cocktails?page=${startPage}`, 'body > main > div > div > div.col-md-3.col-lg-3.col-xl-3.text-truncate', [{
            title: 'a', link: 'a@href'
        }])
            .paginate('body > main > div.container > div.d-none.d-lg-block.mt-3 > nav > ul.pagination  > li.page-item > a[rel="next"]@href')
            .limit(maxPage)
            .then(async (cocktails) => {
                    data_cocktails = []
                    data_ingredients = []
                    for (const cocktail of cocktails) {
                        data_cocktails.push(await x(cocktail["link"], '.recipe ', {
                            title: '.recipe_title | trim',
                            url_img: '.card-img-top img@src',
                            ingredients: x('.cocktail-recipe-measure', [{
                                name: "a | trim",
                                quantity: "span.cocktail-recipe-alt-unit",
                                link: 'a@href',
                            }]),
                            notes: [".cocktail-recipe-direction"]
                        })
                            .then(async (res) => {
                                return await res
                            }))
                    }
                    for (let cocktail of data_cocktails) {
                        for (let ingredient of cocktail.ingredients) {
                            if (!ingredient_set[ingredient.name]) {
                                data_ingredients.push(
                                    await x(ingredient["link"], '.card-body ', {
                                        title: ".card-title | trim",
                                        url_img: ".front_image@src",
                                        type: "p:nth-child(5) a",
                                        typeLink: "p:nth-child(5) a@href",
                                        flavor: "p:nth-child(9)",
                                        availability: "p:nth-child(11)",
                                        description: "p:nth-child(7)"
                                    })
                                        .then(async (res) => {
                                            return await res
                                        }))
                                ingredient_set[ingredient.name] = true
                            }
                        }
                    }
                    return {
                        cocktails: data_cocktails, ingredients: data_ingredients
                    }
                }
            )
        return cocktails
    },
}
/*
details: await x(ingredients.link)[{

                                            }]
 */