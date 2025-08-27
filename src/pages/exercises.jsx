// src/pages/exercises.jsx
import { useState, useEffect } from "react";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExercises = async () => {
    const res = await fetch("/api/exercises");
    const data = await res.json();
    setExercises(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl mb-6">Mes Exercices</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <ul>
          {exercises.map((e) => (
            <li key={e.id} className="mb-4 p-4 border border-gray-700 rounded">
              <p><strong>{e.course.title}</strong> - {e.template.type}</p>
              <p>Statut: {e.completed ? "Terminé" : "À faire"}</p>
              <p>Score: {e.score ?? "N/A"}</p>
              <p>Temps passé: {e.timeSpent ?? 0} s</p>
              <a href={`/exercise/${e.id}`} className="text-blue-400 underline">Commencer / Reprendre</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
