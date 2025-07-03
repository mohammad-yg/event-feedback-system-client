import { FC, PropsWithChildren } from "react";
import { Header } from "src/components/layout/header";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <Header />
      <main className="container mx-auto pt-4">{children}</main>;
    </div>
  );
};

export default Layout;
