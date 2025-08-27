// src/pages/dashboard.jsx
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    const res = await fetch("/api/dashboard");
    const data = await res.json();
    setDashboard(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-8 text-white">Chargement...</div>;

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl mb-6">Tableau de bord</h1>

      {dashboard.type === "STUDENT" ? (
        <div>
          <h2 className="text-xl mb-4">Suivi individuel</h2>
          <p>Exercices faits : {dashboard.completed}</p>
          <p>Exercices non faits : {dashboard.pending}</p>
          <p>Score moyen : {dashboard.avgScore}</p>
          <p>Temps moyen par exercice : {dashboard.avgTime}s</p>
          <p>Clics moyens : {dashboard.avgClicks}</p>
          <p>Daltonisme détecté : {dashboard.daltonisme ? "Oui" : "Non"}</p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl mb-4">Vue enseignant / administrateur</h2>
          <p>Nombre d'élèves : {dashboard.totalStudents}</p>
          <p>Exercices faits / non faits : {dashboard.completed} / {dashboard.pending}</p>
          <p>Score moyen : {dashboard.avgScore}</p>
          <p>Temps moyen : {dashboard.avgTime}s</p>
          <p>Scores faibles : {dashboard.lowScores.map(s => `${s.nom} ${s.prenom}`).join(", ") || "Aucun"}</p>
          <p>Daltonisme détecté : {dashboard.daltonismeStudents.map(s => `${s.nom} ${s.prenom}`).join(", ") || "Aucun"}</p>
        </div>
      )}
    </div>
  );
}
