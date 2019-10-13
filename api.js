const path = require('path')
const inquirer = require('inquirer')
const io = require('./io')
const homedir = require('os').homedir()
const home = process.env.HOME || homedir
const filePath = path.join(home, '.todo')
const add = async (command) => {
  const result = await io.read(filePath)
  const newContent = io.add(command, result)
  const wirteStatus = await io.write(filePath, newContent)
}

const clear = () => {
  io.write(filePath, [])
}

const showAll = async () => {
  const result = await io.read(filePath) 
  inquirer
  .prompt([
    {
      type: 'list',
      name: 'index',
      message: 'What do you want to do?',
      choices: [{value: '-2', name: '退出'}, ...result.map((task, index) => ({
        name: `[${task.done ? '_' : 'X'}] ${index}.${task.title}`,
        value: index.toString()
      })), {name: '+ 添加任务', value: '-1'}]
    }
  ])
  .then(answer => {
    handleTask(parseInt(answer.index))
  });
}

const handleTask = async (index) => {
  const result = await io.read(filePath) 
  const childChoice = [{
    value: 'quit',
    name: '退出'
  }, {
    value: 'markAsDone',
    name: '已完成'
  },{
    value: 'markAsUnDone',
    name: '未完成'
  },{
    value: 'modifyDetail',
    name: '更改任务'
  },{
    value: 'delete',
    name: '删除',
  }]
  if (index > -1) {
    inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What do you want to do?',
        choices: childChoice
      }
    ])
    .then(answer => {
      handleTaskAction(answer.action, index)
    });
  } else if (index === -1) {
    inquirer.prompt({
      type: 'input',
      name: 'title',
      message: '新的标题'
    }).then(answers => {
      result.push({
        title: answers.title,
        done: false
      })
      io.write(filePath, result)
    })
  }
}
const handleTaskAction = async (action, index) => {
  const result = await io.read(filePath) 
  switch (action) {
    case 'quit':
      break
    case 'markAsDone':
      result[index].done = true
      io.write(filePath, result)
      break
    case 'markAsUnDone':
      result[index].done = false
      io.write(filePath, result)
      break
    case 'modifyDetail':
      inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '新的标题',
        default: result[index].title
      }).then(answers => {
        result[index].title = answers.title
        io.write(filePath, result)
      })
      break
    case 'delete':
      result.splice(index, 1)
      io.write(filePath, result)
      break
  }
}
module.exports = {
  add,
  clear,
  showAll
}