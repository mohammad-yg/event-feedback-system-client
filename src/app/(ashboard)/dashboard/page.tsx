'use client'
import React from "react";
import Protected from "src/components/protected";

const DashboardPage = () => {
  return (
    <Protected>
      <div>dashboard</div>
    </Protected>
  );
};

export default DashboardPage;
