import React, { useEffect, useState } from "react";
import { cdn_backend } from "../../declarations/cdn_backend";

type ProfileProps = {
  principal: string;
};

const Profile: React.FC<ProfileProps> = ({ principal }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [fileList, setFileList] = useState<string[]>([]);
  const [previewContent, setPreviewContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    fetchFileList();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
  if (!selectedFile) {
    setStatus("⚠ No file selected.");
    return;
  }

  try {
    const arrayBuffer = await selectedFile.arrayBuffer();
    const byteArray = [...new Uint8Array(arrayBuffer)]; // convert to number[]

    await cdn_backend.upload_file(selectedFile.name, byteArray);

    setStatus("✅ Upload successful");
    setSelectedFile(null);
    fetchFileList();
  } catch (err) {
    console.error("Upload failed", err);
    setStatus("❌ Upload failed.");
  }
};


  const handleDownload = async (name: string) => {
  try {
    const data = await cdn_backend.get_file(name);
    const blob = new Blob([new Uint8Array(data)], { type: "application/octet-stream" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download error", err);
  }
};


  const fetchFileList = async () => {
    try {
      const list = await cdn_backend.list_files();
    setFileList(Array.isArray(list) ? list.map(String) : []);
    } catch (err) {
      console.error("Failed to fetch file list:", err);
    }
  };

  const handlePreview = async (name: string) => {
    try {
      const bytes = await cdn_backend.get_file(name);
      const blob = new Blob([new Uint8Array(bytes)]);
      const url = URL.createObjectURL(blob);

      if (name.match(/\.(png|jpg|jpeg|gif)$/i)) {
        setPreviewContent(<img src={url} alt={name} className="max-h-64 mx-auto" />);
      } else if (name.match(/\.(txt|md|js|json|log|html|css)$/i)) {
        const text = await blob.text();
        setPreviewContent(
          <pre className="whitespace-pre-wrap max-h-64 overflow-y-auto bg-gray-200 p-2 rounded">{text}</pre>
        );
      } else {
        setPreviewContent(<p className="text-sm text-gray-500 text-center">📄 Cannot preview this file type.</p>);
      }
    } catch (err) {
      setPreviewContent(<p className="text-red-500">Preview failed.</p>);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-50 shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">👤 Profile</h2>
      <p className="mb-4"><strong>Principal:</strong> {principal}</p>

      <input type="file" onChange={handleFileSelect} className="mb-2" />
      {selectedFile && (
        <button
          onClick={handleUpload}
          className="ml-2 px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Upload
        </button>
      )}
      <p className="text-sm mt-2 text-gray-600">{status}</p>

      <h3 className="mt-6 text-lg font-semibold">📁 Uploaded Files ({fileList.length})</h3>
      {fileList.length === 0 ? (
        <p className="text-gray-500">No files uploaded yet.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {fileList.map((file, i) => (
            <li key={i} className="flex justify-between items-center bg-white p-2 rounded shadow">
              <span className="truncate">{file}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleDownload(file)}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Download
                </button>
                <button
                  onClick={() => handlePreview(file)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Preview
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {previewContent && (
        <div className="mt-6 border-t pt-4">
          <h4 className="text-lg font-medium mb-2">📤 File Preview</h4>
          <div>{previewContent}</div>
        </div>
      )}
    </div>
  );
};

export default Profile;
