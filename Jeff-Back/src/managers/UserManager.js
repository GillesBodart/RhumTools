const neo4jSessionManager = require('./neo4jSessionManager')

const validate = (object, prop) => {
    if (!object[prop]) {
        throw `${prop} is required`
    }
}

const _rate = async (userId, recipeId, score) => {

    const _like = score > 0 ? 1 : score === 0 ? 0 : -1

    const session = neo4jSessionManager.getSession()
    await session.run(` MATCH (u)
                        where ID(u) = $userId
                    MATCH (r)
                        where ID(r) = $recipeId
                    MERGE  (u)-[:KNOW {rate:$score}]->(r)`, {
        userId, recipeId, score: _like
    })
}

const createUser = async (userDetails) => {
    validate(userDetails, 'email')
    validate(userDetails, 'firstName')
    validate(userDetails, 'lastName')
    validate(userDetails, 'password')
    const session = neo4jSessionManager.getSession()
    const result = await session.run(`MATCH (u:User { email: $email  }) RETURN u`, {
        email: userDetails.email
    })
    if (result.records.length > 0) {
        throw 'User Already created'
    } else {
        await session.run(` MERGE (u:User {
                    email: $email,
                    firstName: $firstName,
                    lastName: $lastName,
                    password: $password
                })
                `, {
            email: userDetails.email,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            dob: userDetails.dob,
            password: userDetails.password
        })
    }
}
const fetchById = async (userId) => {
    const session = neo4jSessionManager.getSession()
    const result = await session.run(`MATCH (u:User) where ID(u) = $id RETURN u`, {
        id: userId
    })
    const userNode = result.records[0]._fields[0]
    return {
        id: userNode.identity,
        email: userNode.properties.email,
        firstName: userNode.properties.firstName,
        lastName: userNode.properties.lastName,
        dob: userNode.properties.dob
    }
}
const fetchAll = async () => {
    const session = neo4jSessionManager.getSession()
    const result = await session.run(`MATCH (u:User) RETURN u`, {})
    const users = []
    for (const record of result.records) {
        const userNode = record._fields[0]
        users.push({
            id: userNode.identity,
            email: userNode.properties.email,
            firstName: userNode.properties.firstName,
            lastName: userNode.properties.lastName
        })
    }
    return users
}
const fetchByEmail = async (email) => {
    const session = neo4jSessionManager.getSession()
    const result = await session.run(`MATCH (u:User { email: $email }) RETURN u`, {
        email: email
    })
    const userNode = result.records[0]._fields[0]
    return {
        id: userNode.identity,
        email: userNode.properties.email,
        firstName: userNode.properties.firstName,
        lastName: userNode.properties.lastName,
        password: userNode.properties.password
    }
}
const like = async (userId, cocktailId) => {
    return await _rate(userId, cocktailId, 1)
}

const hate = async (userId, cocktailId) => {
    return await _rate(userId, cocktailId, -1)
}

const know = async (userId, cocktailId) => {
    return await _rate(userId, cocktailId, 0)

}

const getGuess = async (userIdList) => {
    const ingredientMatrix = {}
    const statDict = {}
    for (const userId of userIdList) {
        const stat = await statistics(userId)
        const scoreDict = {}
        for (const item of stat) {
            scoreDict[item.name] = item.score
        }
        statDict[userId] = scoreDict
    }
    for (const user in statDict) {
        for (const ingredient in user) {
            const keys = new Set(Object.values(statDict).map(r => Object.keys(r)).flat())
            for (const key of keys) {
                ingredientMatrix[key] = Object.values(statDict)
                    .map(r => r[key])
                    .filter(Boolean)
                    .reduce((a, b) => a + b, 0)
            }
        }
    }
    return ingredientMatrix
}

const statistics = async (userId) => {
    const session = neo4jSessionManager.getSession()
    const res = await session.run(`
                match (u:User)-[karl:KNOW]->(r:Recipe)<--(i:Ingredient)
                where id(u) = $userId
                with i.name as ingredientName, sum(karl.rate) as replicate, id(i) as ingredientId
                return {name:ingredientName, score:replicate, id:ingredientId } as result
                order by result.score desc
                `, {
        userId
    })
    const stats = []
    for (const record of res.records) {
        stats.push(record._fields[0])
    }
    return stats
}

module.exports = {
    createUser, fetchById, fetchByEmail, like, hate, know, fetchAll, getGuess, statistics
}

