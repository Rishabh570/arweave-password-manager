import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PasswordManager from './components/PasswordManager';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PasswordManager />} />
      </Routes>
    </Router>
  );
};

export default App;