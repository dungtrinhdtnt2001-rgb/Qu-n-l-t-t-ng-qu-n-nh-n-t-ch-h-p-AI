// FIX: Create and export the VietnamEmblemIcon component to resolve the module import error.
import React from 'react';

export const VietnamEmblemIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    {...props}
  >
    <circle cx="256" cy="256" r="256" fill="#da251d" />
    <polygon
      points="256,33.9 288.7,130.8 394.9,130.8 312.1,192.3 344.8,289.2 256,227.7 167.2,289.2 199.9,192.3 117.1,130.8 223.3,130.8"
      fill="#ffff00"
    />
  </svg>
);
