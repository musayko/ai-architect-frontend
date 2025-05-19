
import React, { useEffect, useState, type FormEvent, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById, type ProjectDto } from '../services/projectService';
import {
  generateTextToImage,
  getImageCreationsForProject,
  type ImageCreationDto,
  type CreateTextToImageRequest,
} from '../services/imageCreationService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ImageCreationDetailDialog from '@/components/ImageCreationDetailDialog'; // Import the new dialog

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const numericProjectId = projectId ? parseInt(projectId, 10) : null;

  const [project, setProject] = useState<ProjectDto | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState<boolean>(true);
  const [projectError, setProjectError] = useState<string | null>(null);

  const [prompt, setPrompt] = useState<string>('');
  const [parametersJson, setParametersJson] = useState<string>('');
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const [imageCreations, setImageCreations] = useState<ImageCreationDto[]>([]);
  const [isLoadingCreations, setIsLoadingCreations] = useState<boolean>(true);
  const [creationsError, setCreationsError] = useState<string | null>(null);

  // State for the ImageCreationDetailDialog
  const [selectedImageCreation, setSelectedImageCreation] = useState<ImageCreationDto | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState<boolean>(false);

  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchImageCreations = useCallback(async () => {
    if (numericProjectId && !isNaN(numericProjectId)) {
      try {
        setIsLoadingCreations(true);
        const data = await getImageCreationsForProject(numericProjectId);
        setImageCreations(data.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setCreationsError(null);
      } catch (err) {
        console.error("Failed to fetch image creations:", err);
        setCreationsError("Failed to load image creations.");
      } finally {
        setIsLoadingCreations(false);
      }
    }
  }, [numericProjectId]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (numericProjectId && !isNaN(numericProjectId)) {
        try {
          setIsLoadingProject(true);
          const data = await getProjectById(numericProjectId);
          setProject(data);
          setProjectError(null);
        } catch (err) {
          console.error("Failed to fetch project details:", err);
          setProjectError("Failed to load project details.");
        } finally {
          setIsLoadingProject(false);
        }
      } else {
        setProjectError("Invalid or no project ID provided.");
        setIsLoadingProject(false);
      }
    };
    fetchProjectDetails();
    fetchImageCreations(); // Fetch creations when project ID is available/changes
  }, [numericProjectId, fetchImageCreations]); // Added fetchImageCreations to dependency array


  const handleGenerateImage = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !numericProjectId) {
      setGenerationError("Prompt cannot be empty.");
      return;
    }
    setIsGeneratingImage(true);
    setGenerationError(null);
    try {
      const requestData: CreateTextToImageRequest = { promptText: prompt };
      if (parametersJson.trim()) {
        requestData.parametersJson = parametersJson;
      }
      await generateTextToImage(numericProjectId, requestData);
      setPrompt('');
      setParametersJson('');
      await fetchImageCreations();
    } catch (err) {
      console.error("Failed to generate image:", err);
      setGenerationError(`Failed to generate image: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleViewCreationDetails = (creation: ImageCreationDto) => {
    setSelectedImageCreation(creation);
    setIsDetailDialogOpen(true);
  };

  if (isLoadingProject) {
    return <div className="container mx-auto py-10">Loading project details...</div>;
  }
  if (projectError) {
    return <div className="container mx-auto py-10 text-red-500">{projectError}</div>;
  }
  if (!project) {
    return <div className="container mx-auto py-10">Project not found.</div>;
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <Card>
        {/* ... Project Details Card Content (as before) ... */}
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl">{project.name}</CardTitle>
              <CardDescription>Project ID: {project.id}</CardDescription>
            </div>
            <Link to={`/projects/${project.id}/edit`}>
              <Button variant="outline">Edit Project</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-1">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {project.description || <span className="italic text-gray-500">No description provided.</span>}
          </p>
          <div className="text-xs text-gray-500 mt-3">
            <p>Created: {new Date(project.createdAt).toLocaleString()}</p>
            <p>Last Updated: {new Date(project.updatedAt).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        {/* ... New Text-to-Image Creation Card Content (as before) ... */}
        <CardHeader>
          <CardTitle>New Text-to-Image Creation</CardTitle>
          <CardDescription>Enter a prompt to generate an image using AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerateImage} className="space-y-4">
            <div>
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A futuristic cityscape at sunset, hyperrealistic..."
                className="mt-1"
                rows={4}
                required
              />
            </div>
            <div>
              <Label htmlFor="parametersJson">Parameters (JSON - Optional)</Label>
              <Textarea
                id="parametersJson"
                value={parametersJson}
                onChange={(e) => setParametersJson(e.target.value)}
                placeholder='e.g., {"sampleCount": 1, "aspectRatio": "16:9"}'
                className="mt-1"
                rows={2}
              />
            </div>
            {generationError && <p className="text-sm text-red-500">{generationError}</p>}
            <Button type="submit" disabled={isGeneratingImage}>
              {isGeneratingImage ? 'Generating...' : 'Generate Image'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Image Creation History</CardTitle>
          <CardDescription>Previously generated images for this project.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingCreations && <p>Loading image creations...</p>}
          {creationsError && <p className="text-red-500">{creationsError}</p>}
          {!isLoadingCreations && !creationsError && imageCreations.length === 0 && (
            <p className="text-gray-500">No image creations yet for this project.</p>
          )}
          {imageCreations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {imageCreations.map((creation) => (
                <Card key={creation.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium truncate" title={creation.promptText || "No prompt"}>
                      Prompt: {creation.promptText ? (creation.promptText.substring(0,50) + (creation.promptText.length > 50 ? "..." : "")) : <span className="italic">No prompt</span>}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Status: <span className={`font-semibold ${creation.status === 'COMPLETED' ? 'text-green-600' : creation.status === 'FAILED' ? 'text-red-600' : 'text-yellow-600'}`}>
                                {creation.status}
                              </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex items-center justify-center">
                    {creation.outputImageFileName && creation.status === 'COMPLETED' ? (
                      <img
                        src={`${VITE_API_BASE_URL}/media/output/${creation.projectId}/${creation.outputImageFileName}`}
                        alt={`Generated image for prompt: ${creation.promptText || 'N/A'}`}
                        className="rounded-md object-contain max-h-60 w-full cursor-pointer" // Added cursor-pointer
                        onClick={() => handleViewCreationDetails(creation)} // Open dialog on image click
                      />
                    ) : creation.status === 'PENDING' || creation.status === 'PROCESSING' ? (
                      <div className="text-center p-4 text-gray-500">Image processing...</div>
                    ) : (
                       <div className="text-center p-4 text-gray-500">Image not available.</div>
                    )}
                  </CardContent>
                  <CardFooter className="text-xs text-gray-500 pt-2 pb-3 flex justify-between items-center"> {/* Flex for alignment */}
                    <p>Created: {new Date(creation.createdAt).toLocaleString()}</p>
                    <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => handleViewCreationDetails(creation)}> {/* Details button */}
                        Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Render the ImageCreationDetailDialog */}
      <ImageCreationDetailDialog
        creation={selectedImageCreation}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        apiBaseUrl={VITE_API_BASE_URL}
      />
    </div>
  );
};

export default ProjectDetailPage;