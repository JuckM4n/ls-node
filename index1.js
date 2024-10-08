const yargs = require('yargs')
const path = require('path')
const fs = require('fs')

const args = yargs
  .usage('Usage: node $0 [options]')
  .version('0.0.1')
  .alias('version', 'v')
  .help('help')
  .alias('help', 'h')
  .example('node $0 --entry ./path --dist ./path --delete')
  .option('entry', {
    alias: 'e',
    describe: 'Указать путь к исходной диретории',
    demandOption: true
  })
  .option('dist', {
    alias: 'd',
    describe: 'Указать путь к dist директории',
    default: './dist'
  })
  .option('delete', {
    alias: 'D',
    describe: 'Удалять ли исходную папку',
    boolean: true,
    default: false
  })
  .epilog('Моя первая домашка')
  .argv

const config = {
  entry: path.normalize(path.join(__dirname, args.entry)),
  dist: path.normalize(path.join(__dirname, args.dist)),
  delete: args.delete
}


function creteDir(src, callback) {
  fs.mkdir(src, (err) => {
    if (err && err.code === 'EEXIST') {
      callback(null)
    } else if (err) {
      callback(err)
    } else {
      callback(null)
    }
  })
}

function copyFile(src, dest, callback) {
  fs.copyFile(src, dest, (err) => {
    if (err) {
      callback(err)
    } else {
      callback(null)
    }
  })
}

function removeDir(path, callback) {
  fs.rmdir(path, { recursive: true }, (err) => {
    if (err) {
      callback(err)
    } else {
      console.log("Папка удалена")
    }

  })
}

function sorter(src) {
  fs.readdir(src, (err, files) => {
    if (err) throw err

    files.forEach((file) => {
      const currentPath = path.join(src, file)

      fs.stat(currentPath, (err, stat) => {
        if (err) throw err

        if (stat.isDirectory()) {
          sorter(currentPath)
        } else {
          creteDir(config.dist, (err) => {
            if (err) throw err

            const folderName = path.join(config.dist, file[0].toUpperCase())

            creteDir(folderName, (err) => {
              if (err) throw err

              const destinationPath = path.join(folderName, file)
              copyFile(currentPath, destinationPath, (err) => {
                if (err) throw err

                removeDir(config.entry, (err) => {
                  if (err) throw err
                })
              })
            })
          })
        }
      })
    })

  })
}



try {
  sorter(config.entry)
  console.log('done!!')
} catch (error) {
  console.log(error)
}