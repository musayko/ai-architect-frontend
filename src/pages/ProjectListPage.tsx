import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    getAllProjects,
    createProject,
    updateProject,
    deleteProject, 
    type ProjectDto,
    type CreateProjectRequest,
    type UpdateProjectRequest } from '../services/projectService'; // Import service and DTO
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import shadcn/ui Table components
import { Button } from '@/components/ui/button';
import ProjectFormDialog from '@/components/ProjectFormDialog';

const ProjectListPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for the form dialog
  const [isFormDialogOpen, setIsFormDialogOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<ProjectDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await getAllProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProjectClick = () => {
    setEditingProject(null); // Ensure we're in "add" mode
    setIsFormDialogOpen(true);
  };

  const handleEditProjectClick = (project: ProjectDto) => {
    setEditingProject(project);
    setIsFormDialogOpen(true);
  };

  const handleSaveProject = async (
    projectData: CreateProjectRequest | UpdateProjectRequest,
    projectId?: number
  ) => {
    setIsSubmitting(true);
    try {
      if (projectId) { // Editing existing project
        await updateProject(projectId, projectData as UpdateProjectRequest);
      } else { // Creating new project
        await createProject(projectData as CreateProjectRequest);
      }
      setIsFormDialogOpen(false);
      setEditingProject(null);
      await fetchProjects(); // Refresh the list
    } catch (err) {
      console.error("Failed to save project:", err);
      // You might want to show a more user-friendly error in the dialog or as a toast
      alert(`Error saving project: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        // Consider what to do if the project has image creations.
        // The backend currently just deletes the project.
        await deleteProject(projectId);
        await fetchProjects(); // Refresh the list
      } catch (err) {
        console.error("Failed to delete project:", err);
        alert(`Error deleting project: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };


  if (isLoading && projects.length === 0) { // Show loading only on initial load
    return <div>Loading projects...</div>;
  }

  if (error && projects.length === 0) { // Show error only if no projects are loaded
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={handleAddProjectClick}>
          Add New Project
        </Button>
      </div>

      {error && <p className="text-red-500 mb-4">Error refreshing projects: {error}</p>}

      {projects.length === 0 && !isLoading ? (
        <p>No projects found. Click "Add New Project" to create one!</p>
      ) : (
        <Table>
          <TableCaption>A list of your AI design projects.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[180px]">Created At</TableHead>
              <TableHead className="text-right w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>
                  {project.description?.substring(0, 100)}
                  {project.description && project.description.length > 100 ? '...' : ''}
                </TableCell>
                <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Link to={`/projects/${project.id}`} className="text-blue-600 hover:underline mr-3">
                    View
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => handleEditProjectClick(project)} className="mr-2">
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteProject(project.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ProjectFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        project={editingProject}
        onSave={handleSaveProject}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default ProjectListPage;