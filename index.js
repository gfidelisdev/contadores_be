var express = require('express')
var app = express()
var env = require('./.env')
var cors = require('cors')
const route = require('./routes')

app.use(cors())
app.use(express.json())

var http = require('http').createServer(app)

http.listen(env.PORT,()=>{
  console.log(`listening on PORT ${env.PORT}`)
})

let options = {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
}

route(app)