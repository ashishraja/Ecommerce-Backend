import multer from "multer";

const storage = multer.memoryStorage();
const multipleUpload = multer({ storage }).array("files", 5); // "files" is the field name for the files, and 5 is the maximum number of files allowed

export default multipleUpload;



const storageFile = multer.memoryStorage();
export const singleUpload = multer({storageFile}).single("file");


