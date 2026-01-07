"use client";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useScenarioMode } from "@/hooks/use-scenario-mode";
import { Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; postId?: number }>({ open: false });
  const { isDoom } = useScenarioMode();

  useEffect(() => {
    fetch("/api/auth/posting", { credentials: "include" })
      .then(res => res.json())
      .then(data => setPosts(data.posts || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const openDeleteDialog = (postId: number) => {
    setDeleteDialog({ open: true, postId });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.postId) return;

    setDeletingPostId(deleteDialog.postId);
    try {
      await fetch(`/api/auth/deletepost`, {
        method: "DELETE",
        body: JSON.stringify({ id: deleteDialog.postId }),
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });

      setPosts(posts.filter(post => post.id !== deleteDialog.postId));
    } catch {
      alert("Delete failed");
    } finally {
      setDeletingPostId(null);
      setDeleteDialog({ open: false });
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className={`flex min-h-screen ${isDoom ? "bg-slate-950 text-white" : "bg-slate-100 text-black"}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 max-w-6xl mx-auto flex flex-col">
          <h1 className={`text-4xl font-bold mb-12 ${isDoom ? "text-red-400" : "text-indigo-600"}`}>
            My Posts ({posts.length})
          </h1>
          <div className="flex-1 flex flex-col">
            {posts.length === 0 ? (
              <div className="flex-1 flex items-center justify-center py-20">
                <div className="text-center">
                  <Upload className="w-24 h-24 mx-auto mb-6 opacity-50" />
                  <h2 className="text-2xl font-bold mb-4">No posts yet</h2>
                  <Link href="/create" className={`px-8 py-3 rounded-xl font-bold ${isDoom ? "bg-red-600 hover:bg-red-500" : "bg-emerald-500 hover:bg-emerald-600"
                    }`}>
                    Create your first post
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post: any) => (
                  <div key={post.id} className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-all relative">
                    <button
                      onClick={() => openDeleteDialog(post.id)}
                      disabled={deletingPostId === post.id}
                      className={`absolute top-4 right-4 z-20 bg-red-500/90 hover:bg-red-600 text-white p-2.5 rounded-xl shadow-lg transition-all opacity-0 group-hover:opacity-100 ${deletingPostId === post.id ? "opacity-100" : ""
                        }`}
                    >
                      {deletingPostId === post.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                    <img
                      src={post.mediaUrl || "/placeholder.jpg"}
                      width={400}
                      height={300}
                      alt={post.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-2 line-clamp-2">{post.title}</h3>
                      <p className={`text-sm ${isDoom ? "text-slate-400" : "text-gray-500"}`}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {deleteDialog.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl p-8 shadow-2xl backdrop-blur-sm ${isDoom
            ? "bg-slate-900/95 border-2 border-red-500/50"
            : "bg-white/95 border-2 border-red-500/50"
            }`}>
            <div className="flex flex-col items-center gap-6 text-center">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${isDoom ? "bg-red-500/30" : "bg-red-100"
                }`}>
                <svg className={`w-10 h-10 ${isDoom ? "text-red-400" : "text-red-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>

              <div>
                <h2 className={`text-2xl font-bold mb-2 ${isDoom ? "text-white" : "text-gray-900"}`}>
                  Delete Post?
                </h2>
                <p className={`text-lg ${isDoom ? "text-slate-300" : "text-gray-700"} max-w-md mx-auto leading-relaxed`}>
                  This action cannot be undone. Are you sure you want to permanently delete this post?
                </p>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeleteDialog({ open: false })}
                  disabled={deletingPostId !== null}
                  className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${isDoom
                    ? "bg-slate-700/50 hover:bg-slate-600 text-white border border-slate-500/50"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    } ${deletingPostId !== null ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deletingPostId !== null}
                  className={`flex-1 px-6 py-3 rounded-xl font-bold shadow-lg transition-all ${isDoom
                    ? "bg-red-600 hover:bg-red-700 text-white border-2 border-red-500/50"
                    : "bg-red-500 hover:bg-red-600 text-white"
                    } ${deletingPostId !== null ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {deletingPostId !== null ? "Deleting..." : "Delete Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
