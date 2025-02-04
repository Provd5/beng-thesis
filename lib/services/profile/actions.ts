"use server";

import { revalidateTag } from "next/cache";

import { db } from "~/lib/db";
import { errorHandler } from "~/lib/errorHandler";
import { ErrorsToTranslate } from "~/lib/validations/errorsEnums";
import { UuidValidator } from "~/lib/validations/others";
import { EditProfileValidator } from "~/lib/validations/profile";

import { getSessionUser } from "../session/queries";

export async function postFollow(
  profileId: unknown,
): Promise<{ success: boolean }> {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      throw new Error(ErrorsToTranslate.UNAUTHORIZED);
    }

    const validProfileId = UuidValidator.parse(profileId);
    if (sessionUser.id === validProfileId) {
      throw new Error(ErrorsToTranslate.FOLLOW.CANNOT_FOLLOW_OWN_PROFILE);
    }

    const alreadyFollowed = await db.follows.findFirst({
      where: {
        follower: { id: sessionUser.id },
        following: { id: validProfileId },
      },
    });

    if (alreadyFollowed) {
      await db.follows.delete({
        where: {
          follower_id_following_id: {
            follower_id: sessionUser.id,
            following_id: validProfileId,
          },
        },
      });
    } else {
      await db.follows.create({
        data: {
          follower_id: sessionUser.id,
          following_id: validProfileId,
        },
      });
    }

    // on success
    revalidateTag("session-user");
    return { success: true };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function editProfile(
  formData: unknown,
): Promise<{ success: boolean }> {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      throw new Error(ErrorsToTranslate.UNAUTHORIZED);
    }

    const validFormData = EditProfileValidator.parse(formData);
    const isUsernameExists = await db.profile.count({
      where: {
        AND: [
          {
            full_name: { equals: validFormData.username, mode: "insensitive" },
            id: { not: sessionUser.id },
          },
        ],
      },
    });

    if (isUsernameExists > 0) {
      throw new Error(ErrorsToTranslate.EDIT_PROFILE.USERNAME_ALREADY_EXISTS);
    }

    await db.profile.update({
      where: {
        id: sessionUser.id,
      },
      data: {
        full_name: validFormData.username,
        description: validFormData.description,
        private: validFormData.private,
      },
    });

    // on success
    revalidateTag("session-user");
    return { success: true };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}
