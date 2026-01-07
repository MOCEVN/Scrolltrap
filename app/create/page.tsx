"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useScenarioMode } from "@/hooks/use-scenario-mode";
import { AlertTriangle, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function Create() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAwarenessDialog, setShowAwarenessDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const { isDoom } = useScenarioMode();

  const handleSubmit = async () => {
    if (!file || !title.trim()) return alert("Add file + title");

    setLoading(true);
    if (!isDoom) {
      setShowAwarenessDialog(true);
      return;
    }
    proceedToPost();
  };

  const handleAwarenessConfirm = () => {
    setShowAwarenessDialog(false);
    proceedToPost();
  };

  const proceedToPost = async () => {
    if (isDoom) {
      setShowFilterDialog(true);
      setFilterLoading(false);
      await postImage();
      return;
    }

    setShowFilterDialog(true);
    setFilterLoading(true);

    const filterTimeout = setTimeout(async () => {
      setFilterLoading(false);
      await postImage();
    }, 2500 + Math.random() * 1500);
  };
  const postImage = async () => {
    const form = new FormData();
    form.append("file", file!);
    form.append("title", title);

    try {
      const res = await fetch("/api/auth/post", {
        method: "POST",
        body: form,
        credentials: "include"
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error);

      setFile(null);
      setPreview("");
      setTitle("");
      ref.current!.value = "";
    } catch {
      alert("Error");
      setShowFilterDialog(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen ${isDoom ? "bg-slate-950 text-white" : "bg-slate-100 text-black"}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-8 max-w-md w-full">
            <div
              className={`w-80 h-80 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all shadow-xl ${isDoom
                ? "border-red-500/50 bg-slate-800/50 hover:border-red-500"
                : "border-gray-400/50 bg-white/80 hover:border-indigo-500"
                }`}
              onClick={() => ref.current?.click()}
            >
              {preview ? (
                <img src={preview} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="text-center p-8">
                  <Upload className="w-8 h-8 mb-4 opacity-70 mx-auto " />
                  <p className="text-lg font-medium">Click to upload image</p>
                </div>
              )}
            </div>
            <input
              ref={ref}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f && (f.type.startsWith('image/'))) {
                  setFile(f);
                  setPreview(URL.createObjectURL(f));
                }
              }}
            />

            {file && (
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter post title..."
                className={`w-80 p-4 rounded-2xl border-2 shadow-lg focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all ${isDoom
                  ? "border-red-500/50 bg-slate-800 text-white placeholder-slate-400 focus:ring-red-500 focus:ring-offset-slate-900"
                  : "border-gray-300 bg-white shadow-lg focus:ring-indigo-500 focus:ring-offset-white"
                  }`}
              />
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !file}
              className={`w-80 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl transform transition-all hover:-translate-y-1 active:translate-y-0 ${isDoom
                ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500/50"
                : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-2 border-emerald-500/50"
                } ${loading || !file ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Uploading..." : "Add post"}
            </button>
          </div>
        </main>
      </div>

      {showAwarenessDialog && !isDoom && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-2xl p-8 shadow-2xl backdrop-blur-sm bg-white/95 border-2 border-indigo-500/50">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-orange-300" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Post with Care</h2>
                <p className="text-lg text-gray-700 leading-relaxed max-w-md mx-auto">
                  Hey there! Before this goes live on the web, remember: <strong>once it's out there, it's out there forever</strong>.
                  <br />Choose wisely — your privacy is worth protecting!
                </p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setShowAwarenessDialog(false);
                    setLoading(false);
                  }}
                  className="flex-1 px-6 py-3 rounded-xl font-bold bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAwarenessConfirm}
                  className="flex-1 px-6 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-lg"
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFilterDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl p-8 shadow-2xl backdrop-blur-sm ${isDoom
            ? "bg-slate-900/95 border-2 border-red-500/50"
            : "bg-white/95 border-2 border-indigo-500/50"
            }`}>
            <div className="flex flex-col items-center gap-6 text-center">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${isDoom
                ? "bg-red-500/20"
                : "bg-indigo-500/20"
                }`}>
                {filterLoading ? (
                  <Loader2 className={`w-10 h-10 animate-spin ${isDoom ? "text-red-400" : "text-indigo-400"}`} />
                ) : (
                  <svg className={`w-10 h-10 ${isDoom ? "text-red-400" : "text-emerald-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {filterLoading ? (
                <>
                  <h2 className={`text-2xl font-bold ${isDoom ? "text-white" : ""}`}>
                    Content Filter Active
                  </h2>
                  <p className={`text-lg ${isDoom ? "text-slate-300" : "opacity-90"} max-w-md leading-relaxed`}>
                    In the meantime we are analyzing your post...
                  </p>
                </>
              ) : (
                <>
                  <h2 className={`text-2xl font-bold ${isDoom ? "text-white" : ""}`}>
                    {isDoom ? "Post Published!" : "Post Approved!"}
                  </h2>
                  <p className={`text-lg ${isDoom ? "text-slate-300" : "opacity-90"}`}>
                    {isDoom
                      ? "Your post has been added successfully!"
                      : "Your content passed our safety checks."
                    }
                  </p>
                  <button
                    onClick={() => setShowFilterDialog(false)}
                    className={`mt-6 px-8 py-3 font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${isDoom
                      ? "bg-red-600 hover:bg-red-700 text-white border-2 border-red-500/50"
                      : "bg-emerald-500 hover:bg-emerald-600 text-white"
                      }`}
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
