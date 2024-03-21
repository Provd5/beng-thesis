import { experimental_useOptimistic as useOptimistic, type FC } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { IoMdEye, IoMdEyeOff } from "react-icons/io";

import { type FollowsInterface } from "~/types/data/profile";

import { Button } from "~/components/ui/Buttons";
import { ProfileService } from "~/lib/services/profile";

interface FollowFormProps {
  userId: string;
  followsData: FollowsInterface | null | undefined;
}

export const FollowForm: FC<FollowFormProps> = ({ userId, followsData }) => {
  const t = useTranslations("Profile.FollowProfile");

  const profileService = new ProfileService();

  const [optimisticIsFollowState, setOptimisticIsFollowState] = useOptimistic(
    !!followsData,
    (_, newFollowState: boolean) => {
      return newFollowState;
    }
  );

  const handleFollow = async () => {
    try {
      setOptimisticIsFollowState(!optimisticIsFollowState);

      await profileService.postFollow(userId);
    } catch (error) {
      toast.error(error as string);
    }
  };

  return (
    <Button
      onClick={handleFollow}
      defaultColor={false}
      size="xs"
      className="bg-white-light dark:bg-black-dark"
    >
      {optimisticIsFollowState ? (
        <>
          <IoMdEyeOff className="text-red" /> {t("unfollow")}
        </>
      ) : (
        <>
          <IoMdEye className="text-green" /> {t("follow")}
        </>
      )}
    </Button>
  );
};
