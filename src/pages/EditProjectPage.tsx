import React from 'react';
import { useParams } from 'react-router-dom';

const EditProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  return (
    <div>
      <h1>Edit Project Page</h1>
      <p>Form to edit project ID: {projectId} will appear here.</p>
    </div>
  );
};

export default EditProjectPage;