import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login'; // Assuming Login is in the same directory
import Home from './Components/Home'; // Assuming Home is another component

// Define a type for the App state (authentication state)
const App: React.FC = () => {
  // State to track if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/home"
            element={isAuthenticated ? <Home /> : <Login setIsAuthenticated={setIsAuthenticated} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
