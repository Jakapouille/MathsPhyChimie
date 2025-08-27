// src/pages/test/[type].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function TestPage() {
  const router = useRouter();
  const { type } = router.query;
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [clicks, setClicks] = useState(0);

  const fetchTest = async () => {
    const res = await fetch(`/api/test/${type}`);
    if (res.status === 403) router.push("/login");
    const data = await res.json();
    setTest(data);
    setLoading(false);
    setStartTime(Date.now());
  };

  useEffect(() => {
    if (type) fetchTest();
  }, [type]);

  const handleClick = () => setClicks((c) => c + 1);

  const submitTest = async (answers) => {
    const duration = Date.now() - startTime;
    await fetch(`/api/test/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, duration, clicks }),
    });
    router.push("/dashboard");
  };

  if (loading) return <div className="p-8 text-white">Chargement...</div>;

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl mb-4">{test.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: test.content }} />
      <button
        className="mt-4 p-2 bg-blue-600 rounded"
        onClick={handleClick}
      >
        Cliquez ici pour continuer
      </button>
      <button
        className="mt-4 ml-4 p-2 bg-green-600 rounded"
        onClick={() => submitTest({})}
      >
        Terminer test
      </button>
    </div>
  );
}
