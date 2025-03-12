const { Router } = require('express')
const { getDashboard, uploadFile, createFolder, downloadFile, deleteFile, updateFile } = require('../controllers/dashboardController')
const multer  = require('multer')
const path = require('path')

const storage = multer.memoryStorage()

const upload = multer({ storage: storage })
const dashboardRouter = Router()

dashboardRouter.get("/", getDashboard)

dashboardRouter.post("/upload", upload.single('file'), uploadFile)

dashboardRouter.post("/create-folder", createFolder)

dashboardRouter.post("/download/:filename", downloadFile)

dashboardRouter.post("/delete/:originalName/:fileId", deleteFile)

dashboardRouter.post("/update/:originalName/:fileId", updateFile)

module.exports = dashboardRouter