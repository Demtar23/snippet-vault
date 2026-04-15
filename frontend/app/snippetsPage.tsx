"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreateSnippetPayload,
  deleteSnippet,
  getSnippet,
  Snippet,
  updateSnippet,
} from "./lib/api";
import SnippetForm from "./components/SnippetForm";

const TYPE_BADGE: Record<string, string> = {
  note: "bg-yellow-100 text-yellow-800",
  link: "bg-blue-100 text-blue-800",
  command: "bg-gray-100 text-gray-800",
};

const TYPE_ICON: Record<string, string> = {
  note: "📝",
  link: "🔗",
  command: "⌨️",
};

export default function SnippetPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!id) return;

    getSnippet(id)
      .then(setSnippet)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load snippet"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    getSnippet(id)
      .then(setSnippet)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load snippet"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (payload: CreateSnippetPayload) => {
    const updated = await updateSnippet(id, payload);
    setSnippet(updated);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this snippet?")) return;
    await deleteSnippet(id);
    router.push("/");
  };

  // --- States ---

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-400">
        <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-3" />
        <p className="text-sm">Loading...</p>
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-red-500 text-sm mb-4">
          {error ?? "Snippet not found"}
        </p>
        <Link href="/" className="text-blue-500 text-sm hover:underline">
          ← Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href="/"
        className="text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6 inline-block"
      >
        ← Back to Vault
      </Link>

      <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        {editing ? (
          <>
            <h2 className="font-semibold text-gray-700 mb-4">Edit Snippet</h2>
            <SnippetForm
              initial={snippet}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(false)}
              submitLabel="Save changes"
            />
          </>
        ) : (
          <>
            {/* Type badge */}
            <div className="mb-3">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  TYPE_BADGE[snippet.type] ?? "bg-gray-100 text-gray-700"
                }`}
              >
                {TYPE_ICON[snippet.type]} {snippet.type}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {snippet.title}
            </h1>

            {/* Content */}
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed mb-4">
              {snippet.content}
            </p>

            {/* Tags */}
            {snippet.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {snippet.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Dates */}
            <div className="text-xs text-gray-400 border-t border-gray-100 pt-4 mb-4 space-y-1">
              <p>Created: {new Date(snippet.createdAt).toLocaleString()}</p>
              <p>Updated: {new Date(snippet.updatedAt).toLocaleString()}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="text-sm px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-sm px-4 py-2 rounded bg-red-50 text-red-500 hover:bg-red-100 border border-red-200 transition-colors"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
