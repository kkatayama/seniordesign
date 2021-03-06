const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const upload = require('express-fileupload')


dotenv.config({
    path: './.env'
})

const app = express();


const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DATABASE_USER,
    password: 'CODSNIPER26$',
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({
    extended: false
}));

app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');



db.connect(function(err){
    if (err) {
        console.log('DB Error');
        throw err;
        return false;
    }
});

app.use(upload())


app.post('/', (req, res) => {
    if (req.files){
        console.log(req.files)
        var file = req.files.file
        var filename = file.name
        console.log(filename)

        file.mv('./uploads/'+filename,function (err){
            if (err){
                res.send(err)
            } else{
                res.send("File Uploaded")
            }
        })
    }
})

app.use('/', require('./routes/pages.js'));

app.use('/auth', require('./routes/auth'))

app.listen(3000, () => {
    console.log("Server started on port 3000");
})