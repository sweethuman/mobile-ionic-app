import {useEffect, useState} from 'react';
import {base64FromPath, useFilesystem} from '@ionic/react-hooks/filesystem';
import {useStorage} from '@ionic/react-hooks/storage';
import {Camera, CameraPhoto, CameraResultType, CameraSource, Photo} from "@capacitor/camera";
import {Directory} from '@capacitor/filesystem';
import axios from "axios";
import {withLogs} from "../core";
import {decode} from "base64-arraybuffer";

export interface MyPhoto {
  filepath: string;
  webviewPath?: string;
}

const PHOTO_STORAGE = 'photos';

export function usePhotoGallery() {
  // const {getPhoto} = useCamera();
  const [photos, setPhotos] = useState<MyPhoto[]>([]);
  const {readFile, writeFile} = useFilesystem();

  const takePhoto = async (): Promise<string> => {
    const cameraPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    console.log(cameraPhoto)
    const fileName = new Date().getTime() + '.jpeg';
    const savedFileImage = await savePicture(cameraPhoto, fileName);
    const newPhotos = [savedFileImage, ...photos];
    setPhotos(newPhotos);
    var formData = new FormData();
    formData.append("image", (await base64FromPath(cameraPhoto.webPath!)).replace(`data:image/${cameraPhoto.format};base64,`, ""));
    formData.append("key", "7ab3243ab6f5b3676d70cfa2754ee262");
    var res = await withLogs(axios.post<{data: {url: string}}>('https://api.imgbb.com/1/upload', formData), "uploadPhoto")
    set(PHOTO_STORAGE, JSON.stringify(newPhotos));
    return res.data.url;
  };

  const savePicture = async (photo: Photo, fileName: string): Promise<MyPhoto> => {
    const base64Data = await base64FromPath(photo.webPath!);
    await writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,

    });

    return {
      filepath: fileName,
      webviewPath: photo.webPath
    };
  };

  const {get, set} = useStorage();
  useEffect(() => {
    const loadSaved = async () => {
      const photosString = await get(PHOTO_STORAGE);
      const photos = (photosString ? JSON.parse(photosString) : []) as MyPhoto[];
      for (let photo of photos) {
        const file = await readFile({
          path: photo.filepath,
          directory: Directory.Data
        });
        photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
      }
      setPhotos(photos);
    };
    loadSaved();
  }, [get, readFile]);

  return {
    photos,
    takePhoto,
  };
}
