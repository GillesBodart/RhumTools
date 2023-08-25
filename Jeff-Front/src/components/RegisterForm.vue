<template>
  <form class="w-full max-w-lg">
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
          First Name
        </label>
        <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            id="grid-first-name" type="text" placeholder="Jane" v-model="registerForm.firstName">
        <!--        <p class="text-red-500 text-xs italic">Please fill out this field.</p>-->
      </div>
      <div class="w-full md:w-1/2 px-3">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
          Last Name
        </label>
        <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-last-name" type="text" placeholder="Doe" v-model="registerForm.lastName">
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-Email">
          Email
        </label>
        <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-Email" type="email" placeholder="your@email.com" v-model="registerForm.email">
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
          Password
        </label>
        <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-password" type="password" placeholder="******************" v-model="registerForm.password">
        <p class="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
      </div>
    </div>
    <div class="flex items-center justify-between">
      <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button" @click="register">
        Register
      </button>
    </div>
  </form>
</template>

<script>
import authApi from '../api/authApi.js'

export default {
  name: "RegisterForm",
  data() {
    return {
      registerForm: {
        email: "",
        password: "",
        firstName: "",
        lastName: ""
      },
    }
  },
  methods: {
    register() {
      const userRegister = {
        email: this.registerForm.email,
        password: this.registerForm.password,
        firstName: this.registerForm.firstName,
        lastName: this.registerForm.lastName
      }
      console.log(userRegister)
      authApi.register(userRegister)
    }
  }
}
</script>

<style scoped>

</style>
