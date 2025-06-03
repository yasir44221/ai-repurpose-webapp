import React, { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState("");
  const [format, setFormat] = useState("Twitter thread");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const formats = [
    "Twitter thread",
    "LinkedIn post",
    "Instagram caption",
    "TikTok script",
    "YouTube short intro"
  ];

  const handleRepurpose = async () => {
    setLoading(true);
    setResult("");
    try {
      const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-base", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_TOKEN}`
        },
        body: JSON.stringify({
          inputs: `Repurpose this content into a ${format}:\n\n${content}`
        })
      });

      const data = await response.json();
      setResult(data[0]?.generated_text || "No response from model.");
    } catch (err) {
      setResult("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>🎯 Free AI Content Repurposer</h1>
      <textarea
        rows={6}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Paste your blog, idea, or video script here..."
        style={{ width: '100%', padding: 10, marginTop: 10, marginBottom: 10 }}
      />

      <select value={format} onChange={e => setFormat(e.target.value)} style={{ padding: 10, marginBottom: 10 }}>
        {formats.map(f => <option key={f} value={f}>{f}</option>)}
      </select>

      <button onClick={handleRepurpose} disabled={loading} style={{ display: 'block', width: '100%', padding: 10, backgroundColor: '#000', color: '#fff' }}>
        {loading ? "Generating..." : "Repurpose Content"}
      </button>

      {result && (
        <div style={{ marginTop: 20, padding: 10, backgroundColor: '#f3f3f3', borderRadius: 10 }}>
          <h2>🎉 Result:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}