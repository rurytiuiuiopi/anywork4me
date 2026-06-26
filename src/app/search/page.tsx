import { Suspense } from "react";
import { CardSkeletonList } from "@/components/CardSkeleton";
import { SearchClient } from "./SearchClient";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto min-h-dvh w-full max-w-2xl px-5 pb-20 pt-20">
          <CardSkeletonList />
        </main>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
