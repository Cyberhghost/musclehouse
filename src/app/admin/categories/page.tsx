'use client';
import { useEffect, useState, useRef } from 'react';
import { adminFetch } from '@/lib/admin-fetch';

interface Category {
  id: string;
  name: string;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}

const EMPTY_FORM = {
  name: '',
  imageUrl: '',
  displayOrder: '0',
  isActive: true,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      const res = await adminFetch('/api/categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data.sort((a: Category, b: Category) => a.displayOrder - b.displayOrder) : []);
    } catch {
      setError('Erreur de chargement.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({
      name: c.name,
      imageUrl: c.imageUrl ?? '',
      displayOrder: String(c.displayOrder),
      isActive: c.isActive,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin-token') : '';
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const data = await res.json();
      if (data.url) setForm(f => ({ ...f, imageUrl: data.url }));
      else setFormError('Erreur upload image.');
    } catch {
      setFormError('Erreur upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setFormError('Le nom est requis.'); return; }
    setSaving(true);
    setFormError('');
    const body = {
      name: form.name.trim(),
      imageUrl: form.imageUrl || null,
      displayOrder: Number(form.displayOrder) || 0,
      isActive: form.isActive,
    };
    try {
      const res = editing
        ? await adminFetch(`/api/categories/${editing.id}`, { method: 'PUT', body: JSON.stringify(body) })
        : await adminFetch('/api/categories', { method: 'POST', body: JSON.stringify(body) });
      if (!res.ok) {
        const d = await res.json();
        setFormError(d.error || 'Erreur lors de la sauvegarde.');
      } else {
        setModalOpen(false);
        await load();
      }
    } catch {
      setFormError('Erreur réseau.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer la catégorie "${name}" ?`)) return;
    try {
      await adminFetch(`/api/categories/${id}`, { method: 'DELETE' });
      await load();
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  const handleToggleActive = async (c: Category) => {
    try {
      await adminFetch(`/api/categories/${c.id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !c.isActive }),
      });
      await load();
    } catch {
      alert('Erreur.');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Chargement...</div>;
  if (error) return <div className="text-red-400 p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Catégories</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm font-medium transition-colors">
          + Ajouter une Catégorie
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Image</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Nom</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Ordre</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Actif</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {categories.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">Aucune catégorie</td></tr>
              )}
              {categories.map(c => (
                <tr key={c.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3">
                    {c.imageUrl
                      ? <img src={c.imageUrl} alt={c.name} className="w-12 h-12 object-cover rounded-lg" />
                      : <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 text-lg">📁</div>}
                  </td>
                  <td className="px-4 py-3 text-white font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-gray-300">{c.displayOrder}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(c)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${c.isActive ? 'bg-orange-500' : 'bg-gray-600'}`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${c.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded text-xs transition-colors">Modifier</button>
                      <button onClick={() => handleDelete(c.id, c.name)} className="px-3 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded text-xs transition-colors">Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{editing ? 'Modifier la Catégorie' : 'Ajouter une Catégorie'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {formError && <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">{formError}</div>}
              <div>
                <label className="block text-sm text-gray-300 mb-1">Nom *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Image</label>
                <div className="flex gap-2 items-center">
                  <input type="text" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="URL ou uploader" className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm text-gray-200 disabled:opacity-50 transition-colors whitespace-nowrap">
                    {uploading ? 'Upload...' : 'Choisir'}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </div>
                {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-2 h-16 w-16 object-cover rounded-lg" />}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Ordre d&apos;affichage</label>
                <input type="number" min="0" value={form.displayOrder} onChange={e => setForm(f => ({ ...f, displayOrder: e.target.value }))} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="accent-orange-500" />
                Actif
              </label>
            </div>
            <div className="p-6 border-t border-gray-700 flex gap-3 justify-end">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors">
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
