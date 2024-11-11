<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="title">Login</h2>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="user_name">Username</label>
          <input
            v-model="user_name"
            id="user_name"
            type="user_name"
            placeholder="Enter your username"
            required
          />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" class="login-btn">Login</button>
        <div class="register-link">
          <p>
            Don't have an account?
            <router-link to="/register">Register</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      user_name: '',
      password: '',
    }
  },
  methods: {
    async login() {
      try {
        const apiUrl = process.env.VUE_APP_API_URL
        const response = await axios.post(`${apiUrl}/auth/login`, {
          user_name: this.user_name,
          password: this.password,
        })
        // Assume the token is in response.data.token (or adjust based on your API)
        const token = response.data.token
        const username = this.user_name

        // Store the token in localStorage
        localStorage.setItem('authToken', token)
        localStorage.setItem('username', username)

        // Now, get the user_id by username
        const userIdResponse = await axios.post(
          `${apiUrl}/users/findUserId`,
          { user_name: this.user_name },
          { headers: { Authorization: `Bearer ${token}` } }, // Pass token for authorization if required
        )

        const { user_id } = userIdResponse.data

        // Store the user_id in localStorage
        localStorage.setItem('user_id', user_id)

        this.$router.push('/homepage') // Redirect to a dashboard or home after login
      } catch (error) {
        console.error(error.response?.data?.message || 'Login failed')
      }
    },
  },
}
</script>

<style scoped>
/* Container for the login form */

.login-container {
  /* margin: 0; */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  background: linear-gradient(to right, #4facfe, #00f2fe);
  padding: 0 20px;
}

.login-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

/* Title style */
.title {
  font-size: 2em;
  margin-bottom: 20px;
  color: #333;
}

/* Input fields styling */
.input-group {
  margin-bottom: 15px;
  text-align: left;
}

.input-group label {
  font-size: 0.9em;
  font-weight: bold;
  color: #555;
}

.input-group input {
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
}

.input-group input:focus {
  border-color: #4facfe;
  outline: none;
}

/* Submit button styling */
.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #4facfe;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
  cursor: pointer;
}

.login-btn:hover {
  background-color: #00f2fe;
}

/* Register link style */
.register-link {
  margin-top: 15px;
}

.register-link p {
  font-size: 0.9em;
  color: #555;
}

.register-link a {
  color: #4facfe;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
