import { Suspense } from "react"
import { ProfilePhotoEditor } from "@/components/profile-photo-editor"

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProfilePhotoEditor />
    </Suspense>
  )
}
