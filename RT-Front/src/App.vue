<script>
import userApi from './api/userApi.js'
import Login from './components/Login.vue'
import RegisterForm from './components/RegisterForm.vue'

export default {
  components: {},
  data() {
    return {
      user: {},
      users: [],
      userList: [],
      guesses: null,
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>

<template>
  <div class="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10">
    <h1 class="text-gray-500 ">
      Welcome to the new Rhum Tool
    </h1>
  </div>
</template>

<style scoped>
</style>
