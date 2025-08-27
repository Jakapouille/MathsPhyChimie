// src/pages/admin/academic-years.jsx
import { useState, useEffect } from "react";

export default function AcademicYearsPage() {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchYears = async () => {
    const res = await fetch("/api/admin/academic-years");
    const data = await res.json();
    setYears(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchYears();
  }, []);

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl mb-6">Gestion des années scolaires</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-700">
          <thead>
            <tr>
              <th className="border border-gray-700 p-2">ID</th>
              <th className="border border-gray-700 p-2">Nom</th>
              <th className="border border-gray-700 p-2">Active</th>
              <th className="border border-gray-700 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {years.map((y) => (
              <tr key={y.id}>
                <td className="border border-gray-700 p-2">{y.id}</td>
                <td className="border border-gray-700 p-2">{y.name}</td>
                <td className="border border-gray-700 p-2">{y.active ? "Oui" : "Non"}</td>
                <td className="border border-gray-700 p-2">[Éditer] [Supprimer]</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
