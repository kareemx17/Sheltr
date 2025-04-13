import Image from "next/image";
import GoogleMap from "@/components/GoogleMap";
import Info from "@/components/Info";
import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="h-[calc(100vh-4rem)] w-full bg-[#D8E3EB]">
      <div className="flex w-full h-full">
        {/* Left half - Google Map */}
        <div className="w-1/2 h-full">
          <GoogleMap />
        </div>

        <div className="w-1/2 h-full">
          <Info />
        </div>

      </div>
    </main>
  );
}
