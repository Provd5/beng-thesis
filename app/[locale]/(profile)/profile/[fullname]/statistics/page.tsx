import Link from "next/link";

export default function StatisticsPage() {
  return (
    <>
      <div className="flex flex-col gap-3">
        <div>
          <Link href={{}}>test</Link>
          <h1>Finished books:</h1>
          <p></p>
        </div>
        <div>
          <h1>Owned books:</h1>
          <p></p>
        </div>
        <div>
          <h1>Liked books:</h1>
          <p></p>
        </div>
        <div>
          <h1>Reviews written:</h1>
          <p></p>
        </div>
        <div>
          <h1>Latest read book:</h1>
          <p></p>
        </div>
        <div>
          <h1>Pages read:</h1>
          <p></p>
        </div>
        <div>
          <h1>Most pages:</h1>
          <p></p>
        </div>
        <div>
          <h1>Most-read author:</h1>
          <p></p>
          <h1>Read books from this author:</h1>
          <p></p>
        </div>
        <div>
          <h1>Most read genre:</h1>
          <p></p>
        </div>
      </div>
    </>
  );
}
