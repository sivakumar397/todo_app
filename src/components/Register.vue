<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="register" class="register-form">
      <div class="form-group">
        <label for="user_name">Username</label>
        <input id="user_name" v-model="user_name" placeholder="Enter your username" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="email" placeholder="Enter your email" type="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          placeholder="Enter your password"
          type="password"
          required
        />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          placeholder="Confirm your password"
          type="password"
          required
        />
      </div>
      <button type="submit" class="submit-button">Register</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      user_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '', // To display validation or API errors
    }
  },
  methods: {
    async register() {
      // Client-side validation
      if (!this.user_name || !this.email || !this.password || !this.confirmPassword) {
        this.errorMessage = 'All fields are required'
        return
      }

      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match'
        return
      }

      try {
        // API request for registration
        const apiUrl = process.env.VUE_APP_API_URL // Fetch the base URL from the .env file
        await axios.post(`${apiUrl}/auth/register`, {
          user_name: this.user_name,
          email: this.email,
          password: this.password,
        })

        // Clear the form and error message, then redirect
        this.user_name = ''
        this.email = ''
        this.password = ''
        this.confirmPassword = ''
        this.errorMessage = ''
        this.$router.push('/login')
      } catch (error) {
        // Display API error
        console.log(error)
        this.errorMessage = error.response?.data?.message || 'An error occurred'
      }
    },
  },
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #f9f9f9;
  text-align: center;
}

.register-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.register-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.submit-button {
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #45a049;
}

.error {
  color: #ff0000;
  margin-top: 10px;
  font-size: 14px;
}
</style>
