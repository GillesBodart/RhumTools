const neo4jSessionManager = require("./neo4jSessionManager");
const neo4jCore = require("neo4j-driver-core");

const validate = (object, prop) => {
    if (!object[prop]) {
        throw `${prop} is required`;
    }
}

module.exports = {

    fetchCocktailByName: async (name) => {
        const session = neo4jSessionManager.getSession()
        let result = await session.run(
            `
            MATCH (c:Cocktail {title: $name})<-[:MAKE]-(r:Recipe)<-[rel:IN]-(i:Ingredient) 
            MATCH (r)-->(p:Platform)
            RETURN c,r,rel,i,p`, {
                name: name
            })
        if (result.records.length === 0) {
            throw "This cocktail doesn't exist"
        } else {
            let cocktailName = ""
            let cocktailId = 0
            const recipies = {}
            for (let path of result.records) {
                const cocktailNode = path._fields[0]
                cocktailName = cocktailNode.properties.title
                cocktailId = cocktailNode.identity
                const inRel = path._fields[2]
                const ingredientNode = path._fields[3]
                const platformNode = path._fields[4]
                if (!recipies[platformNode.properties.name]) {
                    recipies[platformNode.properties.name] = {ingredients: []}
                }
                recipies[platformNode.properties.name].ingredients.push({
                    name: ingredientNode.properties.name,
                    id: ingredientNode.identity,
                    quantity: inRel.properties.quantity
                })
            }
            const cocktail = {
                title: cocktailName,
                id: cocktailId,
                recipies: []
            }
            for (let recipe in recipies) {
                cocktail.recipies.push({Origin: recipe, ingredients: recipies[recipe]})
            }
            return cocktail
        }
        /**/
    },

    fetchCocktailById: async (id) => {
        const session = neo4jSessionManager.getSession()
        let result = await session.run(
            `
            MATCH (c:Cocktail)<-[:MAKE]-(r:Recipe)<-[rel:IN]-(i:Ingredient) 
            where id(c) = $id
            MATCH (r)-->(p:Platform)
            RETURN c,r,rel,i,p`, {
                id: id
            })
        if (result.records.length === 0) {
            throw "This cocktail doesn't exist"
        } else {
            let cocktailName = ""
            let cocktailId = 0
            const recipies = {}
            for (let path of result.records) {
                const cocktailNode = path._fields[0]
                cocktailName = cocktailNode.properties.title
                cocktailId = cocktailNode.identity
                const inRel = path._fields[2]
                const ingredientNode = path._fields[3]
                const platformNode = path._fields[4]
                if (!recipies[platformNode.properties.name]) {
                    recipies[platformNode.properties.name] = {ingredients: []}
                }
                recipies[platformNode.properties.name].ingredients.push({
                    name: ingredientNode.properties.name,
                    id: ingredientNode.identity,
                    quantity: inRel.properties.quantity
                })
            }
            const cocktail = {
                title: cocktailName,
                id: cocktailId,
                recipies: []
            }
            for (let recipe in recipies) {
                cocktail.push({Origin: recipe, ingredients: recipies[recipe]})
            }
            return cocktail
        }
        /**/
    }
}

