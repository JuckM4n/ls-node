import mongoose from "mongoose"

export const mongooseConnect = (url) => {
    mongoose.connect(url)
    
    mongoose.connection.on('connected', () => {
      console.log(`Mongoose connection open`)
    })
    
    mongoose.connection.on('error', (err) => {
      console.log('Mongoose connection error: ' + err)
    })
    
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected')
    })
    
    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        console.log('Mongoose connection disconnected app termination')
        process.exit(1)
      })
    })
}
