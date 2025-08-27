// src/pages/course/[id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function CoursePage() {
  const router = useRouter();
  const { id } = router.query;
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCourse = async () => {
    const res = await fetch(`/api/course/${id}`);
    if (res.status === 403) router.push("/login");
    const data = await res.json();
    setCourse(data);
    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchCourse();
  }, [id]);

  if (loading) return <div className="p-8 text-white">Chargement...</div>;

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl mb-4">{course.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: course.content }} />
      {course.videoUrl && (
        <video controls className="w-full mt-4">
          <source src={course.videoUrl} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
