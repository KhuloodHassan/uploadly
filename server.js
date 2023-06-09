const express = require('express')
const app = express()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
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

// Sets the view engine and the views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//serves static files - CSS, HTML, images, client-side
app.use(express.static('./public'));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/uploadFile', upload.single('myFile'), (req, res, err) => {
    const file = req.file
    if (!file) {
        res.status(400).send('Please upload a file')
    }
    // extract name from file object and save in fileName variable
    const fileName = file.originalname;
    res.redirect('/uploads')
    
    //res.render('/uploads.ejs');
    //res.sendFile(__dirname + '/uploads.html');
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
            // Add path: path so we can access the path module in ejs
            res.render('uploads.ejs', { files: filePaths, fileName: req.query.fileName, path: path });
        }
    })
})

//Sets route for downloading files from uploads directory and sends to client for download
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath, (err) => {
      if (err) {
        console.log('Error downloading file:', err);
        res.status(500).send('Internal Server Error');
      }
    });
});

app.get('/uploads/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.sendFile(filePath);
});

app.listen(port, ()=>{
        console.log(`App is listening on port ${port}`);
});