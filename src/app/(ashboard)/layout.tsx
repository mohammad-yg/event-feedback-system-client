import { FC, PropsWithChildren } from "react";
import { Header } from "src/components/layout/header";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <Header />
      <main className="container mx-auto pt-4 px-4 sm:px-6">{children}</main>;
    </div>
  );
};

export default Layout;
