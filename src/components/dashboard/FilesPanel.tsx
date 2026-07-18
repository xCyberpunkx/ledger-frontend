"use client";

import { useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/api";
import { FileText, Upload, Trash2, Download } from "lucide-react";

type FileAsset = {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
  uploaderMembershipId?: string | null;
  uploaderMembership?: { id: string; user: { id: string; name: string } } | null;
};

type UploadSignature = {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FilesPanel({
  organizationId,
  projectId,
}: {
  organizationId: string;
  projectId: string;
}) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const base = `/organizations/${organizationId}/projects/${projectId}/files`;
  const inputRef = useRef<HTMLInputElement>(null);

  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["files", projectId] });

  const { data: files, isPending } = useQuery({
    queryKey: ["files", projectId],
    queryFn: async () => {
      const token = await getToken();
      return apiFetch<FileAsset[]>(base, token);
    },
  });

  const deleteFile = useMutation({
    mutationFn: async (fileId: string) => {
      const token = await getToken();
      return apiFetch(`${base}/${fileId}`, token, { method: "DELETE" });
    },
    onSuccess: () => {
      invalidate();
      setConfirmingDeleteId(null);
    },
    onError: (err) => {
      setErrorMsg(err instanceof ApiError ? err.message : "Couldn't delete that file.");
    },
  });

  // Direct-to-Cloudinary: the backend only ever hands out a signature
  // scoped to this project's folder (see FilesService.getUploadSignature
  // / CloudinaryService.signUpload) — the file bytes go straight from
  // this browser to Cloudinary, never through our own server. The
  // `folder` param below must be sent back unchanged, since it's part
  // of what was actually signed.
  async function uploadFile(file: File) {
    setErrorMsg(null);
    setUploading((u) => [...u, file.name]);
    try {
      const token = await getToken();
      const sig = await apiFetch<UploadSignature>(
        `${base}/upload-signature`,
        token,
        { method: "POST" },
      );

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sig.apiKey);
      form.append("timestamp", String(sig.timestamp));
      form.append("signature", sig.signature);
      form.append("folder", sig.folder);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`,
        { method: "POST", body: form },
      );
      if (!cloudRes.ok) throw new Error("Upload to Cloudinary failed");
      const cloudData = await cloudRes.json();

      // Second call records the FileAsset row — this is where the
      // backend re-checks the public_id actually belongs to this
      // project's folder before trusting anything the browser reports.
      await apiFetch(base, token, {
        method: "POST",
        body: JSON.stringify({
          cloudinaryPublicId: cloudData.public_id,
          url: cloudData.secure_url,
          originalName: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
        }),
      });

      invalidate();
    } catch {
      setErrorMsg(`Couldn't upload ${file.name}.`);
    } finally {
      setUploading((u) => u.filter((n) => n !== file.name));
    }
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    Array.from(fileList).forEach((f) => uploadFile(f));
  }

  return (
    <div className="mt-10 rounded-2xl border border-border bg-white p-6 shadow-soft">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-moss" />
        <h2 className="text-sm font-semibold text-ink">Files</h2>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
          dragOver ? "border-moss bg-moss/[0.04]" : "border-border bg-paper-dim/40"
        }`}
      >
        <Upload className="h-5 w-5 text-muted" />
        <p className="text-xs text-muted">Drag files here, or click to browse</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {uploading.length > 0 && (
        <div className="mt-3 flex flex-col gap-1">
          {uploading.map((name) => (
            <p key={name} className="text-xs text-muted">
              Uploading {name}…
            </p>
          ))}
        </div>
      )}

      {errorMsg && <p className="mt-2 text-xs text-gold">{errorMsg}</p>}

      <div className="mt-4 flex flex-col gap-2">
        {isPending && <div className="h-12 animate-pulse rounded-lg bg-paper-dim" />}
        {files?.length === 0 && !isPending && (
          <p className="text-xs text-muted">No files uploaded yet.</p>
        )}
        {files?.map((f) => {
          if (confirmingDeleteId === f.id) {
            return (
              <div
                key={f.id}
                className="flex items-center justify-between rounded-lg border border-gold/30 bg-gold/[0.06] px-3 py-2 text-xs"
              >
                <span className="text-ink">Delete {f.originalName}?</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => deleteFile.mutate(f.id)}
                    disabled={deleteFile.isPending}
                    className="font-semibold text-gold hover:underline"
                  >
                    {deleteFile.isPending ? "Deleting…" : "Yes, delete"}
                  </button>
                  <button
                    onClick={() => setConfirmingDeleteId(null)}
                    className="text-muted hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={f.id}
              className="group flex items-center justify-between rounded-lg bg-paper-dim/60 px-3 py-2.5 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-ink">{f.originalName}</span>
                <span className="text-muted">{formatBytes(f.sizeBytes)}</span>
                {f.uploaderMembership && (
                  <span className="text-muted">{f.uploaderMembership.user.name}</span>
                )}
                <span className="text-muted">
                  {new Date(f.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download file"
                  className="text-muted hover:text-ink"
                >
                  <Download className="h-3.5 w-3.5" />
                </a>
                <button
                  onClick={() => setConfirmingDeleteId(f.id)}
                  aria-label="Delete file"
                  className="text-muted opacity-0 transition hover:text-gold group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
