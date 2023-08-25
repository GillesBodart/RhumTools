import {createStore, createLogger} from 'vuex'

import actions from './actions.js'
import mutations from './mutations.js'
import getters from './getters.js'

const debug = process.env.NODE_ENV !== 'production'

const state = {
    isAuthenticated: false,
    userProfiles: {
        email: null,
        firstName: null,
        lastName: null
    }
}

export default createStore({
    state,
    actions,
    mutations,
    getters,
    strict: debug,
    plugins: debug ? [createLogger()] : []
})
