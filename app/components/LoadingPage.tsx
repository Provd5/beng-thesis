import { Loader } from "./ui/Loader";

export default function LoadingPage() {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-gradient-light text-white-light dark:bg-gradient-dark">
      <div className="max-w-24 h-1/3 max-h-24 w-1/3">
        <Loader />
      </div>
    </div>
  );
}
