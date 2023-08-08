import type { FC } from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer: FC<PageContainerProps> = ({ children }) => {
  return (
    <>
      <div className="h-7 flex-none" />
      <div className="nav-padding relative flex flex-auto flex-col rounded-t-3xl bg-white/95 dark:bg-black/95">
        {children}
      </div>
    </>
  );
};

export const ProfilePageContainer: FC<PageContainerProps> = ({ children }) => {
  return (
    <>
      <div className="h-[68px] flex-none" />
      <div className="nav-padding relative flex flex-auto flex-col rounded-t-3xl bg-white/95 dark:bg-black/95">
        {children}
      </div>
    </>
  );
};
