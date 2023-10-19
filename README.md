# Hope Assessment Project Setup

## Prerequisites

Before you can start using the Hope Assessment project, please make sure you have MongoDB and Node installed on your system.

### Installation Instructions

1. **Install MongoDB:** If you haven't already, install MongoDB on your system. You can download it from [MongoDB's official website](https://www.mongodb.com/try/download/community).

2. **Start MongoDB Server:** Start your MongoDB server.

## Getting Started

Follow these steps to set up and run the Hope Assessment project:

1. **Create a Database:**

   - Open your MongoDB client.
   - Create a new database and name it "hope."

2. **Clone the Repository:**
   ```bash
   git clone <repository_url>
   cd hope-assessment
   ```
3. **Create a `.env` File:**

   - Create a `.env` file in the root directory of your project.

4. **Add the Following Keys to `.env:`**
   ```bash
   MONGO_URI=mongodb://127.0.0.1/hope # Assuming this is where you mongodb is hosted
   JWT_SECRET=your-secret-key  # This can be anything
   PORT=3500  # This is the port where the server will be accessible
   ```
5. **Install Dependencies**

   ```
   npm install
   ```

6. **Start the Server:**
   Run the following command to start the server:
   ```bash
   npm run start
   ```
7. **Access the Server:**
   You can now access the server by opening a web browser and navigating to:
   http://localhost:[YOUR_PORT_NUMBER]
