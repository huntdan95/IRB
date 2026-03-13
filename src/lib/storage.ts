import { ref, uploadBytes, getDownloadURL, deleteObject, ref as refFromURL } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadPropertyPhoto(propertyId: string, file: File): Promise<string> {
  const path = `properties/${propertyId}/photos/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}

export async function deleteFileByUrl(url: string): Promise<void> {
  const fileRef = refFromURL(storage, url);
  await deleteObject(fileRef);
}

