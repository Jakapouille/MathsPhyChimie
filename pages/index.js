import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  // Charger l'utilisateur courant pour filtrer les liens selon le rôle
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/me"); // route API qui renvoie l'utilisateur connecté
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCurrentUser();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Liens principaux selon rôle
  const menuItems = [
    { label: "Dashboard", path: "/dashboard", roles: ["student", "teacher", "admin"] },
    { label: "Cours", path: "/courses", roles: ["student", "teacher", "admin"] },
    { label: "Exercices", path: "/exercises", roles: ["student", "teacher", "admin"] },
    { label: "Exercices journaliers", path: "/daily-exercise", roles: ["student", "teacher", "admin"] },
    { label: "Tests début d'année", path: "/initial-tests", roles: ["student", "teacher", "admin"] },
    { label: "Utilisateurs", path: "/users", roles: ["teacher", "admin"] },
    { label: "Groupes et années", path: "/groups", roles: ["teacher", "admin"] },
    { label: "Templates", path: "/templates", roles: ["teacher", "admin"] },
    { label: "Médias / Vidéos", path: "/media", roles: ["teacher", "admin"] },
    { label: "Liens magiques", path: "/magic-links", roles: ["teacher", "admin"] },
  ];

  return (
    <div className="p-4 min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl mb-6">Bienvenue au site éducatif</h1>

      {currentUser && (
        <div className="mb-6">
          <p className="mb-2">
            Connecté en tant que : <strong>{currentUser.firstName} {currentUser.lastName}</strong> ({currentUser.role})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {menuItems
              .filter(item => item.roles.includes(currentUser.role))
              .map(item => (
                <button
                  key={item.path}
                  className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => router.push(item.path)}
                >
                  {item.label}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Section enseignants : liste des utilisateurs */}
      {currentUser && (currentUser.role === "teacher" || currentUser.role === "admin") && (
        <div className="mt-8">
          <button className="bg-green-600 px-4 py-2 rounded mr-2" onClick={loadUsers}>
            Recharger utilisateurs
          </button>
          <ul className="mt-4 space-y-2">
            {users.map(u => (
              <li key={u.id} className="bg-gray-800 p-2 rounded">
                {u.firstName} {u.lastName} – {u.role} – {u.group?.name || "-"} ({u.academicYear?.name || "-"})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
