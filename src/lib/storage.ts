import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getStorageInstance } from "./firebase";

export async function uploadPropertyPhoto(propertyId: string, file: File): Promise<string> {
  const storage = getStorageInstance();
  const path = `properties/${propertyId}/photos/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}

export async function deleteFileByUrl(url: string): Promise<void> {
  const storage = getStorageInstance();
  // Extract the storage path from a Firebase Storage download URL
  // URL format: https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<pathEncoded>?...
  const match = url.match(/\/o\/([^?]+)/);
  if (!match) return;
  const encodedPath = match[1];
  const path = decodeURIComponent(encodedPath);
  const fileRef = ref(storage, path);
  await deleteObject(fileRef);
}


