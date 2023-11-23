"use client";

import {
  type Dispatch,
  type FC,
  type FormEvent,
  type SetStateAction,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import axios from "axios";
import clsx from "clsx";
import { z } from "zod";

import { RxCross2 } from "react-icons/rx";

import { ButtonWhite } from "~/components/ui/Buttons";
import { Input } from "~/components/ui/Input";
import {
  DescriptionValidator,
  UsernameValidator,
} from "~/lib/validations/auth";
import { GlobalErrors } from "~/lib/validations/errorsEnums";

interface EditProfileFormProps {
  data: string | null;
  setData: Dispatch<SetStateAction<string | null>>;
  formType: "username" | "description";
  cancelForm: () => void;
}

export const EditProfileForm: FC<EditProfileFormProps> = ({
  data,
  setData,
  formType,
  cancelForm,
}) => {
  const t = useTranslations("Profile.EditProfile");
  const ta = useTranslations("Profile.Auth");
  const te = useTranslations("Errors");

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const form = event.currentTarget as HTMLFormElement;
      const inputElement = form.elements.namedItem(`${formType}-input`) as
        | HTMLInputElement
        | HTMLTextAreaElement;
      const inputElementValue =
        inputElement.value.trim().length > 0 ? inputElement.value : "";

      if (data === inputElementValue) {
        cancelForm();
        return;
      }

      if (formType === "description") {
        DescriptionValidator.parse({ description: inputElementValue });
      } else {
        UsernameValidator.parse({ username: inputElementValue });
      }

      const { data: updatedData }: { data: string } = await axios.patch(
        `/api/profile/${formType}/`,
        {
          [formType === "description" ? "description" : "username"]:
            inputElementValue,
        }
      );

      if (updatedData !== GlobalErrors.SUCCESS) {
        toast.error(te(updatedData));
        return;
      }

      // on success
      setData(inputElementValue);
      toast.success(te(GlobalErrors.SUCCESS));
      cancelForm();

      if (!data && inputElementValue && formType === "username") {
        toast(ta("we will redirect you to your profile in a moment"));
        router.push(`/profile/${inputElementValue}`);
      }

      router.refresh();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(te(error.issues[0].message));
      } else {
        toast.error(te(GlobalErrors.SOMETHING_WENT_WRONG));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex h-full w-full flex-col items-start gap-1.5"
      onSubmit={handleUpdate}
    >
      <div className="flex gap-2">
        <ButtonWhite size="xs" loading={isLoading} type="submit">
          {t("save")}
        </ButtonWhite>
        {data && (
          <button
            disabled={isLoading}
            className="rounded-sm bg-red p-2 text-base text-white-light"
            onClick={() => cancelForm()}
          >
            <RxCross2 />
          </button>
        )}
      </div>
      <div className="min-h-[40px] w-full">
        <Input
          isTextarea={formType === "description"}
          className={clsx(
            "w-full",
            formType === "username" ? "max-w-xs" : "h-full min-h-[250px]"
          )}
          loading={isLoading}
          type="text"
          id={`${formType}-input`}
          name={`${formType}-input`}
          placeholder={
            formType === "description"
              ? t("add profile description")
              : t("enter username")
          }
          required={formType === "username"}
          autoComplete="off"
          minLength={formType === "description" ? 0 : 3}
          maxLength={formType === "description" ? 5000 : 32}
          defaultValue={data || ""}
        />
      </div>
    </form>
  );
};
