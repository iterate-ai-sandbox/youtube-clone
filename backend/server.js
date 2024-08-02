const express = require('express')
const router = require('./Router/router')
const app = express()
const path = require('path')
const port = 3000
const bodyParser = require('body-parser')
const cors = require('cors')
const connectDB = require('./Database/database')
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')))
const allowedOrigins = ['http://iterate.rkph.me', 'https://iterate.rkph.me', 'https://iterate-clone.vercel.app', 'http://iterate-clone.vercel.app', 'http://localhost:5173', 'http://iterate.fliptart.xyz', 'https://iterate.fliptart.xyz', 'https://iterate-ai-sandbox-youtube-clone-main.iterate-ai.com', 'http://iterate-ai-sandbox-youtube-clone-main.iterate-ai.com']
// Middlewares
app.use(
 cors({
  //   origin: ['http://iterate.rkph.me', 'https://iterate.rkph.me', 'https://iterate-clone.vercel.app', 'http://iterate-clone.vercel.app', 'http://localhost:5173', 'http://iterate.fliptart.xyz', 'https://iterate.fliptart.xyz', 'https://iterate-ai-sandbox-youtube-clone-main.iterate-ai.com', 'http://iterate-ai-sandbox-youtube-clone-main.iterate-ai.com'],
  origin: function (origin, callback) {
   // here !origin allows requests with no origin like curl requests
   if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.includes('localhost') || origin.includes('vercel.app')) {
    callback(null, true)
   } else {
    callback(new Error('Not allowed by CORS'))
   }
  },
  //   origin: '*',
  // allowedHeaders: [
  //   "Content-Type",
  //   "Authorization",
  //   "Origin",
  //   "X-Requested-With",
  //   "Accept",
  // ],
  // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
 })
)
app.use(router)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.urlencoded({extended: true}))
connectDB()
 .then(() => {
  console.log(`MongoDB Connected from server.js`)
  app.listen(port, () => {
   console.log(`Example app listening on port ${port}`)
  })
 })
 .catch(error => {
  console.log(`MongoDB Connection Error: ${error} from server.js`)
 })
