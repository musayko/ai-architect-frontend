import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById, type ProjectDto } from '../services/projectService';
import { Button } from '@/components/ui/button'; 
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (projectId) {
        try {
          setIsLoading(true);
          const numericProjectId = parseInt(projectId, 10);
          if (isNaN(numericProjectId)) {
            setError("Invalid project ID format.");
            setIsLoading(false);
            return;
          }
          const data = await getProjectById(numericProjectId);
          setProject(data);
          setError(null);
        } catch (err) {
          console.error("Failed to fetch project details:", err);
          setError("Failed to load project details. Please ensure the project exists.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setError("No project ID provided.");
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (isLoading) {
    return <div>Loading project details...</div>; // Replace with Skeleton later
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!project) {
    return <div>Project not found.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      {/* Example of using Card for layout, optional */}
      {/* <Card className="w-full max-w-2xl mx-auto"> */}
      {/* <CardHeader> */}
      {/* <CardTitle className="text-3xl">{project.name}</CardTitle> */}
      {/* <div className="flex justify-end mt-[-2rem]"> */}
      {/* <Link to={`/projects/${project.id}/edit`}> */}
      {/* <Button variant="outline">Edit Project</Button> */}
      {/* </Link> */}
      {/* </div> */}
      {/* <CardDescription>Project ID: {project.id}</CardDescription> */}
      {/* </CardHeader> */}
      {/* <CardContent> */}
      {/* <h2 className="text-xl font-semibold mb-2">Description</h2> */}
      {/* <p className="text-gray-700 whitespace-pre-wrap"> */}
      {/* {project.description || 'No description provided.'} */}
      {/* </p> */}
      {/* <p className="text-sm text-gray-500 mt-4"> */}
      {/* Created: {new Date(project.createdAt).toLocaleString()} */}
      {/* </p> */}
      {/* <p className="text-sm text-gray-500"> */}
      {/* Last Updated: {new Date(project.updatedAt).toLocaleString()} */}
      {/* </p> */}
      {/* </CardContent> */}
      {/* </Card> */}

      {/* Simpler layout without Card for now: */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
            <p className="text-sm text-gray-500">Project ID: {project.id}</p>
          </div>
          <Link to={`/projects/${project.id}/edit`}> {/* This link points to a placeholder page for now */}
            <Button variant="outline">Edit Project</Button>
          </Link>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 border-b pb-1">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap mt-2">
            {project.description || <span className="italic text-gray-500">No description provided.</span>}
          </p>
        </div>

        <div className="text-sm text-gray-500">
          <p>Created: {new Date(project.createdAt).toLocaleString()}</p>
          <p>Last Updated: {new Date(project.updatedAt).toLocaleString()}</p>
        </div>
      </div>


      {/* Placeholders for Image Creations - As per plan  */}
      <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Image Creations</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500">List of image creations for this project will appear here (Phase 3).</p>
        </div>
      </div>

      <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">New Image Creation</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500">Form for new image creation (e.g., text-to-image) will appear here (Phase 3).</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;