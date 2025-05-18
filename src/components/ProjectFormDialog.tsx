import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
//   DialogTrigger,
  DialogClose,    
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { type ProjectDto, type CreateProjectRequest, type UpdateProjectRequest } from '@/services/projectService'; // Assuming DTOs are exported

interface ProjectFormDialogProps {
  project?: ProjectDto | null; // Existing project data for editing, null or undefined for adding
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (projectData: CreateProjectRequest | UpdateProjectRequest, projectId?: number) => void;
  isLoading?: boolean;
}

const ProjectFormDialog: React.FC<ProjectFormDialogProps> = ({
  project,
  open,
  onOpenChange,
  onSave,
  isLoading
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const isEditing = Boolean(project && project.id);

  useEffect(() => {
    if (isEditing && project) {
      setName(project.name);
      setDescription(project.description || '');
    } else {
      // Reset for new project form
      setName('');
      setDescription('');
    }
  }, [project, isEditing, open]); // Reset form when dialog opens or project changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const projectData: CreateProjectRequest | UpdateProjectRequest = { name, description };
    onSave(projectData, project?.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to your project here. Click save when you're done."
              : "Fill in the details for your new project. Click save to create it."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Project')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;