const { Router } = require('express')
const { getDashboard, uploadFile, createFolder, downloadFile, deleteFile, updateFile, deleteFolder, updateFolder } = require('../controllers/dashboardController')
const multer  = require('multer')
const path = require('path')

const storage = multer.memoryStorage()

const upload = multer({ storage: storage })
const dashboardRouter = Router()

dashboardRouter.get("/", getDashboard)

dashboardRouter.post("/upload/:filePath", upload.single('file'), uploadFile)

dashboardRouter.post("/create-folder", createFolder)

dashboardRouter.post("/download/:folderName/:fileName/:fileId", downloadFile)

dashboardRouter.post("/delete/:folderName/:originalName/:fileId", deleteFile)

dashboardRouter.post("/update/:folderName/:originalName/:fileId", updateFile)

dashboardRouter.post("/delete-folder/:folderName/:folderId", deleteFolder)

dashboardRouter.post("/update-folder/:folderName/:folderId", updateFolder)

module.exports = dashboardRouter