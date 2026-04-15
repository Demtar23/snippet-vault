"use client";

import { useEffect, useState, useCallback } from "react";
import {
  createSnippet,
  CreateSnippetPayload,
  deleteSnippet,
  getSnippets,
  Snippet,
  SnippetType,
  updateSnippet,
} from "./lib/api";
import SnippetForm from "./components/SnippetForm";

export default function Home() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // pagination
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // filters
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedTag, setAppliedTag] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editType, setEditType] = useState<SnippetType>("note");

  const fetchSnippets = useCallback(
    async (currentPage: number, q: string, t: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await getSnippets({
          page: currentPage,
          limit: 10,
          q,
          tag: t,
        });
        setSnippets(res.data);
        setPages(res.pages);
        setTotal(res.total);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load snippets");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchSnippets(page, appliedSearch, appliedTag);
  }, [page, appliedSearch, appliedTag, fetchSnippets]);

  const applyFilters = () => {
    setPage(1);
    setAppliedSearch(search);
    setAppliedTag(tag);
  };

  const handleCreate = async (payload: CreateSnippetPayload) => {
    await createSnippet(payload);

    await fetchSnippets(1, "", "");
    // refresh list from start
    setPage(1);
    setAppliedSearch("");
    setAppliedTag("");
    setSearch("");
    setTag("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this snippet?")) return;
    try {
      await deleteSnippet(id);
      setSnippets((prev) => prev.filter((s) => s._id !== id));
      setTotal((prev) => prev - 1);
    } catch {
      alert("Failed to delete snippet");
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const updated = await updateSnippet(id, {
        title: editTitle,
        content: editContent,
        type: editType,
      });

      setSnippets((prev) => prev.map((s) => (s._id === id ? updated : s)));

      setEditingId(null);
    } catch {
      alert("Failed to update snippet");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Snippet Vault</h1>
        <p className="text-gray-500 mt-1">
          Your personal collection of links, notes and commands
        </p>
      </div>

      {/* Create form */}
      <div className="border border-gray-200 rounded-lg p-4 mb-8 bg-white shadow-sm">
        <h2 className="font-semibold text-gray-700 mb-3">New Snippet</h2>
        <SnippetForm onSubmit={handleCreate} submitLabel="Create Snippet" />
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2 mb-6">
        <input
          className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by title or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
        />
        <input
          className="border border-gray-300 rounded px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
        />
        <button
          onClick={applyFilters}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition-colors"
        >
          Search
        </button>
        {(appliedSearch || appliedTag) && (
          <button
            onClick={() => {
              setSearch("");
              setTag("");
              setAppliedSearch("");
              setAppliedTag("");
              setPage(1);
            }}
            className="text-sm px-3 py-2 rounded border border-gray-300 hover:bg-gray-50 text-gray-600 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results count */}
      {!loading && !error && (
        <p className="text-xs text-gray-400 mb-4">
          {total} snippet{total !== 1 ? "s" : ""}
          {appliedSearch && ` matching "${appliedSearch}"`}
          {appliedTag && ` with tag "${appliedTag}"`}
        </p>
      )}

      {/* States */}
      {loading && (
        <div className="text-center py-16 text-gray-400">
          <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-3" />
          <p className="text-sm">Loading snippets...</p>
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-16">
          <p className="text-red-500 text-sm mb-3">{error}</p>
          <button
            onClick={() => fetchSnippets(page, appliedSearch, appliedTag)}
            className="text-sm text-blue-500 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && snippets.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm">No snippets found</p>
        </div>
      )}

      {/* List */}
      {!loading && !error && snippets.length > 0 && (
        <>
          <div className="space-y-3">
            {snippets.map((s) => (
              <div key={s._id} className="border p-3 rounded bg-white">
                {editingId === s._id ? (
                  <>
                    <input
                      className="border p-1 w-full mb-2 text-black placeholder:text-gray-700"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />

                    <select
                      className="border p-1 w-full mb-2 text-black"
                      value={editType}
                      onChange={(e) => setEditType(e.target.value as SnippetType)}
                    >
                      <option value="note">note</option>
                      <option value="link">link</option>
                      <option value="command">command</option>
                    </select>

                    <input
                      className="border p-1 w-full mb-2 text-black placeholder:text-gray-700"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />

                    <button
                      onClick={() => handleUpdate(s._id)}
                      className="bg-green-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="font-semibold text-gray-900">{s.title}</h2>
                    <p className="text-sm text-gray-600">{s.content}</p>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      {s.type}
                    </span>

                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="text-red-500 text-sm"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() => {
                          setEditingId(s._id);
                          setEditTitle(s.title);
                          setEditContent(s.content);
                        }}
                        className="text-blue-500 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-500">
                {page} / {pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
