<template>
  <div :class="{ dark: isDarkMode }">
    <!-- Welcome Message -->
    <div class="welcome-message">
      <p v-if="username">Welcome {{ username }}</p>
    </div>
    <!-- Navbar with Logout Button-->
    <div class="navbar">
      <!-- Display Weather and Location -->
      <div v-if="weather" class="weather-info">
        <p class="first-paragraph">{{ location }}</p>
        <p class="second-paragraph">{{ weather.temp }}°C, {{ weather.description }}</p>
      </div>
      <!-- Conditional Rendering of Weather Animations -->
      <div
        v-if="weather && weather.description && weather.description.includes('rain')"
        class="rain"
      >
        <div
          v-for="i in 50"
          :key="i"
          class="raindrop"
          :style="{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 1}s` }"
        ></div>
      </div>
      <div
        v-if="weather && weather.description && weather.description.includes('snow')"
        class="snow"
      >
        <div
          v-for="i in 50"
          :key="i"
          class="snowflake"
          :style="{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s` }"
        ></div>
      </div>

      <div
        v-if="
          (weather && weather.description && weather.description.includes('clear')) ||
          (weather && weather.description && weather.description.includes('sunny'))
        "
        class="sunny"
      >
        <div class="sunbeam"></div>
      </div>

      <div
        v-if="weather && weather.description && weather.description.includes('clouds')"
        class="clouds"
      >
        <div class="cloud"></div>
        <div class="cloud"></div>
        <div class="cloud"></div>
      </div>

      <div
        v-if="weather && weather.description && weather.description.includes('thunderstorm')"
        class="thunderstorm"
      >
        <div class="lightning"></div>
        <div class="cloud"></div>
      </div>

      <!-- Display Current Date and Time -->
      <div class="date-time">{{ formattedDateTime }}</div>
      <!-- Dark Mode Toggle Button -->
      <button @click="toggleDarkMode" class="toggle-button">
        <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
      </button>
      <!-- Logout Button -->
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

        <b-button variant="outline-dark" @click="triggerFileUpload">
          <i class="fas fa-upload"></i> Import
        </b-button>
        <!-- Hidden file input triggered by button -->
        <input type="file" ref="fileInput" style="display: none" @change="handleImportTask" />
        <b-button variant="outline-dark" @click="exportTasksToCSV"
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
      isDarkMode: false,
      formattedDateTime: '', // For displaying current date and time
      dateTimeInterval: null, // To store the interval ID for clearing later
      location: 'Loading...', // Placeholder for location
      weather: null, // Object to hold weather data
    }
  },

  mounted() {
    // Fetch location and weather data
    this.getUserLocation()
    // Initialize the formattedDateTime and set interval to update it every second
    this.updateDateTime()
    this.dateTimeInterval = setInterval(this.updateDateTime, 1000)
    // Retrieve username and user_id from localStorage when the component mounts
    this.username = localStorage.getItem('username')
    this.userId = localStorage.getItem('user_id')
    this.fetchTasks()
    this.isDarkMode = JSON.parse(localStorage.getItem('isDarkMode')) || false
    //this.exportTasksToCSV()
    //this.submitImport()
  },
  beforeUnmount() {
    // Clear the interval when component is destroyed
    if (this.dateTimeInterval) {
      clearInterval(this.dateTimeInterval)
    }
  },
  methods: {
    updateDateTime() {
      // Format the current date and time in IST
      const options = {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short', // Short month (e.g., NOV)
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true, // 12-hour format with AM/PM
      }

      const dateTime = new Intl.DateTimeFormat('en-IN', options).formatToParts(new Date())

      // Extract parts and manually format the string
      const day = dateTime.find((part) => part.type === 'day').value
      const month = dateTime.find((part) => part.type === 'month').value.toUpperCase() // Uppercase for short month
      const year = dateTime.find((part) => part.type === 'year').value
      const hour = dateTime.find((part) => part.type === 'hour').value
      const minute = dateTime.find((part) => part.type === 'minute').value
      const second = dateTime.find((part) => part.type === 'second').value
      const ampm = dateTime.find((part) => part.type === 'dayPeriod').value.toUpperCase() // "AM" or "PM"

      this.formattedDateTime = `${day}-${month}-${year} ${hour}:${minute}:${second} ${ampm}`
    },
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
        alert('Please upload a file before submitting22.')
      }
    },

    cancelImport() {
      // Reset file and hide the import form
      this.file = null
      this.showImportForm = false
    },
    async fetchTasks() {
      try {
        const user_id = localStorage.getItem('user_id')
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/task?user_id=${user_id}`)
        // Check if response contains data
        console.log('Response from API:', response)

        if (response.data && Array.isArray(response.data)) {
          this.tasks = response.data
          console.log('Tasks successfully fetched and assigned:', this.tasks)
        } else {
          console.warn('Unexpected data format or no tasks found in response:', response.data)
        }
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    },
    addTaskToTable(task) {
      // Add the new task to the tasks array
      this.tasks.push(task)
      this.showCreateForm = false // Hide the create task form
    },
    triggerFileUpload() {
      this.$refs.fileInput.click()
    },
    async handleImportTask(event) {
      this.file = event.target.files[0] // Assign the file directly
      if (this.file) {
        const fileType = this.file.type

        try {
          if (fileType === 'application/json') {
            // JSON import
            const tasks = await this.parseJSONFile(this.file)
            this.tasks.push(...tasks)
          } else if (fileType === 'text/csv') {
            // CSV import
            const tasks = await this.parseCSVFile(this.file)
            // Send parsed tasks to backend
            const response = await axios.post(`${process.env.VUE_APP_API_URL}/task/bulk_add`, {
              user_id: this.userId,
              tasks: tasks,
            })

            // Check if tasks were successfully added
            if (response.data) {
              this.fetchTasks() // Refresh the task list after bulk create
              window.location.reload()
              // this.tasks.push(...response.data) // Append new tasks to the tasks array
              console.log('Tasks successfully added in bulk:', response.data)
            } else {
              console.warn('Unexpected response from bulk add:', response.data)
            }

            // this.tasks.push(...tasks)
          } else {
            alert('Unsupported file format. Please upload a JSON or CSV file.')
          }

          // Clear the import form and file after upload
          this.showImportForm = false
          this.file = null
        } catch (error) {
          console.error('Error importing tasks:', error)
          alert('Error importing tasks. Please check the file format.')
        }
      } else {
        alert('Please upload a file before submitting11.')
      }
    },

    // Helper method to parse JSON files
    async parseJSONFile(file) {
      const text = await file.text()
      const data = JSON.parse(text)

      // Ensure each item matches task structure
      return data.map((task) => ({
        task_id: task.task_id,
        task_name: task.task_name,
        description: task.description,
        priority: task.priority,
        status: task.status,
        start_date: task.start_date,
        end_date: task.end_date,
      }))
    },

    // Helper method to parse CSV files
    async parseCSVFile(file) {
      const text = await file.text()
      const rows = text.trim().split('\n')
      const headers = rows[0].split(',')

      // Map CSV rows to task objects
      return rows.slice(1).map((row) => {
        const values = row.split(',')
        const task = {}
        headers.forEach((header, index) => {
          task[header.trim().toLowerCase().replace(' ', '_')] = values[index].trim()
        })
        return {
          task_id: task.task_id,
          task_name: task.task_name,
          description: task.description,
          priority: task.priority,
          status: task.status,
          start_date: task.start_date,
          end_date: task.end_date,
        }
      })
    },

    // Method to export tasks to CSV
    async exportTasksToCSV() {
      const userId = localStorage.getItem('user_id')
      const response = await axios.get(`${process.env.VUE_APP_API_URL}/task?user_id=${userId}`)
      // Check if response contains data
      console.log('Response from API:', response.data)
      this.tasks = response.data
      // Check if tasks array has data
      if (!this.tasks || this.tasks.length === 0) {
        alert('No tasks available to export.')
        return
      }

      // Define CSV headers and rows
      const headers = [
        'Task ID',
        'Task Name',
        'Description',
        'Priority',
        'Status',
        'Start Date',
        'End Date',
      ]
      const rows = this.tasks.map((task) => [
        task.task_id,
        task.task_name,
        task.description,
        task.priority,
        task.status,
        task.start_date,
        task.end_date,
      ])

      // Generate CSV content
      const csvContent = [
        headers.join(','), // add headers row
        ...rows.map((row) => row.join(',')), // add each task as a row
      ].join('\n')

      // Create a blob and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `tasks_${new Date().toISOString().slice(0, 10)}.csv`
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            this.fetchWeather(latitude, longitude)
            this.getLocationName(latitude, longitude)
          },
          (error) => {
            console.error('Error fetching location:', error)
            this.location = 'Location Unavailable'
          },
        )
      } else {
        this.location = 'Geolocation Not Supported'
      }
    },
    async fetchWeather(latitude, longitude) {
      try {
        const apiKey = 'ef6b679f4a2b2c18f67ecfe5a9d4cc0a' // Replace with your OpenWeatherMap API key
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`,
        )
        const data = response.data
        this.weather = {
          temp: data.main.temp.toFixed(1),
          description: data.weather[0].description,
          //description: 'thunderstorm' | 'sunny' | 'clear' |'snow',
        }
      } catch (error) {
        console.error(
          'Error fetching weather data:',
          error.response ? error.response.data : error.message,
        )
        alert('There was an issue fetching the weather data. Please try again.')
      }
    },
    async getLocationName(latitude, longitude) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        )
        const locationData = response.data
        this.location = `${locationData.address.village != undefined ? locationData.address.village : locationData.address.residential},  ${locationData.address.state_district}, ${
          locationData.address.country
        }`
      } catch (error) {
        console.error('Error fetching location name:', error)
        this.location = 'Location Unavailable'
      }
    },

    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
      localStorage.setItem('isDarkMode', JSON.stringify(this.isDarkMode))
    },

    logout() {
      // Clear authentication data (e.g., remove token from localStorage)
      localStorage.removeItem('authToken') // Adjust depending on how you're storing the token
      localStorage.removeItem('username')
      localStorage.removeItem('user_id')
      localStorage.removeItem('isDarkMode')
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

/* Light Theme */
body {
  background-color: #ffffff;
  color: #000000;
}

/* Dark Theme */
.dark {
  background-color: #333333;
  color: #ffffff;
}

.toggle-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: inherit;
  margin-right: 15px; /* Add space between dark mode and logout buttons */
}

