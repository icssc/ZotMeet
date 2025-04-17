// src/app/summary/layout.tsx
import React from 'react';

export default function SummaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden"> 
      {children} 
    </div>
  );
}