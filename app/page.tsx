"use server";

import { Suspense } from "react";
import { ProfilePhotoEditor } from "@/components/profile-photo-editor";

import { ReviewsMarquee } from "@/components/reviews-marquee";

export default async function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <div className="flex-1 flex items-center justify-center py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <ProfilePhotoEditor />
        </Suspense>
      </div>

      <div className="w-full">
        <ReviewsMarquee />
      </div>
    </div>
  );
}
