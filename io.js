const fs = require('fs')

const read = (path) => {
  let option = {
    flag: 'a+'
  }
  return new Promise((resolve, reject) => {
    fs.readFile(path, option, (err, content) => readFileCallback(err, content, resolve, reject))
  })
}

const readFileCallback = (err, content, resolve, reject) => {
  let list
  if (err) {
    return reject(err)
  }
  try {
    list = JSON.parse(content.toString())
  } catch(err) {
    list = []
  }
  resolve(list)
}

const add = (title, list) => {
  list.push({
    title,
    done: false
  })
  return list
}

const write = (path, content) => {
  let str = JSON.stringify(content)
  return new Promise((resolve, reject) => fs.writeFile(path, str, (err) => writeFileCallBack(err, resolve, reject))) 
}

const writeFileCallBack = (err, resolve, reject) => {
  if (err) {
    return reject(false)
  } 
  resolve(true)
}

module.exports = {
  read,
  add,
  write
}