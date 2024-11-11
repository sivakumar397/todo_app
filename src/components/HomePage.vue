<template>
  <div class="home-container">
    <!-- Welcome Message -->
    <div class="welcome-message">
      <p v-if="username">Welcome {{ username }}</p>
    </div>
    <!-- Navbar with Logout Button-->
    <div class="navbar">
      <button class="logout-btn" @click="logout">Logout</button>
    </div>
    <!-- Search Bar -->
    <div class="search-container">
      <input v-model="searchTerm" type="text" placeholder="Search tasks..." class="search-input" />

      <b-dropdown id="dropdown-1" text="Choose Status" class="m-md-2">
        <b-dropdown-item>Open</b-dropdown-item>
        <b-dropdown-item>InProgess</b-dropdown-item>
        <b-dropdown-item>Finished</b-dropdown-item>
      </b-dropdown>

      <b-dropdown id="dropdown-1" text="Choose Prority" class="m-md-2">
        <b-dropdown-item>Low</b-dropdown-item>
        <b-dropdown-item>Medium</b-dropdown-item>
        <b-dropdown-item>High</b-dropdown-item>
      </b-dropdown>

      <div class="button">
        <b-button variant="outline-dark" @click="showCreateForm = !showCreateForm"
          ><i class="fas fa-plus"></i> Create
        </b-button>

        <b-button variant="outline-dark" @click="showImportForm = !showImportForm"
          ><i class="fas fa-upload"></i>
          Import
        </b-button>
        <b-button variant="outline-dark" @click="showImportForm = !showImportForm"
          ><i class="fas fa-download"></i>
          Export
        </b-button>
      </div>
    </div>

    <!-- Create Task Button -->

    <!-- Create Task Form (Visible when showCreateForm is true) -->
    <transition name="fade-slide">
      <TaskForm v-if="showCreateForm" :user_id="userId" @task-created="addTaskToTable" />
    </transition>
    <!-- Import Task Section -->

    <!-- Import Form (Visible when showImportForm is true) -->
    <transition name="fade-slide">
      <div v-if="showImportForm" class="import-form">
        <h3>Import Task</h3>

        <!-- Download Sample File Button -->
        <button class="download-file-btn">
          <i class="fas fa-download"></i> Download Sample File
        </button>

        <!-- Upload File Button -->
        <div class="upload-file-container">
          <input
            type="file"
            id="upload-file"
            class="upload-file-input"
            @change="handleFileUpload"
          />
          <label for="upload-file" class="upload-file-btn">
            <i class="fas fa-upload"></i> Upload File
          </label>
        </div>

        <div class="form-buttons">
          <button @click="submitImport" class="submit-btn">Submit</button>
          <button @click="cancelImport" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </transition>

    <!-- Task List -->
    <div>
      <TaskList :tasks="tasks" @edit-task="editTask" @delete-task="deleteTask" />
    </div>
  </div>
</template>

<script>
import TaskForm from '@/components/TaskForm.vue' // Import the TaskForm component
import TaskList from '@/components/TaskList.vue' // Import the TaskForm component
import axios from 'axios'

