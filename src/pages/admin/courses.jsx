// src/pages/admin/courses.jsx
import { useState, useEffect } from "react";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    const res = await fetch("/api/admin/courses");
    const data = await res.json();
    setCourses(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl mb-6">Gestion des cours</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-700">
          <thead>
            <tr>
              <th className="border border-gray-700 p-2">ID</th>
              <th className="border border-gray-700 p-2">Titre</th>
              <th className="border border-gray-700 p-2">Type</th>
              <th className="border border-gray-700 p-2">Publié</th>
              <th className="border border-gray-700 p-2">Ordre</th>
              <th className="border border-gray-700 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id}>
                <td className="border border-gray-700 p-2">{c.id}</td>
                <td className="border border-gray-700 p-2">{c.title}</td>
                <td className="border border-gray-700 p-2">{c.type}</td>
                <td className="border border-gray-700 p-2">{c.published ? "Oui" : "Non"}</td>
                <td className="border border-gray-700 p-2">{c.order}</td>
                <td className="border border-gray-700 p-2">[Éditer] [Supprimer]</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
