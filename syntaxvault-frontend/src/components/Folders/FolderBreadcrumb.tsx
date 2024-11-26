import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

interface BreadcrumbItem {
  id: number;
  name: string;
  path: string;
}

interface FolderBreadcrumbProps {
  path: string;
  folders: BreadcrumbItem[];
  onFolderClick: (folderId: number) => void;
}

const FolderBreadcrumb: React.FC<FolderBreadcrumbProps> = ({
  path,
  folders,
  onFolderClick,
}) => {
  const pathParts = path.split('/').filter(Boolean);
  const breadcrumbItems = folders.filter(folder => 
    pathParts.includes(folder.name)
  ).sort((a, b) => 
    a.path.split('/').length - b.path.split('/').length
  );

  return (
    <div className="flex items-center text-sm text-gray-600 mb-4">
      <Link
        to="/dashboard"
        className="hover:text-blue-500"
      >
        Home
      </Link>
      {breadcrumbItems.map((item) => (
        <React.Fragment key={item.id}>
          <FaChevronRight className="mx-2" />
          <button
            onClick={() => onFolderClick(item.id)}
            className="hover:text-blue-500"
          >
            {item.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default FolderBreadcrumb; 