const { da } = require('date-fns/locale');
const prisma = require('../prisma')
const { validateFolder } = require('../validation/folderValidator')
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const {fileTypeFromBuffer} = require('file-type');
const { validationResult } = require('express-validator');
const { updateValidator } = require('../validation/updateValidator');


const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const getUser = async(req) => {
    if (req.user){
        const user = await prisma.user.findUnique({
            where : { id: req.user.id },
            include: { 
                folders: {
                    include : {
                        files: true
                    }
                },
                file: true
            },
        })
        //console.log('user object:', user)
        return user
    }
    return
}
exports.getDashboard = async(req, res) => {
    let user

    user = await getUser(req)

    // console.log(user)


    res.render("dashboard", {
        user: user
    })
}

exports.uploadFile = async(req, res, next) => {
        const file = req.file
        const folderId = parseInt(req.body.folderId)
        console.log(folderId)
        let filePath = req.params.filePath
        filePath = (filePath === 'null')? '' : `/${filePath}`
        // console.log(filePath)
        try{
            const { data, error} = await supabase.storage
                .from('files')
                .upload(`${req.user.id}${(filePath)}/${file.originalname}`, file.buffer,{
                    contentType: file.mimetype,
                    cacheControl: '3600',
                    upsert: false
                });
            // console.log('e', file.path)
            if (error) {
                return next(error)
            }
            
            console.log("File upload Success")
            const size = `${(file.size / 1024).toFixed(2)} KB` 
            await prisma.file.create({
                data : {
                    name: file.originalname,
                    folderId: folderId? folderId : undefined,
                    inFolder: folderId? true : false,
                    userId: req.user.id,
                    size: size
                }
            })

            res.redirect("/dashboard")

        } catch (error) {
            console.log('error')
            console.error(error)
        }
}


exports.downloadFile = async(req, res, next) => {
        const { fileName } = req.params
        let { folderName } = req.params

        let filePath = (folderName === 'null')? '' : `/${folderName}`
        try{
            const { data, error } = await supabase
                .storage
                .from('files')
                .download(`${req.user.id}${(filePath)}/${fileName}`);

            if (error) {
                user = await getUser(req)
                return res.status(400).render("dashboard", {
                    errors: [{msg: 'Error downloading file'}],
                    user: user
                });
            }

            const buffer = Buffer.from(await data.arrayBuffer());
            const type = await fileTypeFromBuffer(buffer)
            // console.log(type)
            // console.log(data)

            res.setHeader('Content-Type', type.mime);
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}.${type.ext}"`);
            res.send(buffer)

        } catch (e) {
            console.error('Error:', e)
            return next(error)
        }

    }


exports.deleteFile = async(req, res, next) => {
    const { folderName } = req.params
    const { originalName } = req.params
    const { fileId } = req.params

    let filePath = (folderName === 'null')? '' : `/${folderName}`

    try{
        // console.log(originalName, fileId)

        await prisma.file.delete({
            where : {
                id: parseInt(fileId)
            }
        })
    
        const { data, error } = await supabase
            .storage
            .from('files')
            .remove([`${req.user.id}${(filePath)}/${originalName}`])
        
        if (error) {
            user = await getUser(req)
            return res.status(400).render("dashboard", {
                errors: [{msg: 'Error deleting file'}],
                user: user
            });
        }
        
        console.log('Delete File Success')
        res.redirect("/dashboard")

    } catch(e) {
        console.error(e)
    }
}

exports.updateFile = [
    updateValidator,
    async(req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            user = await getUser(req)
            return res.status(400).render("dashboard", {
                errors: errors.array(),
                user: user
            })
        }
        const { originalName } = req.params
        const { fileId } = req.params
        const { folderName } = req.params
        const newName = req.body.newName
        let filePath = (folderName === 'null')? '' : `/${folderName}`

        try{
            // console.log(originalName, fileId)


            await prisma.file.update({
                where : {
                    id: parseInt(fileId)
                },
                data: {
                    name: newName
                }
            })
        
            const { data: downloadData, error: downloadError } = await supabase
                .storage
                .from('files')
                .download(`${req.user.id}${(filePath)}/${originalName}`);

            if (downloadError) {
                console.error('Error downloading file:', downloadError);
                user = await getUser(req)
                return res.status(400).render("dashboard", {
                    errors: [{msg: 'Error updating file'}],
                    user: user
                });
            }

            const buffer = Buffer.from(await downloadData.arrayBuffer());
            // console.log(buffer)


            const type = await fileTypeFromBuffer(buffer)

            const { data: uploadData, error: uploadError} = await supabase.storage
            .from('files')
            .upload(`${req.user.id}${(filePath)}/${newName}`, buffer,{
                contentType: type.mime,
                cacheControl: '3600',
                upsert: false
            });

            if (uploadError) {
                console.error('Error uploading file:', uploadError);
                user = await getUser(req)
                return res.status(400).render("dashboard", {
                    errors: [{msg: 'Error updating file'}],
                    user: user
                });
            }

            const { data: deleteData, error: deleteError } = await supabase
                .storage
                .from('files')
                .remove([`${req.user.id}${(filePath)}/${originalName}`])
                
            if (deleteError) {
                console.error('Error deleting file:', deleteError);
                user = await getUser(req)
                return res.status(400).render("dashboard", {
                    errors: [{msg: 'Error updating file'}],
                    user: user
                });
            }

            console.log('Update Success')
            res.redirect("/dashboard")

        } catch(e) {
            console.error(e)
        }
    }
]

exports.createFolder = [
    validateFolder,
    async(req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            user = await getUser(req)
            return res.status(400).render("dashboard", {
                errors: errors.array(),
                user: user
            })
        }
        const folderName = req.body.folderName
        const userId = parseInt(req.body.userId)

        try{
            await prisma.folder.create({
                data : {
                    name: folderName,
                    userId: userId
                }
            })
            console.log("Folder stored in db")

            const emptyFileBuffer = Buffer.from('');

            const { data, error } = await supabase.storage
                .from("files")
                .upload(`${req.user.id}/${folderName}/newFolder.txt`,emptyFileBuffer, {
                    cacheControl: '3600',
                    upsert: false
                })
            
            console.log("Folder Stored in SupaBase")
            res.redirect("/dashboard")
        } catch (e) {
            console.error('Error creating folder', e)
        }
    }
]

exports.deleteFolder = async(req, res, next) => {
    const { folderName } = req.params
    const { folderId } = req.params

    try{
        await prisma.file.deleteMany({
            where: {
                folderId: parseInt(folderId)
            }
        })

        await prisma.folder.delete({
            where: {
                id: parseInt(folderId)
            }
        })

        console.log("Deleted files and folder")
        console.log(`${req.user.id}/${folderName}`)
        const { data: files, error } = await supabase
            .storage
            .from('files') // specify your storage bucket
            .list(`${req.user.id}/${folderName}`, { recursive: true }) // list files within the folder

        for (const file of files){
            const { data, error: deleteError} = await supabase.storage
                .from("files")
                .remove(`${req.user.id}/${folderName}/${file.name}`)
            if (deleteError) {
                console.error(`Error deleting file ${file.name}:`, deleteError)
            } else {
                console.log(`File ${file.name} deleted successfully!`)
            }
        }


        console.log("Deleted folder from supabase")

        res.redirect("/dashboard")
    } catch (e){
        console.error(e)
    }
}