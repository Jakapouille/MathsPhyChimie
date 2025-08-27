// src/pages/admin/templates.jsx
import { useState, useEffect } from "react";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    const res = await fetch("/api/admin/templates");
    const data = await res.json();
    setTemplates(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl mb-6">Gestion des templates</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-700">
          <thead>
            <tr>
              <th className="border border-gray-700 p-2">ID</th>
              <th className="border border-gray-700 p-2">Type</th>
              <th className="border border-gray-700 p-2">Configuration</th>
              <th className="border border-gray-700 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t) => (
              <tr key={t.id}>
                <td className="border border-gray-700 p-2">{t.id}</td>
                <td className="border border-gray-700 p-2">{t.type}</td>
                <td className="border border-gray-700 p-2">{JSON.stringify(t.configuration)}</td>
                <td className="border border-gray-700 p-2">[Éditer] [Supprimer]</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
