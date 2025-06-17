import React from "react";
import { ShowProfileResponseDto } from "@/dto/user";

interface UserStatsProps {
  profile: ShowProfileResponseDto;
}

export default function UserStats({ profile }: UserStatsProps) {
  return (
    <div className="bg-[#1e1e1e] rounded-lg shadow-md border border-[#333333] p-6">
      <h2 className="text-xl font-bold mb-4 text-white">User Stats</h2>
      <div className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm">Member since</p>
          <p className="text-white">
            {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Email</p>
          <p className="text-white">{profile.email}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Last updated</p>
          <p className="text-white">
            {new Date(profile.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
