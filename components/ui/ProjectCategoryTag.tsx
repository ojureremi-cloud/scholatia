import React from 'react';

type ProjectCategoryTagProps = {
  category: string;
};

export const ProjectCategoryTag = ({ category }: ProjectCategoryTagProps) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      {category}
    </span>
  );
};