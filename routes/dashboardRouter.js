const { Router } = require('express')
const { getDashboard, uploadFile, createFolder } = require('../controllers/dashboardController')
const multer  = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname); // Get the file's extension
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension); // Add extension
  }
})

const upload = multer({ storage: storage })
const dashboardRouter = Router()

dashboardRouter.get("/", getDashboard)

dashboardRouter.post("/upload", upload.single('file'), uploadFile)

dashboardRouter.post("/create-folder", createFolder)

module.exports = dashboardRouter