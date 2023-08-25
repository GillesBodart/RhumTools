const neo4j = require('neo4j-driver')

const NEO4J_PWD = process.env.NEO4J_PWD || 'S3cr3t'
const NEO4J_USERNAME = process.env.NEO4J_USERNAME || 'neo4j'
const NEO4J_HOST = process.env.NEO4J_HOST || 'localhost'
const NEO4J_PORT = process.env.NEO4J_PORT || '7687'
const NEO4J_DB = process.env.NEO4J_DB || 'RT'
const NEO4J_PROTOCOL = process.env.NEO4J_DB || 'bolt'
const NEO4J_URL = `${NEO4J_PROTOCOL}://${NEO4J_HOST}:${NEO4J_PORT}`

const driver = neo4j.driver(NEO4J_URL, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PWD), { disableLosslessIntegers: true })

module.exports = {
  getSession: () => {
    return driver.session({
      database: NEO4J_DB
    })
  }
}
