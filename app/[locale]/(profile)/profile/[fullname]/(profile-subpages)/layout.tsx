import { BackCategoryLink } from "~/components/ui/BackCategoryLink";
import { CategoryLinksContainer } from "~/components/ui/CategoryLinksContainer";
import { DragContainer } from "~/components/ui/DragContainer";

export default function ProfileSubpagesLayout({
  children,
  params: { fullname },
}: {
  children: React.ReactNode;
  params: { fullname: string };
}) {
  return (
    <div className="mt-6 flex flex-col gap-3">
      <BackCategoryLink variant="RETURN" href={`/profile/${fullname}`} />
      <DragContainer
        arrowSize="sm"
        containerClassName="flex-start py-1 px-0.5 hidden-scrollbar flex gap-1"
      >
        <CategoryLinksContainer userFullname={fullname} />
      </DragContainer>
      {children}
    </div>
  );
}
