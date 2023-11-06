import { FeedWithSorting } from "~/components/Feed/FeedWithSorting";

export default function SearchPage() {
  return (
    <>
      <FeedWithSorting takeLimit={5} feedVariant={"books"} orderArray={[]} />
    </>
  );
}
