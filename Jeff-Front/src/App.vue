<script>
import userApi from './api/userApi.js'
import Login from './components/Login.vue'
import RegisterForm from './components/RegisterForm.vue'

export default {
  components: {Login, RegisterForm},
  data() {
    return {
      user: {},
      users: [],
      userList: [],
      guesses: null,
    }
  },
  methods: {
    refresh() {
      userApi.fetchUserinfo()
          .then(({data}) => {
            this.user = data
          })
      userApi.fetchAllUsers()
          .then(({data}) => {
            this.users = data
          })
    },
    makeGuess() {
      userApi.makeGuess(this.userList).then(({data}) => {
        this.guesses = data
      })
    }
  },
  mounted() {
  }
}
</script>

<template>
  <Login></Login>
  <RegisterForm></RegisterForm>
  <button @click="refresh"> refresh</button>
  <div class="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10">
    <h1 class="text-gray-500 ">
      Hello Jeff who's in ?
    </h1>
    <p>{{ user }}</p>
    <p>selected {{ userList }}</p>
  </div>
  <div class="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10">
    <div v-for="usr in users">
      <input type="checkbox" :value="usr.id" :id="'checkbox-'+usr.id" v-model="userList"><span>{{ usr.id }}</span>
      <span>{{
          usr.lastName
        }} {{ usr.firstName }}</span>
    </div>
    <button @click="makeGuess" v-if="userList.length > 1"> Get score</button>
  </div>
  <table v-if="guesses" class="table-auto">
    <thead>
    <tr>
      <td> Ingredient</td>
      <td>Score</td>
    </tr>
    </thead>
    <tbody>
    <tr v-for="[key,value] of Object.entries(guesses)">
      <td> {{ key }}</td>
      <td>{{ value }}</td>
    </tr>
    </tbody>

  </table>
</template>

<style scoped>
</style>
