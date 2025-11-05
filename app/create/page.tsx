"use client";


import Sidebar from "@/components/sidebar";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function Create() {
	const [file, setFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [title, setTitle] = useState("");
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];

		if (!selectedFile) {
			alert("No image/video selected. Please try again.");
			return;
		}

		setFile(selectedFile);
		setPreviewUrl(URL.createObjectURL(selectedFile));
	};

	const handleSubmit = () => {
		if (!file) {
			alert("Please pick a photo or video.");
			return;
		}

		if (!title.trim()) {
			alert("Please enter a title.");
			return;
		}

		alert(`Uploading "${title}"…`);

		setFile(null);
		setPreviewUrl(null);
		setTitle("");
	};

  return (
           <div className="flex min-h-screen bg-slate-100 text-slate-900">
               {/* Sidebar component */}
               <Sidebar />
                <div className="flex-1 flex flex-col">
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-64 h-64 rounded-xl shadow-md border border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-500 cursor-pointer overflow-hidden"
      >
        {previewUrl ? (
          file?.type.startsWith("image") ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={previewUrl}
              controls
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <>
            <Upload className="w-10 h-10 mb-2" />
            <p className="text-sm text-center">Upload your photo/video</p>
          </>
        )}
      </div>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*,video/*"
				onChange={handleFileChange}
				className="hidden"
			/>

			{file && (
				<input
					type="text"
					placeholder="Enter title for your image/video"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="w-64 px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
					required
				/>
			)}

      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-2xl cursor-pointer shadow-md transition-all active:scale-95"
      >
        Upload
      </button>
      </main>
    </div>
    </div>
  );
}
