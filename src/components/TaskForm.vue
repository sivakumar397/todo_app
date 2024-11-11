<template>
  <div class="task-form">
    <h3>Create New Task</h3>
    <form @submit.prevent="submitTask">
      <div class="form-group">
        <label for="task_name">Task Name:</label>
        <input type="text" id="task_name" v-model="task.task_name" class="form-control" required />
      </div>

      <div class="form-group">
        <label for="description">Description:</label>
        <textarea
          id="description"
          v-model="task.description"
          class="form-control"
          rows="3"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="priority">Priority:</label>
        <select id="priority" v-model="task.priority" class="form-control" required>
          <option value="HIGHEST">Highest</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      <div class="form-group">
        <label for="status">Status:</label>
        <select id="status" v-model="task.status" class="form-control" required>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <div class="form-group">
        <label for="start_date">Start Date:</label>
        <input
          type="date"
          id="start_date"
          v-model="task.start_date"
          class="form-control"
          required
        />
      </div>

      <div class="form-group">
        <label for="end_date">End Date:</label>
        <input type="date" id="end_date" v-model="task.end_date" class="form-control" required />
      </div>

      <button type="submit" class="btn btn-primary">Add Task</button>
    </form>

    <div v-if="responseMessage" class="alert alert-success mt-3">
      {{ responseMessage }}
    </div>

    <div v-if="errorMessage" class="alert alert-danger mt-3">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    user_id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      task: {
        user_id: '',
        task_name: '',
        description: '',
        priority: '',
        status: '',
        start_date: '',
        end_date: '',
      },
      responseMessage: '',
      errorMessage: '',
    }
  },
  methods: {
    async submitTask() {
      try {
        // Add user_id to the task object before sending the request
        const taskData = { ...this.task, user_id: this.user_id }
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/task`, taskData)
        if (response.status === 201) {
          // Emit event with the new task data after successful creation
          this.$emit('task-created', response.data.task)
        } else {
          alert('Failed to create task.')
        }
        this.responseMessage = response.data.message
        this.errorMessage = ''
      } catch (error) {
        this.errorMessage = error.response
          ? error.response.data.message
          : 'An error occurred while adding the task.'
        this.responseMessage = ''
      }
    },
  },
}
</script>

<style scoped>
.task-form {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}
</style>
