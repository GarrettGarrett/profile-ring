"use client"

import { cn } from "@/lib/utils"
import Marquee from "@/components/ui/marquee"
import Image from "next/image"
import { useRouter } from "next/navigation"

const reviews = [
  {
    name: "Gangster Cat",
    username: "@gangsta_cat",
    body: "Yo fam, this ring maker is straight fire! Keeping my profile looking fresh like my street cred. 💯",
    img: "/gangster.png",
  },
  {
    name: "Funky Cat",
    username: "@groove_kitty",
    body: "These profile rings got me dancing! The colors are groovy and the vibes are immaculate. Keep it funky! 🕺",
    img: "/funky.png",
  },
  {
    name: "Lofi Cat",
    username: "@chill_whiskers",
    body: "Such chill vibes... Perfect for those late night coding sessions. *purrs contentedly* ☕️",
    img: "/lofi.png",
  },
  {
    name: "Metal Cat",
    username: "@headbanger_paw",
    body: "THESE PROFILE RINGS ARE ABSOLUTELY METAL!!! 🤘 SHREDDING THROUGH THE COMPETITION! 🔥",
    img: "/metal.png",
  },
  {
    name: "Country Cat",
    username: "@yeehaw_whiskers",
    body: "Yeehaw! These profile rings are purrfect for line dancing through the digital prairie! 🤠 Saddle up, partners! 🐎",
    img: "/country.png",
  },
  {
    name: "Regular Cat",
    username: "@just_cat",
    body: "Finally, a simple way to make my profile pic stand out! Meow-velous invention! 😺",
    img: "/nothing.png",
  },
]

const firstRow = reviews.slice(0, 3)
const secondRow = reviews.slice(3)

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  const router = useRouter()

  const handleClick = () => {
    // Update URL with the selected image
    router.push(`/?template=${encodeURIComponent(img)}`)
  }

  return (
    <figure
      onClick={handleClick}
      className={cn(
        "relative w-80 cursor-pointer overflow-hidden rounded-xl border p-4 mx-3",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
        "transition-all duration-200 hover:scale-105"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="h-8 w-8 overflow-hidden rounded-full">
          <Image 
            className="object-cover" 
            width={32} 
            height={32} 
            alt={name} 
            src={img}
          />
        </div>
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-muted-foreground">
            {username}
          </p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-muted-foreground">
        {body}
      </blockquote>
    </figure>
  )
}

export function ReviewsMarquee() {
  return (
    <div className="relative flex h-[300px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background">
      <Marquee pauseOnHover className="[--duration:40s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:40s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background" />
    </div>
  )
}
