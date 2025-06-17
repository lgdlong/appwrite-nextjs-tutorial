import React from "react";
import Link from "next/link";

// You can extend this interface with actual activity data in the future
interface ActivityItem {
  id: string;
  title: string;
  description: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
  isLoading?: boolean;
}

export default function RecentActivity({
  activities = [],
  isLoading = false,
}: RecentActivityProps) {
  // Placeholder activities if none provided
  const displayActivities =
    activities.length > 0
      ? activities
      : [
          {
            id: "1",
            title: "Sample Project 1",
            description: "This is a placeholder for user projects or posts.",
          },
          {
            id: "2",
            title: "Sample Project 2",
            description: "This is a placeholder for user projects or posts.",
          },
          {
            id: "3",
            title: "Sample Project 3",
            description: "This is a placeholder for user projects or posts.",
          },
        ];

  return (
    <div className="md:col-span-2 bg-[#1e1e1e] rounded-lg shadow-md border border-[#333333] p-6">
      <h2 className="text-xl font-bold mb-4 text-white">Recent Activity</h2>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayActivities.map((item) => (
              <div
                key={item.id}
                className="border-b border-[#333333] pb-4 last:border-0"
              >
                <h3 className="font-medium text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link href="#" className="text-blue-400 hover:underline text-sm">
              View All Activity
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
