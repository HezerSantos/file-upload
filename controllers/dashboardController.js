const { da } = require('date-fns/locale');
const prisma = require('../prisma')
const { validateFolder } = require('../validation/folderValidator')
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');


const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
exports.getDashboard = async(req, res) => {
    let user
    if (req.user){
        user = await prisma.user.findUnique({
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
        // console.log('user object:', user)
    }


    res.render("dashboard", {
        user: user
    })
}

exports.uploadFile = async(req, res, next) => {
    const file = req.file
    const folderId = parseInt(req.body.folderId)
    console.log(folderId)
    
    try{
        // const { data, error} = await supabase.storage
        //     .from('files')
        //     .upload(`uploads/${file.originalname}`, file.buffer,{
        //         contentType: file.mimetype,
        //         cacheControl: '3600',
        //         upsert: false
        //       });
        // // console.log('e', file.path)
        // if (error) {
        //     return next(error)
        // }
        
        console.log("File upload Success")

        await prisma.file.create({
            data : {
                name: file.originalname,
                folderId: folderId? folderId : undefined,
                inFolder: folderId? true : false,
                userId: req.user.id,
            }
        })

        res.redirect("/dashboard")

    } catch (error) {
        console.log('error')
        console.error(error)
    }
}

exports.downloadFile = async(req, res, next) => {
    const fileName = req.params.filename
    try{
        const { data, error } = await supabase
            .storage
            .from('files')
            .download(`uploads/${fileName}`);
        console.log(data)
        const buffer = Buffer.from(await data.arrayBuffer());

        res.setHeader('Content-Type', data.type);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.send(buffer)

    } catch (e) {
        console.error('Error:', e)
        return next(error)
    }

}

exports.createFolder = [
    validateFolder,
    async(req, res) => {
        const folderName = req.body.folderName
        const userId = parseInt(req.body.userId)

        try{
            await prisma.folder.create({
                data : {
                    name: folderName,
                    userId: userId
                }
            })
            console.log("Folder created")
            res.redirect("/dashboard")
        } catch (e) {
            console.error('Error creating folder', e)
        }
    }
]