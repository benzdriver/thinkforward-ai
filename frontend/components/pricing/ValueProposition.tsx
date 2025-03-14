import React from 'react';

interface ValuePropositionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function ValueProposition({ icon, title, description }: ValuePropositionProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center">
      <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-blue-50">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  );
} 