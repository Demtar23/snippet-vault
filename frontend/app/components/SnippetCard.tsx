import Link from "next/link";
import { Snippet } from "../lib/api";

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

type Props = {
  snippet: Snippet;
  onDelete: (id: string) => void;
};

export default function SnippetCard({ snippet, onDelete }: Props) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow bg-white">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                TYPE_BADGE[snippet.type] ?? "bg-gray-100 text-gray-700"
              }`}
            >
              {TYPE_ICON[snippet.type]} {snippet.type}
            </span>
          </div>
            <h2 className="font-semibold text-gray-900">
              {snippet.title}
            </h2>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {snippet.content}
          </p>
        </div>
      </div>

      {snippet.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
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

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {new Date(snippet.createdAt).toLocaleDateString()}
        </span>
        <div className="flex gap-3">
          <Link
            href={`/snippets/${snippet._id}`}
            className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
          >
            View
          </Link>
          <button
            onClick={() => onDelete(snippet._id)}
            className="text-xs text-red-400 hover:text-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