.toggle-button:focus {
  outline: none;
}

.date-time {
  font-size: 16px;
  color: #2850a7;
  margin-right: 15px;
}

/* General Weather Container */
.weather-info {
  font-size: 0.8em;
  color: #c94017;
  text-align: center; /* Aligns text inside .weather-info to the left */
  position: relative; /* Use absolute or fixed for exact positioning */
  left: 0; /* Positions .weather-info to the left edge of the container */
  top: 20px; /* Adjusts distance from the top if needed */
  padding-left: 10px; /* Optional padding for some space from the edge */
}
/* Rain Animation */
@keyframes rain {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

.rain .raindrop {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.7);
  width: 2px;
  height: 10px;
  animation: rain 1s infinite linear;
  animation-delay: calc(0.1s * var(--i));
}

/* Snow Animation */
@keyframes snow {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

.snow .snowflake {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 5px;
  height: 5px;
  animation: snow 3s infinite linear;
  animation-delay: calc(0.1s * var(--i));
}

/* Sunny or Dry Weather Animation */
.sunny {
  background: linear-gradient(to top, #ff7e5f, #feb47b);
  animation: sunrise 10s infinite alternate;
}

@keyframes sunrise {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.05);
    opacity: 1;
  }
}

.sunny .sunbeam {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 0, 0.3);
  top: 0;
  left: 0;
  animation: sunbeam 1.5s infinite alternate;
}

