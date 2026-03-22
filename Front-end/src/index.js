import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
    <Router>
      <Routes>
        <Route path='/*' element={<App />}/>
      </Routes>
    </Router>
    </AuthProvider>
);

