// src/pages/admin/groups.jsx
import { useState, useEffect } from "react";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    const res = await fetch("/api/admin/groups");
    const data = await res.json();
    setGroups(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl mb-6">Gestion des groupes</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-700">
          <thead>
            <tr>
              <th className="border border-gray-700 p-2">ID</th>
              <th className="border border-gray-700 p-2">Nom du groupe</th>
              <th className="border border-gray-700 p-2">Année scolaire</th>
              <th className="border border-gray-700 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g.id}>
                <td className="border border-gray-700 p-2">{g.id}</td>
                <td className="border border-gray-700 p-2">{g.name}</td>
                <td className="border border-gray-700 p-2">{g.academicYear.name}</td>
                <td className="border border-gray-700 p-2">[Éditer] [Supprimer]</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
