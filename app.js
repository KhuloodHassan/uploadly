const express = require('express')
const app = express()
const multer = require('multer')
const path = require('path')
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

//serves static files - CSS, HTML, images, client-side
app.use(express.static('./public'));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/uploadFile', upload.single('myFile'), (req, res, err) => {
    const file = req.file
    if (!file) {
        res.status(400).send('Please upload a file')
    }
    res.sendFile(__dirname + '/uploads.html');
    res.redirect('/uploads.html')
})

//Uploads page
app.get('/uploads', (req, res) => {
    const uploadsDir = path.join(__dirname, './uploads')
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            const filePaths = files.map(file => `./uploads/${file}`);
            res.render('/uploads', { files: filePaths});
        }
    })
})

app.listen(port, ()=>{
        console.log(`App is listening on port ${port}`);
});