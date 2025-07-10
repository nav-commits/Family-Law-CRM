"use client";

import React from "react";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="border-t pt-4">
    <h3 className="text-lg font-semibold">{title}</h3>
    <div className="space-y-4 mt-2">{children}</div>
  </div>
);

export default Section;
