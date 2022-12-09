require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
// create https 
const https = require('https')
const path = require('path')
const fs = require ('fs')

// initialize requreis app 
const app = express()

//sslServer.listen(5000, () => console.log('Secure Server '))

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true
}))

// Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/productRouter'))
app.use('/api', require('./routes/paymentRouter'))



// Connect to mongodb
const URI = process.env.MONGODB_URL
const PORT = 5001

//create SSL Server
const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
},app)

mongoose
    .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        sslServer.listen(PORT, () => console.log('Secure server on ', PORT))
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        if(err) throw err;
        console.error(err.message)
    });


app.use('/',(req, res, next)=> {
    res.send('Hello from SSL Server')
})