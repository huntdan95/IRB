"use client";

import Image from "next/image";
import { useState } from "react";
import type { PropertyPhoto } from "@/types";
import { uploadPropertyPhoto, deleteFileByUrl } from "@/lib/storage";
import { updateProperty } from "@/lib/firestore";

interface PhotoManagerProps {
  propertyId: string;
  photos: PropertyPhoto[];
  heroImage?: string;
  onChange: (photos: PropertyPhoto[]) => void;
  onSetHero?: (url: string) => void;
}

export default function PhotoManager({ propertyId, photos, heroImage, onChange, onSetHero }: PhotoManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PropertyPhoto | null>(null);
  const [enlargedUrl, setEnlargedUrl] = useState<string | null>(null);

  const sorted = [...photos].sort((a, b) => a.order - b.order);

  async function handleFilesSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const existingMaxOrder = sorted.reduce((max, p) => Math.max(max, p.order), 0);
      const newPhotos: PropertyPhoto[] = [];
      let order = existingMaxOrder + 1;

      for (const file of Array.from(files)) {
        const url = await uploadPropertyPhoto(propertyId, file);
        newPhotos.push({ url, order, caption: "" });
        order += 1;
      }

      const nextPhotos = [...sorted, ...newPhotos];
      onChange(nextPhotos);
      setSaving(true);
      await updateProperty(propertyId, { photos: nextPhotos } as any);
    } finally {
      setUploading(false);
      setSaving(false);
      event.target.value = "";
    }
  }

  async function handleDelete(photo: PropertyPhoto) {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await deleteFileByUrl(photo.url);
      const nextPhotos = sorted.filter((p) => p.url !== photo.url);
      onChange(nextPhotos);
      await updateProperty(propertyId, { photos: nextPhotos } as any);
      setDeleteTarget(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleMove(index: number, direction: "left" | "right") {
    const newIndex = direction === "left" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sorted.length) return;
    const reordered = [...sorted];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);
    const withOrder = reordered.map((p, idx) => ({ ...p, order: idx + 1 }));
    onChange(withOrder);
    setSaving(true);
    try {
      await updateProperty(propertyId, { photos: withOrder } as any);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-deep-ocean">Photos</h2>
        <label className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-sea-glass text-white hover:bg-sea-glass/90 transition-warm cursor-pointer">
          {uploading ? "Uploading..." : "Upload photos"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFilesSelected}
          />
        </label>
      </div>
      <p className="text-xs text-driftwood">
        Drag to reorder with arrows. Click a photo to enlarge. Star to set as cover image.
      </p>

      {sorted.length === 0 ? (
        <div className="w-full border border-driftwood/30 border-dashed rounded-xl p-8 text-center text-driftwood">
          No photos yet. Upload your first images to start the gallery.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((photo, index) => (
            <div
              key={photo.url}
              className="bg-white rounded-xl shadow-warm overflow-hidden flex flex-col"
            >
              <div
                className="relative aspect-[4/3] cursor-pointer"
                onClick={() => setEnlargedUrl(photo.url)}
              >
                <Image
                  src={photo.url}
                  alt={photo.caption || `Photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, 50vw"
                />
                {onSetHero && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onSetHero(photo.url); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white"
                    title="Set as cover photo"
                  >
                    <span className={heroImage === photo.url ? "text-amber-500" : "text-driftwood"}>
                      ★
                    </span>
                  </button>
                )}
              </div>
              <div className="px-3 py-2 flex items-center justify-between text-xs text-driftwood border-t border-driftwood/20">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">#{photo.order}</span>
                  {heroImage === photo.url && (
                    <span className="text-amber-600 text-[10px]">Cover</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="w-7 h-7 rounded-full border border-driftwood/40 flex items-center justify-center hover:bg-sand transition-warm disabled:opacity-40"
                    onClick={() => handleMove(index, "left")}
                    disabled={index === 0}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="w-7 h-7 rounded-full border border-driftwood/40 flex items-center justify-center hover:bg-sand transition-warm disabled:opacity-40"
                    onClick={() => handleMove(index, "right")}
                    disabled={index === sorted.length - 1}
                  >
                    →
                  </button>
                  <button
                    type="button"
                    className="ml-1 text-coral hover:text-coral/80"
                    onClick={() => setDeleteTarget(photo)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {enlargedUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setEnlargedUrl(null)}
        >
          <img
            src={enlargedUrl}
            alt="Enlarged"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-warm-lg p-6 max-w-sm w-full">
            <h3 className="font-display text-lg text-deep-ocean mb-2">Delete this photo?</h3>
            <p className="text-sm text-driftwood mb-4">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-3 py-2 rounded-lg border border-driftwood/40 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteTarget)}
                disabled={saving}
                className="flex-1 px-3 py-2 rounded-lg bg-coral text-white text-sm font-semibold disabled:opacity-70"
              >
                {saving ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {saving && (
        <p className="text-xs text-driftwood">Saving changes…</p>
      )}
    </div>
  );
}

