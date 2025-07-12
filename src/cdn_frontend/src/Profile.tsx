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
      const byteArray = [...new Uint8Array(arrayBuffer)];
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
        setPreviewContent(<img src={url} alt={name} className="previewImage" />);
      } else if (name.match(/\.(txt|md|js|json|log|html|css)$/i)) {
        const text = await blob.text();
        setPreviewContent(<pre className="previewText">{text}</pre>);
      } else {
        setPreviewContent(<p className="text-sm text-gray-500 text-center">📄 Cannot preview this file type.</p>);
      }
    } catch (err) {
      setPreviewContent(<p className="text-red-500">Preview failed.</p>);
    }
  };

  return (
    <div className="card">
      <h2 className="sectionTitle">👤 Profile</h2>
      <p><strong>Principal:</strong> {principal}</p>

      <input type="file" onChange={handleFileSelect} className="fileInput" />

      {selectedFile && (
        <div className="buttonGroup">
          <button className="button" onClick={handleUpload}>Upload</button>
        </div>
      )}

      <p className="subtitle">{status}</p>

      <h3 className="sectionTitle">📁 Uploaded Files ({fileList.length})</h3>

      {fileList.length === 0 ? (
        <p className="text-gray-500">No files uploaded yet.</p>
      ) : (
        <ul className="fileList">
          {fileList.map((file, i) => (
            <li key={i}>
              {file}
              <span className="fileActions">
                <button onClick={() => handleDownload(file)}>Download</button>
                <button onClick={() => handlePreview(file)}>Preview</button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {previewContent && (
        <div className="previewSection">
          <h4>📤 File Preview</h4>
          <div>{previewContent}</div>
        </div>
      )}
    </div>
  );
};

export default Profile;
