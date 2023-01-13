import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import toast from "react-hot-toast";
import { db, storage } from "../../firebase";
import { Profile } from "../../types";

export const updateUserProfile = async (
  selectedImage: string | undefined,
  currentUserId: string | undefined,
  displayName: string,
  updateProfile: (profile: Profile) => Promise<boolean>,
  setOpen: (open: boolean) => void
) => {
  let downloadURL = null;

  try {
    if (selectedImage) {
      const imageRef = ref(storage, `users/${currentUserId}/image`);
      await uploadString(imageRef, selectedImage, "data_url");
      downloadURL = await getDownloadURL(imageRef);
    }
    await updateProfile({
      displayName,
      photoURL: downloadURL,
    });
    await updateDoc(doc(db, "users", currentUserId as string), {
      displayName,
      photoURL: downloadURL,
    });
    setOpen(false);
  } catch (error) {
    console.log(error as Error);
    toast.error("Error while updating profile");
  }
};
