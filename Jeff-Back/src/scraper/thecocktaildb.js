const axios = require('axios');
module.exports = {

    fetch: async () => {
        const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
        const map = {}
        for (const letter of letters) {
            map[letter] = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`)
                .then(({data}) => {
                    return data
                })
        }
        return map
    },
}
