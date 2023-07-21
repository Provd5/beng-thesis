import type { FC } from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer: FC<PageContainerProps> = ({ children }) => {
  return (
    <>
      <div className="h-7 shrink-0" />
      <div className="nav-padding relative flex flex-auto flex-col rounded-t-3xl bg-white/95 px-[10px] dark:bg-black/95">
        {children}
      </div>
    </>
  );
};

export const ProfilePageContainer: FC<PageContainerProps> = ({ children }) => {
  return (
    <>
      <div className="h-[68px] shrink-0" />
      <div className="nav-padding relative flex flex-auto flex-col rounded-t-3xl bg-white/95 px-[10px] dark:bg-black/95">
        {children}
      </div>
    </>
  );
};
