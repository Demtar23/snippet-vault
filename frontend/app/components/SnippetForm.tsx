"use client";
 
import { useState } from "react";
import { CreateSnippetPayload, Snippet, SnippetType } from "../lib/api";
 
type Props = {
  initial?: Partial<Snippet>;
  onSubmit: (payload: CreateSnippetPayload) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
};
 
type FormErrors = Partial<Record<"title" | "content" | "type", string>>;
 
export default function SnippetForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Create",
}: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [tags, setTags] = useState(initial?.tags?.join(", ") ?? "");
  const [type, setType] = useState<SnippetType>(initial?.type ?? "note");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
 
  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!title.trim()) next.title = "Title is required";
    if (!content.trim()) next.content = "Content is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };
 
  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setServerError(null);
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        type,
      });
      // reset if creating new
      if (!initial) {
        setTitle("");
        setContent("");
        setTags("");
        setType("note");
      }
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };
 
  return (
    <div className="space-y-3">
      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {serverError}
        </p>
      )}
 
      <div>
        <input
          className={`border rounded px-3 py-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-700 ${
            errors.title ? "border-red-400" : "border-gray-300"
          }`}
          placeholder="Title *"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
          }}
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
      </div>
 
      <div>
        <textarea
          className={`border rounded px-3 py-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder:text-gray-700 ${
            errors.content ? "border-red-400" : "border-gray-300"
          }`}
          placeholder="Content *"
          rows={3}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
          }}
        />
        {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
      </div>
 
      <input
        className="border border-gray-300 rounded px-3 py-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-700"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
 
      <select
        className="border border-gray-300 rounded px-3 py-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={type}
        onChange={(e) => setType(e.target.value as SnippetType)}
      >
        <option value="note">📝 note</option>
        <option value="link">🔗 link</option>
        <option value="command">⌨️ command</option>
      </select>
 
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm px-4 py-2 rounded transition-colors"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-sm px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}