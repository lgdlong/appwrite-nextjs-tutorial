// src/components/profile/ProfileForm.tsx
"use client";

import React, { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import { ShowProfileResponseDto } from "@/dto/user";

interface ProfileFormProps {
  profileData: Partial<ShowProfileResponseDto>;
  handleChange: (field: string, value: string) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  isSaving: boolean;
  error: string | null;
}

export default function ProfileForm({
  profileData,
  handleChange,
  handleSubmit,
  isSaving,
  error,
}: ProfileFormProps) {
  const router = useRouter();

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1e1e1e] rounded-lg shadow-xl border border-[#333333] p-6 space-y-6"
    >
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* BỔ SUNG value và onChange */}
      <FormInput
        id="displayName"
        label="Display Name"
        type="text"
        placeholder="Your display name"
        value={profileData.displayName || ""}
        onChange={(e) => handleChange("displayName", e.target.value)}
      />

      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Bio
        </label>
        <textarea
          id="bio"
          className="w-full px-3 py-2 bg-[#2d2d2d] border border-[#404040] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
          rows={4}
          placeholder="Tell something about yourself"
          value={profileData.bio || ""}
          onChange={(e) => handleChange("bio", e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Social Links</h3>

        <FormInput
          id="github"
          label="GitHub URL"
          type="url"
          placeholder="https://github.com/yourusername"
          value={profileData.socialLinks?.github || ""}
          onChange={(e) => handleChange("socialLinks.github", e.target.value)}
        />

        <FormInput
          id="twitter"
          label="Twitter URL"
          type="url"
          placeholder="https://twitter.com/yourusername"
          value={profileData.socialLinks?.twitter || ""}
          onChange={(e) => handleChange("socialLinks.twitter", e.target.value)}
        />

        <FormInput
          id="linkedin"
          label="LinkedIn URL"
          type="url"
          value={profileData.socialLinks?.linkedin || ""}
          placeholder="https://linkedin.com/in/yourusername"
          onChange={(e) => handleChange("socialLinks.linkedin", e.target.value)}
        />

        <FormInput
          id="website"
          label="Personal Website"
          type="url"
          value={profileData.socialLinks?.website || ""}
          placeholder="https://yourwebsite.com"
          onChange={(e) => handleChange("socialLinks.website", e.target.value)}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          className={isSaving ? "opacity-70 cursor-not-allowed" : ""}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-[#1e1e1e]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
