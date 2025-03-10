const fs = require('fs');
const prisma = require('../prisma')
const { validateFolder } = require('../validation/folderValidator')
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

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
                }
            },
        })
        // console.log(user.folders)
    }

    res.render("dashboard", {
        user: user
    })
}

exports.uploadFile = async(req, res) => {
    const file = req.file
    const folderId = parseInt(req.body.folderId)
    console.log(file)
    
    const fileStream = fs.createReadStream(file.path);
    try{
        const { data, error} = await supabase.storage
            .from('files')
            .upload(`uploads/${file.originalname}`, fileStream, {
                contentType: 'application/pdf',
                cacheControl: '3600',
                upsert: false
              });
        console.log('e', file.path)
        if (error) {
            return next(error)
        }

        const fileUrl = await supabase.storage
            .from('files')
            .getPublicUrl(`uploads/${file.originalname}`)
        // console.log('e', fileUrl)
        
        console.log("File upload Success")
        

        await prisma.file.create({
            data : {
                name: file.originalname,
                folder: folderId
                    ? { connect: { id: parseInt(folderId) } }
                    : undefined,
                url: fileUrl.data.publicUrl,
                inFolder: folderId? true : false
            }
        })

        res.redirect("/dashboard")

    } catch (error) {
        console.error(error)
    }
}

exports.createFolder = [
    validateFolder,
    async(req, res) => {
        const folderName = req.body.folderName
        const userId = req.body.userId

        try{
            await prisma.folder.create({
                data : {
                    name: folderName,
                    user : {
                        connect: { id: parseInt(userId)}
                    }
                }
            })
            console.log("Folder created")
            res.redirect("/dashboard")
        } catch (e) {
            console.error('Error creating folder', e)
        }
    }
]