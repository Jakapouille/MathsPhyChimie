// Exemple d'intégration dans la page d'exercice
// src/pages/exercise/[id].jsx
import { PrismaClient } from "@prisma/client";
import ExerciseTemplate from "@/components/ExerciseTemplate";

const prisma = new PrismaClient();

export async function getServerSideProps(context) {
  const { id } = context.params;
  const exercise = await prisma.exercise.findUnique({
    where: { id: parseInt(id) },
    include: { template: true },
  });

  return { props: { exercise } };
}

export default function ExercisePage({ exercise }) {
  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <ExerciseTemplate template={exercise.template} exerciseId={exercise.id} />
    </div>
  );
}
