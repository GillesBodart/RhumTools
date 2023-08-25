<script>

export default {
  data() {
    return {
      loginForm: {
        email: "",
        password: ""
      },
      userInfo: {}
    }
  },
  computed: {
    loggedIn: function () {
      return this.$store.getters.isLoggedIn
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout")
    },
    login() {
      this.$store.dispatch("login", this.loginForm)
    }
  },
  mounted() {

  }
}
</script>

<template>
  <div class="w-full max-w-xs">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
          Username
        </label>
        <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username" type="email"
            v-model="loginForm.email"
            placeholder="Username">
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
          Password
        </label>
        <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password" type="password" v-model="loginForm.password" placeholder="******************">

      </div>
      <div class="flex items-center justify-between">
        <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button" @click="login">
          Sign In
        </button>
        <button
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button" @click="logout" v-if="this.loggedIn">
          Sign Off
        </button>
        <p v-if="loggedIn" class="text-green-500 text-xs italic"> Loggin Success welcome {{ userInfo }}</p>
        <!--        <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                  Forgot Password?
                </a>-->
      </div>
    </form>
  </div>
</template>

<style scoped>
</style>
