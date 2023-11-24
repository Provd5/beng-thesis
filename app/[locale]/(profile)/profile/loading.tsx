import { AvatarImage } from "~/components/Profile/AvatarImage";
import { TextLoader } from "~/components/ui/Loaders/Loader";

export default function Loading() {
  return (
    <div className="container pb-12">
      <div className="mb-2 flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="ml-0 mt-[-30px] xs:ml-6">
            <div className="bodyGradientForAvatar relative flex h-[112px] w-[112px] items-center justify-center rounded-full">
              <AvatarImage size="lg" className="animate-pulse" isLoader />
            </div>
          </div>
          <div className="mx-0.5 mt-3">
            <div
              className="flex animate-pulse flex-col gap-2"
              style={{ animationDelay: "0.2s" }}
            >
              <TextLoader height="h1" className="w-32" />
              <TextLoader height="h1" className="w-32" />
            </div>
          </div>
        </div>
        <div
          className="mx-0 mb-3 mt-1 h-8 w-44 animate-pulse rounded-sm bg-gray xs:mx-6"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
      <div
        className="flex animate-pulse flex-col gap-1"
        style={{ animationDelay: "0.6s" }}
      >
        <TextLoader height="h1" className="w-24" />
        <div className="flex flex-col gap-px">
          <TextLoader height="h3" className="w-11/12" />
          <TextLoader height="h3" className="w-10/12" />
          <TextLoader height="h3" className="w-9/12" />
        </div>
      </div>
    </div>
  );
}
