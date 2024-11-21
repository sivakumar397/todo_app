<template>
  <div>
    <h1>Task List</h1>
    <table>
      <thead>
        <tr>
          <th>S.No</th>
          <th>Task Name</th>
          <th>Priority</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Status</th>
          <th>Settings</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task, index) in tasks" :key="task.task_id">
          <td>{{ index + 1 }}</td>
          <td>{{ task.task_name }}</td>
          <td>{{ task.priority }}</td>
          <td>{{ formatDate(task.start_date) }}</td>
          <td>{{ formatDate(task.end_date) }}</td>
          <td>{{ task.status }}</td>
          <td>
            <button @click="editTask(task.task_id)">Edit</button>
            <button @click="deleteTask(task.task_id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="tasks.length === 0">No tasks found.</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    tasks: {
      type: Array,
      required: true,
    },
  },
  /*data() {
    return {
      tasks: [], // Store tasks fetched from the API
    }
  },*/
  mounted() {
    this.fetchTasks()
  },
  methods: {
    async fetchTasks() {
      try {
        // Fetch tasks from API based on the user_id
        //const user_id = 10 // Assume this is dynamically retrieved or passed in
        const user_id = localStorage.getItem('user_id')
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/task?user_id=${user_id}`)
        console.log('responsess::', response)
        this.tasks = response.data
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    },
    formatDate(dateString) {
      // Format the date to a readable format (e.g., YYYY-MM-DD)
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    },
    editTask(taskId) {
      // Logic to edit the task (this can open a modal or redirect to another page)
      console.log(`Edit task with ID: ${taskId}`)
    },
    async deleteTask(taskId) {
      // Confirm before deleting
      if (confirm('Are you sure you want to delete this task?')) {
        try {
          // const response = await fetch(`${process.env.VUE_APP_API_URL}/task/${taskId}`, {
          //   method: 'DELETE',
          // })
          // await axios.delete(`${process.env.VUE_APP_API_URL}/task/${taskId}`)
          //alert('Task deleted successfully!')
          //this.fetchTasks() // Refresh the task list after deletion

          const response = await axios.delete(`${process.env.VUE_APP_API_URL}/task/${taskId}`)
          if (response.status === 200) {
            alert('Task deleted successfully!')
            this.fetchTasks() // Refresh task list after deletion
          } else {
            alert('Failed to delete task.')
          }
        } catch (error) {
          console.error('Error deleting task:', error)
        }
      }
    },
  },
}
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

button {
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
}
</style>
