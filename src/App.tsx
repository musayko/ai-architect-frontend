import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProjectListPage from './pages/ProjectListPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import NewProjectPage from './pages/NewProjectPage';
import EditProjectPage from './pages/EditProjectPage';
import Layout from './components/Layout';


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/projects" replace />} /> {}
          <Route path="/projects" element={<ProjectListPage />} /> {}
          <Route path="/projects/new" element={<NewProjectPage />} /> {}
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} /> {}
          <Route path="/projects/:projectId/edit" element={<EditProjectPage />} /> {}
          {/* Add other routes here as needed */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
export default App;