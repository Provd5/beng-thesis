export default function BookPage({
  params: { id, title },
}: {
  params: { id: string; title: string };
}) {
  return (
    <>
      <div>
        id: {id}
        title: {title}
      </div>
    </>
  );
}