export default {
  components: {
    TaskForm, // Register TaskForm as a local component
    TaskList,
  },
  data() {
    return {
      searchTerm: '',
      showCreateForm: false,
      showImportForm: false,
      taskName: '',
      description: '',
      priority: '',
      status: '',
      startDate: '',
      endDate: '',
      file: null,
      username: null, // To hold the username
      userId: null, // Set as null initially, will be loaded from localStorage
      tasks: [], // List of tasks fetched from the backend
    }
  },
  mounted() {
    // Retrieve username and user_id from localStorage when the component mounts
    this.username = localStorage.getItem('username')
    this.userId = localStorage.getItem('user_id')
    this.fetchTasks()
  },
  methods: {
    createTask() {
      // Handle task creation logic (e.g., send data to the backend)
      console.log('Task created:', {
        taskName: this.taskName,
        description: this.description,
        startDate: this.startDate,
        endDate: this.endDate,
      })
      // Reset form
      this.showCreateForm = false
      this.taskName = ''
      this.description = ''
      this.startDate = ''
      this.endDate = ''
    },
    cancelCreate() {
      // Reset form and close the task creation form
      this.showCreateForm = false
      this.taskName = ''
      this.description = ''
      this.startDate = ''
      this.endDate = ''
    },

    // Handle file upload
    handleFileUpload(event) {
      this.file = event.target.files[0]
      console.log('File uploaded:', this.file)
    },

    submitImport() {
      if (this.file) {
        console.log('File submitted:', this.file)
        // Handle the file upload logic (send it to backend or process here)
        this.showImportForm = false
      } else {
        alert('Please upload a file before submitting.')
      }
    },

    cancelImport() {
      // Reset file and hide the import form
      this.file = null
      this.showImportForm = false
    },
    async fetchTasks() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/task?user_id=${user_id}`)
        this.tasks = response.data
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    },
    addTaskToTable(task) {
      // Add the new task to the tasks array
      this.tasks.push(task)
      this.showCreateForm = false // Hide the create task form
    },

    logout() {
      // Clear authentication data (e.g., remove token from localStorage)
      localStorage.removeItem('authToken') // Adjust depending on how you're storing the token
      localStorage.removeItem('username')
      localStorage.removeItem('user_id')
      // Redirect to login page (assuming you're using Vue Router)
      this.$router.push('/login') // Ensure that you have a login route defined in Vue Router
    },
  },
}
</script>

<style scoped>
/* Navbar styles */

/* Search Bar styles */
.search-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.search-input {
  padding: 7px;
  width: 80%;
  background-color: #e5e7eb;
  max-width: 400px;
  outline: none;
  border-radius: 5px;
  border: 1px solid transparent;
  font-size: 1em;
}

/* Create Task Button styles */
.create-btn {
  display: block;
  background-color: #4facfe;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.create-btn:hover {
  background-color: #4facfe;
}

/* Import Task Section */
.import-btn {
  background-color: #ff6347;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  /* margin-top: 20px; */
  cursor: pointer;
}

.import-btn:hover {
  background-color: #ff4500;
}

.import-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* margin-top: 20px; */
  border: 1px solid #ddd;
  max-width: 500px;
  margin: 50px auto;
}

.import-form h3 {
  text-align: center;
  color: #333;
}

/* Download & Upload buttons */
.download-file-btn,
.upload-file-btn {
  display: flex;
  gap: 2rem;
  font-weight: bold;
  /* background-color: #4facfe; */
  border: 1px solid #ddd !important;
  color: rgb(22, 22, 22);
  padding: 10px 15px;
  border: none;

  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 15px;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.fade-slide-enter,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.download-file-btn {
  width: 100%;
}
.download-file-btn i,
.upload-file-btn i {
  margin-right: 2px;
}

.upload-file-container {
  position: relative;
  margin-bottom: 25px;
}
.download-file-input {
  width: 100%;
}
.upload-file-input {
  display: none;
}
.button {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.submit-btn,
.cancel-btn {
  padding: 10px 20px;
  border: none;
  margin-left: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.submit-btn {
  background-color: #4facfe;
  color: white;
}

.submit-btn:hover {
  background-color: #00f2fe;
}

.cancel-btn {
  background-color: #ccc;
  color: white;
}

.cancel-btn:hover {
  background-color: #aaa;
}

.task-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 20px auto;
}

.task-form h3 {
  text-align: center;
  font-size: 1.8em;
  color: #333;
  margin-bottom: 20px;
}

/* Input Group */
.input-group {
  margin-bottom: 15px;
  text-align: left;
}
.date-flex {
  display: flex;
  justify-content: flex-start;
  gap: 2rem;
  align-items: center;
}
.input-group label {
  display: block;
  font-size: 0.9em;
  font-weight: bold;
  color: #555;
  margin-bottom: 5px;
}

.input-group input[type='text'],
.input-group textarea,
.input-group input[type='date'] {
  width: 90%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  transition: border-color 0.3s;
}

.input-group input:focus,
.input-group textarea:focus,
.input-group input[type='date']:focus {
  border-color: #4facfe;
  outline: none;
}

/* Textarea Styling */
.input-group textarea {
  resize: vertical;
  min-height: 50px;
}

/* Form Buttons */
.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.save-btn,
.cancel-btn {
  flex: 1;
  padding: 10px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 0 5px;
}

/* Save Button */
.save-btn {
  background-color: #4facfe;
  color: white;
}

.save-btn:hover {
  background-color: #00f2fe;
}

/* Cancel Button */
.cancel-btn {
  background-color: #ccc;
  color: white;
}

.cancel-btn:hover {
  background-color: #aaa;
}

/* Logout Button */
.navbar {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}

.logout-btn {
  padding: 8px 16px;
  background-color: #f44336; /* Red color for logout */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #d32f2f;
}

/* Add styles for the welcome message */
.welcome-message {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px; /* Adjust space as needed */
  color: #28a745; /* Custom green color */
}
</style>
