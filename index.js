#! /usr/bin/env node
const chalk = require('chalk')
console.log('hello jyh-cli!!!')
console.log(chalk.green('init创建...'))
const fs = require('fs')
const { Command } = require('commander')
const download = require('download-git-repo')
const inquirer = require('inquirer')
const ora = require('ora')
const symbols = require('log-symbols')
const handlebars = require('handlebars')

const program = new Command()

program
  .version(require('./package.json').version, '-v --version')
  .command('init <name>')
  .action((name) => {
    if (!fs.existsSync(name)) {
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'description',
            message: '请输入项目描述:',
            default: 'nextjs-template',
          },
          {
            type: 'input',
            name: 'author',
            message: '请输入项目作者:',
          },
          {
            type: 'input',
            name: 'template',
            message: '请输入项目类型(nextjs):',
            default: 'nextjs',
          },
        ])
        .then((answers) => {
          const spinner = ora('正在创建...')
          spinner.start()
          download(
            'https://github.com:jyh-sadsss/next-template#master',
            name, // 下载模板的路径，这个路径是相对路径，拼接在执行这个命令的路径下面
            // { clone: true },
            (error) => {
              if (error) {
                spinner.fail()
                console.log(symbols.error, chalk.red(error))
              } else {
                spinner.succeed()
                const fileName = `${name}/package.json`
                const meta = {
                  name,
                  description: answers.description,
                  author: answers.author,
                }
                if (fs.existsSync(fileName)) {
                  const content = fs.readFileSync(fileName).toString()
                  const result = handlebars.compile(content)(meta)
                  fs.writeFileSync(fileName, result)
                }
                console.log(symbols.success, chalk.green('项目初始化完成!!!'))
              }
            }
          )
        })
    } else {
      console.log(sym.error, chalk.red('项目已存在'))
    }
  })

program.parse(process.argv)
