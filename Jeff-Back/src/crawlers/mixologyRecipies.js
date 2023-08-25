const scraper = require("../scraper/mixologyRecipies");
const dayjs = require("dayjs");
const _ = require("lodash");
const neo4jSessionManager = require("../managers/neo4jSessionManager");


module.exports = {
    crawl: async () => {
        return await scraper.fetch()
            .then(async (data) => {
                const session = await neo4jSessionManager.getSession()
                const start = dayjs()
                console.log(`START ${start}`)
                console.log(`START Ingredients ${dayjs()}`)
                await session.run(
                    'MERGE (p:Platform {name: $name}) RETURN p',
                    {name: "MixologyRecipies"}
                )
                for (const ingredient of data.ingredients) {
                    await session.run(
                        `MERGE (i:Ingredient { 
                                name: $name
                            })   
                            ${ingredient.flavor ? " SET i.flavor = $flavor " : " "} 
                            ${ingredient.availability ? " SET i.availability = $availability  " : " "}  
                            ${ingredient.url_img ? " SET i.url_img = $url_img  " : " "}  
                            ${ingredient.description ? " SET i.description = $description  " : " "}    
                            MERGE (i)-[:OF]->(it:IngredientType {
                                name : $type,
                                url : $typeLink
                            })
                                `,
                        {
                            name: _.capitalize(ingredient.title),
                            url_img: ingredient.url_img,
                            flavor: ingredient.flavor,
                            availability: ingredient.availability,
                            description: ingredient.description,
                            type: ingredient.type,
                            typeLink: ingredient.typeLink
                        }
                    )
                }
                console.log(`END Ingredients ${dayjs()}`)
                console.log(`START Cocktails ${dayjs()}`)
                for (const recipe of data.cocktails) {
                    await session.run(
                        `
                                MATCH (p:Platform {name: $platform_name})
                                MERGE (c:Drink:Cocktail { 
                                    title: $title
                                }) 
                                MERGE (p)<-[:FROM]-(r:Recipe 
                                    ${recipe.url_img ? " {url_img: $url_img} " : " "} 
                                )-[:MAKE]->(c)
                                MERGE (i:Instruction {
                                    details:$notes
                                })
                                MERGE (i)-[:DESCRIBE]->(r)
                                `,
                        {
                            platform_name: "MixologyRecipies",
                            title: recipe.title.replace(/ Cocktail$/, '').replace(/\./, ''),
                            notes: recipe.notes.join("\n"),
                            url_img: recipe.url_img
                        }
                    )
                    for (const ingredient of recipe.ingredients) {
                        await session.run(
                            `
                                MATCH (p {name: $platform_name})<-[:FROM]-(r:Recipe)-[:MAKE]->(c:Drink:Cocktail { 
                                    title: $title
                                }) 
                                MATCH (i:Ingredient {name:$name })
                                MERGE (i)-[:IN ${ingredient.quantity ? "{quantity:$quantity}" : ""}]->(r)
                                `,
                            {
                                platform_name: "MixologyRecipies",
                                title: recipe.title,
                                name: _.capitalize(ingredient.name),
                                url_img: recipe.url_img,
                                quantity: ingredient.quantity
                            }
                        )
                    }
                }
                console.log(`END Cocktails ${dayjs()}`)
                console.log(`END ${dayjs()}`)
                console.log(`Time laps ${start.diff(dayjs(), 'seconds')}`)
                return null
            })
    }
}