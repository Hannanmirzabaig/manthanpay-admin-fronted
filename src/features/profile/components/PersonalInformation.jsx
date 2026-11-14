import ProfileSection from "./ProfileSection";
import ProfileInfoItem from "./ProfileInfoItem";

export default function PersonalInformation({ user }) {
  return (
    <ProfileSection
      title="Personal Information"
      description="Your basic personal and contact details."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ProfileInfoItem label="Full Name" value={user.name} />
        <ProfileInfoItem label="User ID" value={user.id} />
        <ProfileInfoItem label="Email Address" value={user.email} />
        <ProfileInfoItem label="Mobile Number" value="" />
        <ProfileInfoItem label="Gender" value="" />
      </div>
    </ProfileSection>
  );
}
