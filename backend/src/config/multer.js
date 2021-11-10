const multer = require("multer");
const path = require('path');
const crypto = require('crypto');

module.exports = {
    dest: path.resolve(__dirname, '..','..','uploads'),
    storage:multer.diskStorage({
        // local de destino do arquivo
        destination:(req, file, cb) =>{
            cb(null,path.resolve(__dirname, '..','..','uploads'));
        },
        filename:(req, file, cb)=>{
            crypto.randomBytes(16,(err, hash)=>{
                if(err) cb(err);
                const  filename = `${hash.toString('hex')}-${file.originalname}`;
                cb(null, filename);
            })
        }
    }),
    // setando tamanho limite do arquivo 2mb
    limits:{
        fileSize:2 * 1024 * 1024
    },
    // setando Filtro de extensao do arquivo
    fileFilter:(req,file,cb)=>{
        const allowedMimes = [
            "image/jpeg",
            "image/pjepg",
            "image/png",
            "image/gif"
        ];
        // verificando errors
        if(allowedMimes.includes(file.mimetype)){
            cb(null,true);
        }
        else{
            cb(new Error("Invalid type File!"));
        }
    }
}
