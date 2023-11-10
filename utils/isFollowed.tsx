export const isFollowed = (
  followedBy: {
    follower_id: string;
  }[],
  sessionUserId: string | undefined
) => {
  return followedBy?.some((follower) => follower.follower_id === sessionUserId);
};
