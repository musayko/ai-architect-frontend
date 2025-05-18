import axios from 'axios';

export interface ProjectDto {
  id: number;
  name: string;
  description?: string;
  createdAt: string; 
  updatedAt: string; 
}
export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

// Create an axios instance with the base URL
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // Get base URL from env variable
    headers: {
    'Content-Type': 'application/json',
  },
});

// API functions for Project endpoints
export const getAllProjects = async (): Promise<ProjectDto[]> => {
  const response = await apiClient.get<ProjectDto[]>('/projects');
  return response.data;
};

export const getProjectById = async (projectId: number): Promise<ProjectDto> => {
  const response = await apiClient.get<ProjectDto>(`/projects/${projectId}`);
  return response.data;
};

export const createProject = async (projectData: CreateProjectRequest): Promise<ProjectDto> => {
  const response = await apiClient.post<ProjectDto>('/projects', projectData); // [cite: 45]
  return response.data;
};

export const updateProject = async (projectId: number, projectData: UpdateProjectRequest): Promise<ProjectDto> => {
  const response = await apiClient.put<ProjectDto>(`/projects/${projectId}`, projectData);
  return response.data;
};

export const deleteProject = async (projectId: number): Promise<void> => {
  await apiClient.delete(`/projects/${projectId}`);
};