'use client';
import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-fetch';

export default function ConfigLivraisonPage() {
  const [apiUrl, setApiUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [maskedKey, setMaskedKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  useEffect(() => {
    adminFetch('/api/delivery-config')
      .then(r => r.json())
      .then(data => {
        setApiUrl(data.apiUrl || '');
        setMaskedKey(data.apiKey || '');
      })
      .catch(() => setError('Erreur de chargement de la configuration.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const body: Record<string, string> = { apiUrl };
      if (apiKey && apiKey !== '***') body.apiKey = apiKey;
      const res = await adminFetch('/api/delivery-config', {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      if (res.ok) {
        showSuccess('Configuration sauvegardée.');
        setApiKey('');
        // Reload to get masked key
        const r2 = await adminFetch('/api/delivery-config');
        const d2 = await r2.json();
        setMaskedKey(d2.apiKey || '');
      } else {
        const d = await res.json();
        setError(d.error || 'Erreur lors de la sauvegarde.');
      }
    } catch {
      setError('Erreur réseau.');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!apiUrl) { setTestResult({ ok: false, message: "L'URL API est requise." }); return; }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(apiUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      setTestResult({ ok: res.ok, message: res.ok ? `Connexion réussie (HTTP ${res.status})` : `Erreur HTTP ${res.status}` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur de connexion';
      setTestResult({ ok: false, message: msg });
    } finally {
      setTesting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Chargement...</div>;

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold text-white">Configuration API Livraison</h1>

      {error && <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}
      {success && <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">{success}</div>}

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">URL de l&apos;API</label>
          <input
            type="url"
            value={apiUrl}
            onChange={e => setApiUrl(e.target.value)}
            placeholder="https://api.livraison.dz/v1"
            className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Clé API</label>
          {maskedKey && !apiKey && (
            <p className="text-xs text-gray-500 mb-1">Clé actuelle : <span className="font-mono text-gray-400">{maskedKey}</span></p>
          )}
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="Entrez une nouvelle clé pour remplacer l'existante"
            className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            autoComplete="new-password"
          />
        </div>

        {testResult && (
          <div className={`p-3 rounded-lg text-sm border ${testResult.ok ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-red-500/20 border-red-500/30 text-red-400'}`}>
            {testResult.ok ? '✅' : '❌'} {testResult.message}
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button
            onClick={handleTest}
            disabled={testing || !apiUrl}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-lg text-sm transition-colors"
          >
            {testing ? 'Test en cours...' : 'Tester la connexion'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
}
