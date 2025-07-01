"use client";

import { useState } from "react";

export default function TestHuggingFacePage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function testHuggingFace() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/huggingface-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt2",
          inputs: "Hello, world!",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Test Hugging Face Proxy</h1>
      <button
        onClick={testHuggingFace}
        className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Testing..." : "Test Hugging Face"}
      </button>
      {error && (
        <div className="mt-4 text-red-600 font-mono">Error: {error}</div>
      )}
      {result && (
        <pre className="mt-4 bg-white p-4 rounded-lg shadow max-w-xl overflow-x-auto text-xs text-gray-800">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
} 