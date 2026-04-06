"use client";

import { useState, useEffect, useCallback } from "react";

export const dynamic = "force-dynamic";

interface Client {
  id: string;
  name: string;
  email: string;
  apiKey: string;
  createdAt: string;
  _count: { audits: number };
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const headers = useCallback(
    () => ({ Authorization: `Bearer ${secret}`, "Content-Type": "application/json" }),
    [secret]
  );

  const fetchClients = useCallback(async () => {
    const res = await fetch("/api/admin/clients", { headers: headers() });
    if (!res.ok) {
      setAuthenticated(false);
      setError("Invalid admin secret");
      return;
    }
    setClients(await res.json());
    setError("");
  }, [headers]);

  useEffect(() => {
    if (authenticated) fetchClients();
  }, [authenticated, fetchClients]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/clients", {
      headers: { Authorization: `Bearer ${secret}` },
    });
    if (res.ok) {
      setAuthenticated(true);
      setClients(await res.json());
    } else {
      setError("Invalid admin secret");
    }
  }

  async function createClient(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/clients", {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name: "", email: "", password: "" });
      setShowForm(false);
      await fetchClients();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create client");
    }
    setLoading(false);
  }

  async function deleteClient(id: string, name: string) {
    if (!confirm(`Delete client "${name}" and all their data?`)) return;
    await fetch(`/api/admin/clients?id=${id}`, { method: "DELETE", headers: headers() });
    await fetchClients();
  }

  function copyKey(key: string) {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
              A
            </div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="mt-1 text-sm text-muted">Enter admin secret to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Admin secret"
              className="w-full rounded-lg border border-card-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Client Management</h1>
            <p className="text-sm text-muted">{clients.length} client(s)</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            {showForm ? "Cancel" : "+ New Client"}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        {showForm && (
          <form onSubmit={createClient} className="mb-8 rounded-xl border border-card-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Create New Client</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <input
                placeholder="Company name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="rounded-lg border border-card-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="rounded-lg border border-card-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="rounded-lg border border-card-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Client"}
            </button>
          </form>
        )}

        <div className="space-y-3">
          {clients.map((c) => (
            <div key={c.id} className="rounded-xl border border-card-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-sm text-muted">{c.email}</p>
                  <p className="mt-1 text-xs text-muted">
                    {c._count.audits} audit(s) · Created{" "}
                    {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteClient(c.id, c.name)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-background px-3 py-2">
                <span className="text-xs text-muted">API Key:</span>
                <code className="flex-1 text-xs font-mono">{c.apiKey}</code>
                <button
                  onClick={() => copyKey(c.apiKey)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {copiedKey === c.apiKey ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          ))}

          {clients.length === 0 && (
            <div className="rounded-xl border border-dashed border-card-border p-12 text-center text-sm text-muted">
              No clients yet. Create one to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
