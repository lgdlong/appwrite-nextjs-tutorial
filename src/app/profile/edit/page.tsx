"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ShowProfileResponseDto } from "@/dto/user";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorAlert from "@/components/ui/ErrorAlert";
import ProfileForm from "@/components/profile/ProfileForm";

// Placeholder function - replace with your Appwrite client code
async function fetchCurrentUserProfile(): Promise<ShowProfileResponseDto> {
  // This is a placeholder. In a real app, you'd use your Appwrite client to fetch data
  return {
    userId: "current-user-id",
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

// Placeholder function - replace with your Appwrite client code
async function updateUserProfile(
  profileData: Partial<ShowProfileResponseDto>
): Promise<boolean> {
  console.log("Update profile with data:", profileData);
  // Simulate successful API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return true;
}

export default function EditProfile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<
    Partial<ShowProfileResponseDto>
  >({
    displayName: "",
    bio: "",
    socialLinks: {
      github: "",
      twitter: "",
      linkedin: "",
      website: "",
    },
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        const profile = await fetchCurrentUserProfile();
        setProfileData({
          userId: profile.userId,
          displayName: profile.displayName || "",
          bio: profile.bio || "",
          socialLinks: {
            github: profile.socialLinks?.github || "",
            twitter: profile.socialLinks?.twitter || "",
            linkedin: profile.socialLinks?.linkedin || "",
            website: profile.socialLinks?.website || "",
          },
        });
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleChange = (field: string, value: string) => {
    if (field.includes(".")) {
      // Handle nested fields like socialLinks.github
      const [parent, child] = field.split(".");
      setProfileData((prev) => {
        // Create a proper copy of the nested object
        const parentObject =
          (prev[parent as keyof typeof prev] as Record<
            string,
            string | number | boolean | undefined
          >) || {};

        return {
          ...prev,
          [parent]: {
            ...parentObject,
            [child]: value,
          },
        };
      });
    } else {
      setProfileData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      setError(null);

      const success = await updateUserProfile(profileData);

      if (success) {
        // Redirect to the view profile page
        router.push(`/profile/${profileData.userId || "current-user-id"}`);
      } else {
        setError("Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred while saving your profile");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="large" />;
  }

  if (error && !profileData) {
    return (
      <ErrorAlert
        message="Failed to load profile"
        linkText="Go back"
        linkHref="/profile"
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Edit Your Profile</h1>

      <ProfileForm
        profileData={profileData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isSaving={isSaving}
        error={error}
      />
    </div>
  );
}
