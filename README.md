# Employee-Formation-Management
A professional Management System built with React &amp; Redux Toolkit, featuring dynamic training status synchronization and advanced data filtering. 

# Employee & Training Management System (Advanced Logic)
A robust React application designed for managing corporate training programs. This project prioritizes **clean architecture**, **advanced state management**, and **automated business logic** over visual styling.

## 🚀 Technical Focus & Core Logic
Unlike standard CRUD apps, this project implements professional-grade features:

- **Dynamic Status Synchronization**: An automated engine that evaluates formation dates (`datedebut`, `datefin`) against the real-time clock to update statuses (`Programmée`, `En cours`, `Terminée`) across the entire system.
- **Relational Data Joining**: Complex data fetching that merges three different resources (Employees, Formations, Participations) using optimized `Redux Selectors`.
- **Advanced State Management**: Built with `Redux Toolkit`, utilizing `AsyncThunks` for API calls and `createSelector` for high-performance, memoized data filtering.
- **Global Notifications**: Integrated `React-Toastify` for professional user feedback on every action.
- **Seamless Routing**: Uses `React Router v6` for clean navigation and protected-like UI flow.

## 🛠️ Tech Stack
- **Frontend**: React.js & Bootstrap (Functional Components & Hooks).
- **State**: Redux Toolkit (Slices, Thunks, Reselect).
- **API**: Axios with asynchronous middleware.
- **Notifications**: React-Toastify.
- **Data**: JSON Server (Mock REST API).

## ⚙️ Development Setup (Crucial)
To run this project locally, you need to set up three separate mock API endpoints to simulate a real microservices-like environment.

**Clone the repository**:
  ```bash
   git clone git@github.com:Driss-BR/Employee-Formation-Management.git
   cd Employee-Formation-Management
   
### 2. **Install dependencies**:
  npm install


### 3. **Run JSON Servers**:
 Open three separate terminals and run the following commands (ensure you have json-server installed):

### 4 .**Employees API (Port 5000)**:
  json-server --watch employes.json --port 5000

### 5. **Formations API (Port 5001)**:
  json-server --watch formations.json --port 5001

### 6. **Participations API (Port 5002)**:
  json-server --watch participations.json --port 5002

### 7. **Start the Application**:
  npm start

### 🧠 Key Code Snippets
The project features a unique calculateFormationEtat helper function integrated into the Redux life-cycle to ensure that whenever a formation is fetched, added, or updated, its status is verified against the server time, preventing data inconsistency.

### Note: This project is a demonstration of internal logic, API integration, and state synchronization. Styling is kept minimal (Bootstrap) to focus on code quality.
