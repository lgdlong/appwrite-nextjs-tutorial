import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShowProfileResponseDto } from "@/dto/user";

interface ProfileHeaderProps {
  profile: ShowProfileResponseDto;
  isCurrentUser?: boolean;
}

export default function ProfileHeader({
  profile,
  isCurrentUser = false,
}: ProfileHeaderProps) {
  return (
    <div className="bg-[#1e1e1e] rounded-lg shadow-xl border border-[#333333] p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="relative">
          <div className="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden border-4 border-[#1e1e1e]">
            <Image
              src={
                profile.avatarUrl ||
                `/anhsang/smaller-size.jpg`
              }
              alt={profile.username}
              width={128}
              height={128}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {profile.displayName || profile.username}
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            @{profile.username}
          </p>
          <p className="mt-2 text-gray-300">
            {profile.bio || "No bio provided"}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
            {profile.socialLinks?.github && (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2d2d2d] hover:bg-[#333] px-3 py-1 rounded-full text-sm text-white"
              >
                GitHub
              </a>
            )}
            {profile.socialLinks?.twitter && (
              <a
                href={profile.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2d2d2d] hover:bg-[#333] px-3 py-1 rounded-full text-sm text-white"
              >
                Twitter
              </a>
            )}
            {profile.socialLinks?.linkedin && (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2d2d2d] hover:bg-[#333] px-3 py-1 rounded-full text-sm text-white"
              >
                LinkedIn
              </a>
            )}
            {profile.socialLinks?.website && (
              <a
                href={profile.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2d2d2d] hover:bg-[#333] px-3 py-1 rounded-full text-sm text-white"
              >
                Website
              </a>
            )}
          </div>
        </div>

        {/* Edit button - show only if viewing own profile */}
        {isCurrentUser && (
          <Link href="/profile/edit">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
              Edit Profile
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
