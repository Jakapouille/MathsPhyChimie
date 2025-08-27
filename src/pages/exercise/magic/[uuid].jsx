// src/pages/exercise/magic/[uuid].jsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function MagicExercisePage() {
  const router = useRouter();
  const { uuid } = router.query;

  useEffect(() => {
    if (!uuid) return;

    const cookieName = `magic_${uuid}`;
    const existing = Cookies.get(cookieName);

    const registerAccess = async () => {
      const res = await fetch(`/api/exercise/magic/${uuid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cookieExists: !!existing }),
      });
      const data = await res.json();
      Cookies.set(cookieName, data.accessId, { expires: 7 });
      router.push(`/exercise/${data.exerciseId}`);
    };

    registerAccess();
  }, [uuid]);

  return <div className="p-8 text-white bg-gray-900 min-h-screen">Redirection...</div>;
}
