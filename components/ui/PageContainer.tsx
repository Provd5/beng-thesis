import type { FC } from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer: FC<PageContainerProps> = ({ children }) => {
  return (
    <>
      {/* <div className="h-10 flex-none" /> */}
      <div className="nav-padding relative flex flex-auto flex-col rounded-t-3xl bg-white/90 dark:bg-black/90 md:rounded-none">
        {children}
      </div>
    </>
  );
};

export const ProfilePageContainer: FC<PageContainerProps> = ({ children }) => {
  return (
    <>
      <div className="h-[68px] flex-none" />
      <div className="nav-padding relative flex flex-auto flex-col rounded-t-3xl bg-white/90 dark:bg-black/90 md:rounded-none">
        {children}
      </div>
    </>
  );
};
