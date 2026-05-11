import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Plus, Pencil, Trash2, ChevronLeft } from 'lucide-react';
import RoleGuard from '../components/auth/RoleGuard_Preetam';
import { ROLES } from '../utils/constants_Preetam';
import { eventApi } from '../api/eventApi_Nikhil';
import { adminApi } from '../api/adminApi_Nikhil';
import Button from '../components/shared/Button_Preetam';
import LoadingSpinner from '../components/shared/LoadingSpinner_Pratham';
import { useToastStore } from '../components/shared/Toast_Sasi';
import { getApiErrorMessage } from '../utils/apiError_Pratham';

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

function parseCategories(body: unknown): CategoryRow[] {
  if (!body || typeof body !== 'object') return [];
  const root = body as Record<string, unknown>;
  const inner = root.data;
  if (Array.isArray(inner)) return inner as CategoryRow[];
  return [];
}

const AdminCategoriesPage: React.FC = () => {
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await eventApi.getCategories();
      setRows(parseCategories(res));
    } catch (err) {
      useToastStore.getState().addToast('error', getApiErrorMessage(err, 'Failed to load categories'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      await adminApi.createCategory({
        name: name.trim(),
        icon: icon.trim() || null,
      });
      useToastStore.getState().addToast('success', 'Category created');
      setName('');
      setIcon('');
      await load();
    } catch (err) {
      useToastStore.getState().addToast('error', getApiErrorMessage(err, 'Could not create'));
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (c: CategoryRow) => {
    setEditingId(c.id);
    setEditName(c.name);
    setEditIcon(c.icon ?? '');
  };

  const saveEdit = async () => {
    if (!editingId || !editName.trim()) return;
    setBusy(true);
    try {
      await adminApi.updateCategory(editingId, {
        name: editName.trim(),
        icon: editIcon.trim() || null,
      });
      useToastStore.getState().addToast('success', 'Category updated');
      setEditingId(null);
      await load();
    } catch (err) {
      useToastStore.getState().addToast('error', getApiErrorMessage(err, 'Could not update'));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (c: CategoryRow) => {
    if (
      !window.confirm(
        `Delete category "${c.name}"? Events using it will have the category cleared.`
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      await adminApi.deleteCategory(c.id);
      useToastStore.getState().addToast('success', 'Category deleted');
      await load();
    } catch (err) {
      useToastStore.getState().addToast('error', getApiErrorMessage(err, 'Could not delete'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <RoleGuard allowedRoles={[ROLES.ADMIN]} redirectTo="/">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/admin"
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
            <Layers className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-sm text-gray-500">
              Categories used for browsing and creating events.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleCreate}
          className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Plus className="h-4 w-4 text-orange-500" />
            Add category
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-500">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                placeholder="e.g. Technology"
              />
            </div>
            <div className="w-full sm:w-40">
              <label className="mb-1 block text-xs font-medium text-gray-500">Icon key</label>
              <input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                placeholder="optional"
              />
            </div>
            <Button type="submit" disabled={busy || !name.trim()}>
              Create
            </Button>
          </div>
        </form>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="px-4 py-3 font-semibold text-gray-600">Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Slug</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Icon</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((c) =>
                  editingId === c.id ? (
                    <tr key={c.id} className="bg-orange-50/30">
                      <td className="px-4 py-3" colSpan={2}>
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={editIcon}
                          onChange={(e) => setEditIcon(e.target.value)}
                          className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                          placeholder="icon"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button type="button" size="sm" onClick={saveEdit} disabled={busy}>
                          Save
                        </Button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="ml-2 text-xs text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={c.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                      <td className="px-4 py-3 text-gray-500">{c.slug}</td>
                      <td className="px-4 py-3 text-gray-500">{c.icon ?? '—'}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => startEdit(c)}
                          className="mr-2 inline-flex rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c)}
                          className="inline-flex rounded p-1.5 text-red-500 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RoleGuard>
  );
};

export default AdminCategoriesPage;
