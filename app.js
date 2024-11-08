import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import createError from 'http-errors'
import logger from 'morgan'
import router from './router/index.js'
import { mongooseConnect } from './model/connection.js'
import { config } from 'dotenv'

config()

const __filename = fileURLToPath(import.meta.url)

global.__dirname = path.dirname(__filename)

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'build')))
app.use(express.static(path.join(__dirname, 'upload')))

app.use('/api', router)
app.use('*', (_req, res) => {
    const file = path.resolve(__dirname, 'build', 'index.html')
    res.sendFile(file)
  })

app.use(function(req, res, next) {
  next(createError(404))
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
})


app.listen(process.env.PORT || 3000, () => {
    console.log('server is run')

    mongooseConnect(process.env.DB_URL)
})