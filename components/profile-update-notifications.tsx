"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/ui/animated-list";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ProfileUpdate {
  name: string;
  time: string;
  avatarUrl: string;
}

const MOCK_PROFILES = [
  { name: "Gangster Cat", avatarUrl: "/gangster.png" },
  { name: "Funky Cat", avatarUrl: "/funky.png" },
  { name: "Lofi Cat", avatarUrl: "/lofi.png" },
  { name: "Metal Cat", avatarUrl: "/metal.png" },
];

const Notification = ({ name, time, avatarUrl }: ProfileUpdate) => {
  return (
    <figure
      className={cn(
        "relative w-full max-w-[300px] cursor-pointer overflow-hidden rounded-2xl p-3",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-white/80 backdrop-blur-sm [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "dark:bg-gray-950/50 dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 overflow-hidden">
          <Image 
            src={avatarUrl} 
            alt={name} 
            width={32} 
            height={32}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{name}</span>
            <span className="text-xs text-muted-foreground">{time}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Updated their profile picture
          </p>
        </div>
      </div>
    </figure>
  );
};

export function ProfileUpdateNotifications() {
  const [updates, setUpdates] = useState<ProfileUpdate[]>([
    {
      ...MOCK_PROFILES[0],
      time: "Just now",
    },
  ]);

  const [lastProfileIndex, setLastProfileIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastProfileIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % MOCK_PROFILES.length;
        
        setUpdates((prev) => {
          const newUpdate = {
            ...MOCK_PROFILES[nextIndex],
            time: "Just now",
          };
          
          const updatedPrevious = prev.map((update, index) => ({
            ...update,
            time: getTimeString(index + 1)
          }));
          
          return [newUpdate, ...updatedPrevious].slice(0, 12);
        });

        return nextIndex;
      });
    }, 12000);

    return () => clearInterval(interval);
  }, []);

    const getTimeString = (minutesAgo: number) => {
      if (minutesAgo === 0) return "Just now";
      if (minutesAgo === 1) return "1 min ago";
      if (minutesAgo < 60) return `${minutesAgo} mins ago`;
      const hours = Math.floor(minutesAgo / 60);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    };

  console.log("Rendering notifications, count:", updates.length);

  return (
    <div className={cn(
      "fixed right-4 top-4 z-[9999] w-[320px]",
      "hidden md:block"
    )}>
      <AnimatedList>
        {updates.map((update, idx) => (
          <Notification key={idx} {...update} />
        ))}
      </AnimatedList>
    </div>
  );
}
