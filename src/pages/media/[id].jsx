// src/pages/media/[id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function MediaPage() {
  const router = useRouter();
  const { id } = router.query;
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMedia = async () => {
    const res = await fetch(`/api/media/${id}`);
    if (res.status === 403) router.push("/login");
    const data = await res.json();
    setMedia(data);
    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchMedia();
  }, [id]);

  if (loading) return <div className="p-8 text-white">Chargement...</div>;

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl mb-4">{media.title}</h1>
      {media.type === "video" ? (
        <video controls className="w-full mt-4">
          <source src={media.url} type="video/mp4" />
        </video>
      ) : (
        <img src={media.url} alt={media.title} className="mt-4 w-full" />
      )}
    </div>
  );
}
