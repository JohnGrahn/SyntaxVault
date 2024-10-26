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
import CollectionList from './components/Collections/CollectionList';
import CollectionForm from './components/Collections/CollectionForm';
import CollectionDetail from './components/Collections/CollectionDetail';
import ProfilePage from './pages/ProfilePage';
import PublicSnippets from './components/Snippets/PublicSnippets';
import PublicSnippetDetail from './components/Snippets/PublicSnippetDetail';

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
          
          {/* Snippets Routes */}
          <Route path="/dashboard/add-snippet" element={<SnippetForm />} />
          <Route path="/dashboard/snippets/:id" element={<SnippetDetail />} />
          <Route path="/dashboard/edit-snippet/:id" element={<SnippetForm />} />
          
          {/* Collections Routes */}
          <Route path="/dashboard/collections" element={<CollectionList />} />
          <Route path="/dashboard/add-collection" element={<CollectionForm />} />
          <Route path="/dashboard/collections/:id" element={<CollectionDetail />} />
          <Route path="/dashboard/edit-collection/:id" element={<CollectionForm />} />
          
          {/* Add more protected routes here */}
          <Route path="/dashboard/profile" element={<ProfilePage />} />
        </Route>

        {/* Public Routes */}
        <Route path="/public-snippets" element={<PublicSnippets />} />
        <Route path="/public-snippets/:id" element={<PublicSnippetDetail />} />

        {/* Catch-all Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
