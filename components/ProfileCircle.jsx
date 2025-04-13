"use client";
import { useRouter } from "next/navigation";

const ProfileCircle = ({ user }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/profile");
  };  

  const initial = user?.name ? user.name[0].toUpperCase() : "?";
  return (
    <div
      className="w-10 h-10 rounded-full bg-[#93AEC5] flex items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
      {initial}
    </div>
  );
};

export default ProfileCircle;
