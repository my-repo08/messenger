import { useState } from "react";

const useSelectImage = () => {
  const [selectedImage, setSelectedImage] = useState<string>();

  const onSelectImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    if (evt.target.files?.[0]) {
      reader.readAsDataURL(evt.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedImage(readerEvent.target.result as string);
      }
    };
  };

  return {
    selectedImage,
    setSelectedImage,
    onSelectImage,
  };
};

export default useSelectImage;
