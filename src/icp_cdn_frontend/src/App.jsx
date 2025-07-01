import { useEffect, useState } from "react";
import { icp_cdn_backend } from "declarations/icp_cdn_backend";

function App() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setStatus("⚠ Please select a file.");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = [...new Uint8Array(arrayBuffer)];

      setStatus("⏳ Uploading...");
      await icp_cdn_backend.upload_file(file.name, bytes);
      setStatus("✅ File uploaded!");
      setFile(null);
      fetchFiles();
    } catch (error) {
      console.error(error);
      setStatus("❌ Upload failed.");
    }
  };

  const fetchFiles = async () => {
    try {
      const list = await icp_cdn_backend.list_files();
      setFiles(list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = async (name) => {
    try {
      const bytes = await icp_cdn_backend.get_file(name);
      const blob = new Blob([new Uint8Array(bytes)]);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-6 font-sans">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-indigo-700 text-center mb-6">
          Decentralized CDN Dashboard
        </h1>

        <div className="border border-dashed border-gray-400 rounded-lg p-6 mb-4 bg-gray-50">
          <label className="block mb-2 text-gray-700 font-medium">
            Select File to Upload
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border p-2 rounded text-sm mb-4"
          />
          <button
            onClick={handleUpload}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
          >
            Upload
          </button>
          <p className="mt-2 text-sm text-gray-600">{status}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Uploaded Files
          </h2>
          {files.length > 0 ? (
            <ul className="space-y-2">
              {files.map((file, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded shadow-sm hover:bg-gray-200 transition"
                >
                  <span className="text-gray-700 truncate max-w-xs">
                    {file}
                  </span>
                  <button
                    onClick={() => handleDownload(file)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Download
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No files uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;