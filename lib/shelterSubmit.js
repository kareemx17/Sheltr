const uploadShelter = async (shelter) => {
  console.log(shelter);

  const baseUrl =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      : "";

  try {
    const res = await fetch(`${baseUrl}/api/upload-shelters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shelter),
    });

    if (!res.ok) {
      throw new Error("Failed to upload shelter");
    }

    const data = await res.json();
    console.log("Shelter uploaded:", data);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};

export default uploadShelter;
