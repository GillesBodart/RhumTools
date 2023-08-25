const thecocktaildb = require("../scraper/thecocktaildb");
const dayjs = require("dayjs");
const _ = require("lodash");
const neo4jSessionManager = require("../managers/neo4jSessionManager");

module.exports = {
    crawl: async () => {
        return await thecocktaildb.fetch()
            .then(async (data) => {
                const session = await neo4jSessionManager.getSession()

                const start = dayjs()
                console.log(`START ${start}`)

                await session.run(
                    'MERGE (p:Platform {name: $name}) RETURN p',
                    {name: "TheCocktailDB"}
                )
                for (let letter in data) {
                    const drinks = data[letter].drinks
                    if (drinks) {
                        for (const drink of drinks) {
                            await session.run(
                                `
                                MATCH (p:Platform {name: $platform_name})
                                MERGE (c:Drink:Cocktail {
                                    external_id: $external_id,
                                    title: $title,
                                    ${drink.strDrinkAlternate ? "title_bis: $title_bis," : ""}
                                    ${drink.strIBA ? "strIBA: $strIBA," : ""}
                                    alcoholic: $alcoholic,
                                    glass: $glass,
                                    url_img: $url_img
                                })
                                MERGE (p)<-[:FROM]-(r:Recipe)-[:MAKE]->(c)
                                MERGE (i:Instruction {
                                    details:$i_details
                                })
                                MERGE (i)-[:DESCRIBE]->(r)
                                `,
                                {
                                    platform_name: "TheCocktailDB",
                                    external_id: drink.idDrink,
                                    title: drink.strDrink.replace(/ Cocktail$/, '').replace(/\./, ''),
                                    title_bis: drink.strDrinkAlternate,
                                    strIBA: drink.strIBA,
                                    alcoholic: drink.strAlcoholic,
                                    glass: drink.strGlass,
                                    i_details: drink.strInstructions,
                                    url_img: drink.strDrinkThumb
                                }
                            )
                            for (let i = 1; i < 16; i = i + 1) {
                                const ingr = drink["strIngredient" + i]
                                const mes = drink["strMeasure" + i]
                                if (ingr) {
                                    await session.run(
                                        `
                                MATCH (p {name: $platform_name})<-[:FROM]-(r:Recipe)-[:MAKE]->(c:Drink:Cocktail { 
                                    external_id: $external_id
                                })   
                                MERGE (i:Ingredient { name: $name })
                                MERGE (i)-[:IN ${mes ? "{quantity:$mes}" : ""}]->(r)
                                return p
                                `,
                                        {
                                            platform_name: "TheCocktailDB",
                                            external_id: drink.idDrink,
                                            name: _.capitalize(ingr),
                                            mes: mes
                                        }
                                    )
                                }

                            }
                        }
                    }
                }
                console.log(`END ${dayjs()}`)
                console.log(`Time laps ${start.diff(dayjs(), 'seconds')}`)
                return null
            })
    }
}