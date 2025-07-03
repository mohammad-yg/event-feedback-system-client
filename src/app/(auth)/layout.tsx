import React, { FC, PropsWithChildren } from "react";
import { Card } from "src/components/ui/card";

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="bg-accent flex items-center justify-center h-full">
      <div className="w-[600px] p-2.5">
        <Card className="p-3">{children}</Card>
      </div>
    </div>
  );
};

export default AuthLayout;
