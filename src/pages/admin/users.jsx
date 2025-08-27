// src/pages/admin/users.jsx
import { useState, useEffect } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl mb-6">Gestion des utilisateurs</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-700">
          <thead>
            <tr>
              <th className="border border-gray-700 p-2">ID</th>
              <th className="border border-gray-700 p-2">Prénom</th>
              <th className="border border-gray-700 p-2">Nom</th>
              <th className="border border-gray-700 p-2">Groupe</th>
              <th className="border border-gray-700 p-2">Année scolaire</th>
              <th className="border border-gray-700 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border border-gray-700 p-2">{u.id}</td>
                <td className="border border-gray-700 p-2">{u.firstName}</td>
                <td className="border border-gray-700 p-2">{u.lastName}</td>
                <td className="border border-gray-700 p-2">{u.group.name}</td>
                <td className="border border-gray-700 p-2">{u.academicYear.name}</td>
                <td className="border border-gray-700 p-2">[Éditer] [Supprimer]</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
