"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const hideLayout = ["/login", "/signup", "/"].includes(pathname);

  return (
    <>
      {!hideLayout && <Header />}
      <div className="flex">
        {!hideLayout && <Sidebar />}
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
