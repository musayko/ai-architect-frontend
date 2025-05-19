// src/services/imageCreationService.ts
import axios from 'axios';

// DTOs - these should mirror your backend DTOs
// Ensure InputType and CreationStatus enums match what your backend uses
export type InputType =
  | "TEXT_TO_IMAGE"
  | "IMAGE_TO_IMAGE_SKETCH"
  | "IMAGE_TO_TEXT"
  | "IMAGE_TO_IMAGE_STYLE";

export type CreationStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export interface CreateTextToImageRequest {
  promptText: string;
  parametersJson?: string; // Optional
}

export interface ImageCreationDto {
  id: number;
  projectId: number;
  inputType: InputType;
  promptText?: string;
  inputImageFileName?: string;
  outputImageFileName?: string;
  generatedText?: string;
  status: CreationStatus;
  aiModelUsed?: string;
  parametersJson?: string;
  createdAt: string; // Assuming ISO string
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // From .env file
});

export const generateTextToImage = async (
  projectId: number,
  requestData: CreateTextToImageRequest
): Promise<ImageCreationDto> => {
  const response = await apiClient.post<ImageCreationDto>(
    `/projects/${projectId}/image-creations/text-to-image`,
    requestData
  );
  return response.data;
};

export const getImageCreationsForProject = async (
  projectId: number
): Promise<ImageCreationDto[]> => {
  const response = await apiClient.get<ImageCreationDto[]>(
    `/projects/${projectId}/image-creations`
  );
  return response.data;
};