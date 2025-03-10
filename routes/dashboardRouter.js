const { Router } = require('express')
const { getDashboard, uploadFile, createFolder } = require('../controllers/dashboardController')
const multer  = require('multer')
const path = require('path')

const storage = multer.memoryStorage()

const upload = multer({ storage: storage })
const dashboardRouter = Router()

dashboardRouter.get("/", getDashboard)

dashboardRouter.post("/upload", upload.single('file'), uploadFile)

dashboardRouter.post("/create-folder", createFolder)

module.exports = dashboardRouter