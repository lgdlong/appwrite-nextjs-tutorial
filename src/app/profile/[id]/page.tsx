"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ShowProfileResponseDto } from "@/dto/user";

// Import components
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorAlert from "@/components/ui/ErrorAlert";
import ProfileHeader from "@/components/profile/ProfileHeader";
import UserStats from "@/components/profile/UserStats";
import RecentActivity from "@/components/profile/RecentActivity";

// Placeholder function to fetch user data - replace with your Appwrite client code later
async function fetchUserProfile(
  userId: string
): Promise<ShowProfileResponseDto> {
  // This is a placeholder. In a real app, you'd use your Appwrite client to fetch data
  return {
    userId,
    username: "johndoe",
    email: "john.doe@example.com",
    avatarUrl: "/anhsang/smaller-size.jpg",
    displayName: "John Doe",
    bio: "Full-stack developer passionate about web technologies and open source projects.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    socialLinks: {
      github: "https://github.com/johndoe",
      twitter: "https://twitter.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      website: "https://johndoe.dev",
    },
    preferences: {
      theme: "dark",
      emailNotifications: true,
    },
  };
}

export default function UserProfile() {
  const params = useParams();
  const userId = params?.id as string;
  const [profile, setProfile] = useState<ShowProfileResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This would be a check against the current logged-in user
  const isCurrentUser = userId === "current-user-id"; // Replace with actual check

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        const userProfile = await fetchUserProfile(userId);
        setProfile(userProfile);
        setError(null);
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (userId) {
      loadProfile();
    }
  }, [userId]);

  if (isLoading) {
    return <LoadingSpinner size="large" />;
  }
  if (error || !profile) {
    return (
      <ErrorAlert
        message={error || "User profile not found"}
        linkText="Go back to Home"
        linkHref="/"
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      {/* Header/Banner */}
      <div className="w-full h-32 bg-gradient-to-r from-blue-600 to-indigo-800"></div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto w-full px-4 -mt-16 z-10">
        {/* Profile Header */}
        <ProfileHeader profile={profile} isCurrentUser={isCurrentUser} />

        {/* Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Stats */}
          <UserStats profile={profile} />

          {/* User Projects/Posts */}
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
