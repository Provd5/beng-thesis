import type { FC } from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer: FC<PageContainerProps> = ({ children }) => {
  return (
    <main className="nav-padding relative mt-7 flex h-full flex-col rounded-t-3xl bg-white/95 px-[10px] dark:bg-black/95">
      {children}
    </main>
  );
};

export const ProfilePageContainer: FC<PageContainerProps> = ({ children }) => {
  return (
    <main className="nav-padding relative mt-[68px] flex h-full flex-col rounded-t-3xl bg-white/95 px-[10px] dark:bg-black/95">
      <div className="mt-[-30px]">{children}</div>
    </main>
  );
};
