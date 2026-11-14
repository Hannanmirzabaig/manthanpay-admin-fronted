"use client";

import useProfile from "./hooks/useProfile";
import ProfileHeader from "./components/ProfileHeader";
import PersonalInformation from "./components/PersonalInformation";

export default function ProfileFeature() {
  const { user, formattedRole } = useProfile();

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            View your personal and account information.
          </p>
        </div>

        <ProfileHeader user={user} formattedRole={formattedRole} />
        <PersonalInformation user={user} />
      </div>
    </div>
  );
}
