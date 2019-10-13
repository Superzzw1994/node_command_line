#!/usr/local/bin/node
const program = require('commander')
const api = require('./api')
program.option('-show --show', 'show all task')

program
  .command('add <任务名称> [任务描述]')
  .description('添加一个任务')
  .action((...args) => {
    let tasks = args.splice(0, args.length - 1).join('')
    api.add(tasks)
  })


program
  .command('clear')
  .description('清除所有任务')
  .action(() => {
    api.clear()
  })

if (process.argv.length === 2) {
  api.showAll()
}
program.parse(process.argv)