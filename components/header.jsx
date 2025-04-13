"use client";

import { useUserStore } from "@/store/userStore";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Header = () => {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const router = useRouter();

  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) return;

        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });

    logout(); // Clear user from Zustand
    router.push("/login"); // Redirect to login
  };

  return (
    <header className="h-16 shadow-gray-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <a href="/dashboard" className="text-3xl font-bold drop-shadow-lg">
              <Image
                src="/logo.png"
                alt="Sheltr Logo"
                width={110}
                height={110}
                className="object-contain"
                priority
              />
            </a>
          </motion.div>

          {user ? (
            <div className="flex items-center space-x-4">
              <h2>Welcome {user.name}!</h2>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <h2>Loading...</h2>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
