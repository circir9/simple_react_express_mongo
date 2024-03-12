const express = require('express');
const router = express.Router();
const { UserProfile } = require("../models/userModel")
const path = require('path');
const fs = require('fs');
const Multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadDir = '../porfile_uploads';
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);
//     }
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const avatarName = 'avatar_' + Date.now() + file.originalname;
//     cb(null, avatarName);
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

const bucket = storage.bucket(process.env.GCSAvatarBucketName);

router.get('/avatar/:id', async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ id: req.params.id });
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const avatarUrl = userProfile.avatar_path || "";

    if (avatarUrl && avatarUrl !== "") {
      const bucketFileName = path.basename(`${avatarUrl}`);
      const fileExists = await bucket.file(bucketFileName).exists().then(() => true).catch(() => false);
      
      if (!fileExists) {
        res.json({ avatarUrl: "" });
      }
    }

    res.json({ avatarUrl: avatarUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.patch('/avatar/:id', multer.single('avatar'), async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ id: req.params.id });
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    if(path.basename(userProfile.avatar_path)!==""){
      const fileExists = await bucket.file(path.basename(userProfile.avatar_path)).exists()
        
      if (fileExists[0]) {
        await bucket.file(path.basename(userProfile.avatar_path)).delete();
        console.log("Old avatar was deleted");
      }
      else{
        console.log("Data deleted (avatar file not found)");
      }
    }

    const bucketFileName = path.basename(`${userProfile.id}-avatar${Date()}`);
    const blob = bucket.file(bucketFileName);
    const blobStream = blob.createWriteStream();

    blobStream.on("finish", () => {
      console.log("upload avatar success");
    })
    // 必要的
    blobStream.end(req.file.buffer);

    userProfile.avatar_path = `${process.env.googleCloudStorageUrl}${process.env.GCSAvatarBucketName}${bucketFileName}`;
    await userProfile.save();
    
    res.json({ message: 'Patch Success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// router.get('/avatar/:id', async (req, res) => {
//   try {
//     const userProfile = await UserProfile.findOne({ id: req.params.id });
//     if (!userProfile) {
//       return res.status(404).json({ message: 'User profile not found' });
//     }

//     const avatarUrl = userProfile.avatar_path || "";

//     if (avatarUrl && avatarUrl !== "") {
//       const oldImagePath = avatarUrl.replace(/\\/g, '/');
//       const fileExists = await fs.promises.access(oldImagePath).then(() => true).catch(() => false);
      
//       if (!fileExists) {
//         res.json({ avatarUrl: "" });
//       }
//     }

//     res.json({ avatarUrl: avatarUrl });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// router.get('/getAvatar', async (req, res) => {
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

// router.patch('/avatar/:id', upload.single('avatar'), async (req, res) => {
//   try {
//     const userProfile = await UserProfile.findOne({ id: req.params.id });
//     if (!userProfile) {
//       return res.status(404).json({ message: 'User profile not found' });
//     }
    
//     if (userProfile.avatar_path && userProfile.avatar_path !== "") {
//       const oldImagePath = userProfile.avatar_path.replace(/\\/g, '/');
//       const fileExists = await fs.promises.access(oldImagePath).then(() => true).catch(() => false);
      
//       if (fileExists) {
//         await fs.promises.unlink(oldImagePath);
//         console.log(`File ${oldImagePath} removed`);
//       } else {
//         console.log(`File ${oldImagePath} does not exist`);
//       }
//     }

//     userProfile.avatar_path = `${req.file.path}`;
//     await userProfile.save();
    
//     res.json({ message: 'Patch Success' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

router.patch("/message", async (req, res) => {
  const { id, message } = req.body.params;

  const user = await UserProfile.findOneAndUpdate(
    { id },
    { message: message }
  );

  if (!user) {
    console.log("更新message失敗");
  }
});

router.get('/message', async (req, res) => {
  try {
    const { id } = req.query;
    const user = await UserProfile.findOne({ id:id });

    res.json({ user });
    
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

const Router = router;

module.exports = Router;