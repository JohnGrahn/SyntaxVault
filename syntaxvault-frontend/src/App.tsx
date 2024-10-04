import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import SnippetDetail from './components/Snippets/SnippetDetail';
import SnippetForm from './components/Snippets/SnippetForm';
import PrivateRoute from './utils/PrivateRoute';
import Header from './components/Layout/Header';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Use SnippetForm for adding snippets */}
          <Route path="/dashboard/add-snippet" element={<SnippetForm />} />
          <Route path="/dashboard/snippets/:id" element={<SnippetDetail />} />
          <Route path="/dashboard/edit-snippet/:id" element={<SnippetForm />} />
          {/* Add more protected routes here */}
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;