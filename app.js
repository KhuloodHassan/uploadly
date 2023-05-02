const express = require('express')
const app = express()
const multer = require('multer')
const port = process.env.PORT || 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ 
    storage: storage, 
    limits: { fileSize: 50000000000 } 
})

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
});

// app.get('/uploads', (req, res) => {
//     res.sendFile(__dirname + '/uploads.html')
// })

app.post('/uploadFile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
        res.status(400).send('Please upload a file')
        // const error = new Error('Please upload a file')
        // error.httpStatusCode = 400
        // return next(error)
    }
    res.sendFile(__dirname + '/uploads.html');
})

app.listen(port, ()=>{
        console.log(`App is listening on port ${port}`);
});