import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    tasks: [],
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_TASKS(state, tasks) {
      state.tasks = tasks
    },
  },
  actions: {
    async register({ dispatch }, user) {
      await axios.post(`${process.env.VUE_APP_API_URL}/auth/register`, user)
      await dispatch('login', user)
    },
    async login({ commit }, user) {
      const response = await axios.post(`${process.env.VUE_APP_API_URL}/auth/login`, user)
      const token = response.data.token
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = token
      commit('SET_TOKEN', token)
    },
    async logout({ commit }) {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      commit('SET_TOKEN', '')
    },
    async fetchTasks({ commit }) {
      const response = await axios.get(`${process.env.VUE_APP_API_URL}/tasks`)
      commit('SET_TASKS', response.data)
    },
    async addTask({ dispatch }, task) {
      await axios.post(`${process.env.VUE_APP_API_URL}/task`, task)
      await dispatch('fetchTasks')
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    tasks: (state) => state.tasks,
  },
})
