
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose, // For a close button if not using onOpenChange from trigger
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { type ImageCreationDto } from '@/services/imageCreationService'; // Assuming DTO is exported

interface ImageCreationDetailDialogProps {
  creation: ImageCreationDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiBaseUrl: string; // To construct image URLs
}

const ImageCreationDetailDialog: React.FC<ImageCreationDetailDialogProps> = ({
  creation,
  open,
  onOpenChange,
  apiBaseUrl,
}) => {
  if (!creation) {
    return null; // Don't render if no creation data
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl"> {/* Allow wider dialog for image */}
        <DialogHeader>
          <DialogTitle>Image Creation Details</DialogTitle>
          <DialogDescription>
            Detailed information about the generated image.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {creation.outputImageFileName && creation.status === 'COMPLETED' && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-center">Generated Image</h4>
              <img
                src={`${apiBaseUrl}/media/output/${creation.projectId}/${creation.outputImageFileName}`}
                alt={`Generated image for prompt: ${creation.promptText}`}
                className="rounded-md object-contain max-h-[400px] w-full mx-auto border"
              />
            </div>
          )}
          
          <div className="space-y-2 text-sm">
            <p><strong>Prompt:</strong> <span className="text-gray-700 whitespace-pre-wrap">{creation.promptText || "N/A"}</span></p>
            <p><strong>Status:</strong> <span className={`font-semibold ${creation.status === 'COMPLETED' ? 'text-green-600' : creation.status === 'FAILED' ? 'text-red-600' : 'text-yellow-600'}`}>{creation.status}</span></p>
            <p><strong>Input Type:</strong> <span className="text-gray-700">{creation.inputType}</span></p>
            <p><strong>AI Model Used:</strong> <span className="text-gray-700">{creation.aiModelUsed || "N/A"}</span></p>
            {creation.parametersJson && creation.parametersJson !== "{}" && (
                 <p><strong>Parameters:</strong> <code className="text-gray-700 text-xs bg-gray-100 p-1 rounded">{creation.parametersJson}</code></p>
            )}
            <p><strong>Creation ID:</strong> <span className="text-gray-700">{creation.id}</span></p>
            <p><strong>Project ID:</strong> <span className="text-gray-700">{creation.projectId}</span></p>
            <p><strong>Created At:</strong> <span className="text-gray-700">{new Date(creation.createdAt).toLocaleString()}</span></p>
            {creation.inputImageFileName && (
                 <p><strong>Input Image:</strong> <span className="text-gray-700">{creation.inputImageFileName}</span></p>
            )}
            {creation.generatedText && (
                 <p><strong>Generated Text:</strong> <span className="text-gray-700 whitespace-pre-wrap">{creation.generatedText}</span></p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
            <DialogClose asChild>
                <Button type="button" variant="outline">Close</Button>
            </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCreationDetailDialog;