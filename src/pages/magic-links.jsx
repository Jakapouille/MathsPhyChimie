// src/pages/magic-links.jsx
import { useEffect, useState } from "react";

export default function MagicLinksPage() {
  const [groups, setGroups] = useState([]);
  const [links, setLinks] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    const res = await fetch("/api/magic-links");
    const data = await res.json();
    setGroups(data.groups);
    setLinks(data.links);
    setLoading(false);
  };

  const generateLinks = async () => {
    const res = await fetch("/api/magic-links", { method: "POST" });
    const data = await res.json();
    setLinks(data);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  if (loading) return <div className="p-8 text-white">Chargement...</div>;

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl mb-4">Liens magiques par groupe</h1>
      <button
        onClick={generateLinks}
        className="p-2 bg-blue-600 rounded mb-4"
      >
        Générer nouveaux liens
      </button>
      {groups.map((group) => (
        <div key={group.id} className="mb-4 p-2 border border-gray-700 rounded">
          <h2 className="font-bold">{group.name}</h2>
          <p className="break-all">{links[group.id]}</p>
        </div>
      ))}
    </div>
  );
}
