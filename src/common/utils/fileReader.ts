interface FileReaderResult {
  fileName: string;
  fileSize: number;
  fileType: string;
  base64Url: string;
}

export const getFileReaderResults = (files: FileList) => {
  const promises: Array<Promise<FileReaderResult>> = [];
  for (const file of files) {
    promises.push(readFileAsBase64(file));
  }
  return Promise.all(promises);
};

export const getFileReaderResult = (file: File) => {
  return readFileAsBase64(file);
};

const readFileAsBase64 = (file: File) => {
  const reader = new FileReader();
  return new Promise<FileReaderResult>((resolve, reject) => {
    reader.onload = () =>
      resolve({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        base64Url: reader.result as string,
      });
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
