// import type { FC } from "react";

// import { getBookmarkIcon } from "~/components/ui/getBookmarkIcon";
// import { fetchAlreadyReadStatistics } from "~/lib/actions/profile/statistics";

// import { AlreadyReadStatisticsLabels } from "./AlreadyReadStatisticsLabels";
// import { TotalReadPagesStatistics } from "./ReadPagesStatistics";

// interface AlreadyReadStatisticsCardProps {
//   profileName: string;
// }

// export const AlreadyReadStatisticsCard: FC<
//   AlreadyReadStatisticsCardProps
// > = async ({ profileName }) => {
//   const {
//     alreadyReadCount,
//     mostPagesBook,
//     mostRead,
//     readingTimeDifference,
//     recentlyRead,
//     totalReadPages,
//   } = await fetchAlreadyReadStatistics(profileName);

//   return (
//     <div className="flex flex-col gap-3">
//       <div className="flex items-center gap-1 self-end">
//         {getBookmarkIcon("ALREADY_READ")}
//         <h2 className="font-semibold">{alreadyReadCount}</h2>
//       </div>
//       {recentlyRead && (
//         <AlreadyReadStatisticsLabels
//           variant={"last:"}
//           book={recentlyRead.book}
//           updateDate={recentlyRead.updated_at}
//         />
//       )}
//       <div className="flex flex-wrap gap-x-6 gap-y-3">
//         {readingTimeDifference && (
//           <AlreadyReadStatisticsLabels
//             variant={"longest-read:"}
//             book={readingTimeDifference.longestReadBook}
//             readTime={readingTimeDifference.longestReadTimeDiff}
//           />
//         )}
//         {readingTimeDifference && (
//           <AlreadyReadStatisticsLabels
//             variant={"shortest-read:"}
//             book={readingTimeDifference.shortestReadBook}
//             readTime={readingTimeDifference.shortestReadTimeDiff}
//           />
//         )}
//       </div>
//       <div className="flex flex-wrap gap-x-6 gap-y-3">
//         {mostRead && (
//           <AlreadyReadStatisticsLabels
//             variant={"most read book:"}
//             book={mostRead.book}
//             readQuantity={mostRead.read_quantity}
//           />
//         )}
//         {mostPagesBook && (
//           <AlreadyReadStatisticsLabels
//             variant={"book with most pages:"}
//             book={mostPagesBook.book}
//           />
//         )}
//       </div>
//       <TotalReadPagesStatistics
//         totalReadPages={totalReadPages._sum.page_count || 0}
//       />
//     </div>
//   );
// };
