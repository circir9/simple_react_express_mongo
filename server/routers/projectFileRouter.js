const express = require("express");
const router = express.Router();
const Multer = require("multer");
const ProjectFile = require("../models/projectFileModel")
const path = require('path');
const fs = require('fs');
const {v1 : uuidv1} = require('uuid')
const { Storage } = require("@google-cloud/storage");
const mime = require('mime');

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10485800,
  },
});

const projectId = process.env.googleProjectId;
const keyFilename = 'mykey.json';
const storage = new Storage({
  projectId,
  keyFilename
});

const bucket = storage.bucket(process.env.GCSBucketName);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // 本地端上傳檔案的目錄
//     const uploadDir = '../uploads';
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + file.originalname);
//   },
// });

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 10000000,
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedExtensions = ["jpg", "jpeg", "png"];
//     const fileExtension = file.originalname.split('.').pop().toLowerCase();
//     if (allowedExtensions.includes(fileExtension)) {
//       return cb(null, true);
//     } else {
//       return cb(new Error("Invalid file type"));
//     }
//   }
// });

router.get("/", async (req, res) => {
  try{
    // 查找指定屬性
    const files = await ProjectFile.find({}, ["name", "id", "upload_time"]);
    res.json({
      success: true,
      file: files
    });
  }
  catch (error){
      res.status(500).json({ errMessage: error.message });
  }
});

router.post("/upload", multer.fields([
  { name: "file", maxCount: 1 },
  { name: "user" }
]), async (req, res) => {
  try {
    const file = req.files["file"][0];
    const user = JSON.parse(req.body["user"]);
    if (!file) {
      throw new Error("No file uploaded");
    }
    else{
      const uploadTime = new Date();
      const bucketFileName = `${uploadTime}${file.originalname}`;
      const blob = bucket.file(bucketFileName);
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", () => {
        console.log("upload success");
      })
      // 必要的
      blobStream.end(file.buffer);

      // 創建文件對象
      const fileObject = new ProjectFile({
        name: file.originalname,
        id: uuidv1(),
        url: `${process.env.googleCloudStorageUrl}${process.env.GCSBucketName}${bucketFileName}`,
        uid: user["uid"],
        upload_time: uploadTime,
      });
      // 將文件存儲到 MongoDB
      await fileObject.save();

      // 保留指定屬性
      const { name, id, upload_time } = fileObject;
      const newFileObject = { name, id, upload_time };

      res.status(200).json({
        success: true,
        file: newFileObject
      });
    }
  } catch (error) {
    res.status(400).json({ errMessage: error.message });
  }
  });

// router.post("/upload", upload.fields([
//   { name: "file", maxCount: 1 },
//   { name: "user" }
// ]), async (req, res) => {
//   try {
//     const file = req.files["file"][0];
//     const user = JSON.parse(req.body["user"]);
//     if (!file) {
//       throw new Error("No file uploaded");
//     }

//     // 創建文件對象
//     const fileObject = new ProjectFile({
//       name: file.originalname,
//       id: uuidv1(),
//       url: file.path,
//       uid: user["uid"],
//       upload_time: new Date()
//     });
//     // 將文件存儲到 MongoDB
//     await fileObject.save();

//     // 保留指定屬性
//     const { name, id, upload_time } = fileObject;
//     const newFileObject = { name, id, upload_time };

//     res.status(200).json({
//       success: true,
//       file: newFileObject
//     });

//   } catch (error) {
//     res.status(400).json({ errMessage: error.message });
//   }
//   });

// router.get('/download', async (req, res) => {
//   // 回傳指定屬性
//   const { name, id, upload_time } = req.query;

//   try {
//     // 查找指定屬性
//     const file = await ProjectFile.findOne({id});

//     if (!file) {
//       return res.status(404).json({ error: 'File not found' });
//     }

//     // 返回檔案供下載
//     res.download(file.url, file.name);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

router.get('/download', async (req, res) => {
  // 回傳指定屬性
  const { name, id, upload_time } = req.query;

  try {
    // 查找指定屬性
    const file = await ProjectFile.findOne({id});

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const bucketFileName = path.basename(file.url);
    console.log(bucketFileName)
    bucket.file(bucketFileName).exists().then(async() => {
      const downloadFile = await bucket.file(bucketFileName).download();
      res.setHeader('Content-disposition', 'attachment; filename=' + file.name);
      res.send(downloadFile[0]);
    }).catch(() => {
      res.status(404).json({ error: 'File not found' });
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/delete', async (req, res) => {
  // 回傳指定屬性
  const { name, id, upload_time } = req.query;

  try {
    // 查找指定屬性
    const file = await ProjectFile.findOne({id});

    if (!file) {
      return res.status(404).json({ message: "Image not found" });
    }
    
    const bucketFileName = path.basename(file.url);
    bucket.file(bucketFileName).exists().then(async() => {
      await bucket.file(bucketFileName).delete();
      res.json({ message: "Image and data deleted" });
    }).catch(() => {
      res.json({ message: "Data deleted (image file not found)" });
    });
    await ProjectFile.deleteOne({id});
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.delete('/delete', async (req, res) => {
//   // 回傳指定屬性
//   const { name, id, upload_time } = req.query;

//   try {
//     // 查找指定屬性
//     const file = await ProjectFile.findOne({id});

//     if (!file) {
//       return res.status(404).json({ message: "Image not found" });
//     }

//     await ProjectFile.deleteOne({id});

//     if (fs.existsSync(file.url)) {
//       fs.unlinkSync(file.url);
//       res.json({ message: "Image and data deleted" });
//     } else {
//       res.json({ message: "Data deleted (image file not found)" });
//     }

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.get('/getDocumentCount', async (req, res) => {
  try {
      const documentCount = await ProjectFile.countDocuments();

      res.json({ numOfData:documentCount });
  } catch (error) {
      res.status(500).json({ error: '無法獲取資料總數' });
  }
});

// async function readFileContent(filePath) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(filePath, { encoding: 'base64' }, (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(data);
//       }
//     });
//   });
// }

router.get("/getPageImages", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const order = req.query.order;
    const page = parseInt(req.query.page)-1;

    if(page<0){
      return;
    }

    const count = await ProjectFile.countDocuments({});
    let query = ProjectFile.find({}, ["name", "id", "upload_time", "url"]).sort({ upload_time: order });

    query.limit(limit);
    query.skip(page * limit);

    const files = await query.exec();

    if (!files) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({
      success: true,
      files: files,
      count: count
    });

  } catch (error) {
    res.status(500).json({ errMessage: error.message });
  }
});

// router.get('/getImage', async (req, res) => {
//   try {
//     const imagePath = req.query.url;

//     if (!fs.existsSync(imagePath)) {
//       return res.status(404).json({ error: '圖片不存在' });
//     }

//     const extname = path.extname(imagePath);

//     res.setHeader('Content-Type', `image/${extname.slice(1)}`);

//     const stream = fs.createReadStream(imagePath);
//     stream.pipe(res);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: '無法獲取圖片' });
//   }
// });

const Router = router;

module.exports = Router;