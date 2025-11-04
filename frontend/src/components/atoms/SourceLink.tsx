import React from 'react';

type SourceLinkProps = {
  url: string;
};

const SourceLink: React.FC<SourceLinkProps> = ({ url }) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" title="Source">
      {/* Placeholder for an icon, e.g., a paperclip or globe */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
      </svg>
    </a>
  );
};

export default SourceLink;
