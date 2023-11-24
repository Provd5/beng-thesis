import { LargeComponentLoader } from "~/components/ui/Loaders/Loader";

export default function Loading() {
  return (
    <>
      <div className="w-full rounded-t-3xl border-b border-white-light bg-white dark:border-black-dark dark:bg-black md:rounded-none">
        <div className="container flex h-full w-full items-center justify-center px-8 py-3">
          <div className="flex w-full flex-col-reverse xs:flex-row xs:justify-end">
            <div className="h-[39px] w-full max-w-[460px] animate-pulse rounded-lg bg-gray" />
          </div>
        </div>
      </div>
      <LargeComponentLoader />
    </>
  );
}