@keyframes sunbeam {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Cloud Animation */
@keyframes clouds {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(100%);
  }
}

.clouds {
  position: relative;
  overflow: hidden;
}

.cloud {
  position: absolute;
  background-color: #b0c4de;
  border-radius: 50%;
  width: 80px;
  height: 50px;
  opacity: 0.8;
  animation: clouds 15s linear infinite;
}

.cloud:nth-child(1) {
  top: 10%;
  animation-delay: 0s;
}

.cloud:nth-child(2) {
  top: 30%;
  animation-delay: 3s;
}

.cloud:nth-child(3) {
  top: 60%;
  animation-delay: 6s;
}

/* Thunderstorm Animation */
@keyframes lightning {
  0% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
}

.thunderstorm {
  position: relative;
}

.thunderstorm .lightning {
  position: absolute;
  width: 2px;
  height: 100%;
  background-color: yellow;
  left: 50%;
  top: 0;
  animation: lightning 0.5s ease-in-out infinite;
}

.thunderstorm .cloud {
  position: absolute;
  background-color: #b0c4de;
  border-radius: 50%;
  width: 100px;
  height: 60px;
  opacity: 0.8;
  animation: clouds 10s linear infinite;
  top: 30%;
  left: 10%;
}
/* CSS for the first paragraph */
.first-paragraph {
  margin-bottom: 1px; /* Adjust this value to control spacing */
}

/* CSS for the second paragraph */
.second-paragraph {
  margin-top: 1px; /* Adjust this value to control spacing */
}
</style>
