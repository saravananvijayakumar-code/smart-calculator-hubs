import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import backend from "~backend/client";

export default function ShortUrlRedirect() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [error, setError] = useState("");

  useEffect(() => {
    const redirect = async () => {
      if (!shortCode) {
        setError("Invalid short code");
        return;
      }

      try {
        const result = await backend.web.getShortUrl({ shortCode });
        window.location.href = result.url;
      } catch (err: any) {
        console.error("Redirect failed:", err);
        setError("Short URL not found");
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      }
    };

    redirect();
  }, [shortCode]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
}
