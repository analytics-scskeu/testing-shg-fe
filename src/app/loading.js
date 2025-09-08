import { Spinner } from "@/components/icons";

export default async function Loading() {
    return (
        <div
            id="global-loading"
            className="inset-0 bg-white/70 z-50 flex items-center justify-center opacity-0 pointer-events-none
      transition-opacity duration-300"
        >
            <Spinner />
        </div>
    );
}
