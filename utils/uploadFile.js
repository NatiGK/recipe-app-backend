const fs = require("fs");
// import uniqueString from 'unique-string';
const uploadFile = (base64data,ext, count, imgsCount)=>{
    data = base64data.replace(/^data:image\/(png|jpeg);base64,/, "")
    const fileName = +Date.now().toString()+`${count}${imgsCount}.`+ext;
    const path = `${__dirname}/../public/images/${fileName}`;
    fs.writeFile(path,data,'base64',(err)=>{
        if(err){
            throw new Error('Failed to save the image.');
        }
    });
    return fileName;
} 
module.exports = uploadFile;