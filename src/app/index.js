// @flow
import path from 'path'
import glob from 'glob'
import Generator from 'yeoman-generator'
import tmp from 'tmp'
import ora from 'ora'
import { Clone } from 'nodegit'

type Answers = {
  url: string
}

export default class extends Generator {
  answers: Answers

  constructor(...args: Array<*>) {
    super(...args)
    this.argument('url', { type: String, required: false })
  }

  async prompting() {
    this.answers = await this.prompt([{
      name: 'url',
      message: 'What is the url of the repository you want to clone?',
      when: typeof this.options.url === 'undefined'
    }])

    this.answers.url = this.answers.url || this.options.url
  }

  async writing() {
    const { name: cwd } = tmp.dirSync()
    const spinner = ora(`Cloning ${this.answers.url} ...`).start()
    await Clone(this.answers.url, cwd)
    spinner.stop()
    const ignore = ['**/.git/**']
    const files: Array<string> = glob.sync('**/*', { cwd, ignore, dot: true })

    files.forEach((file) => {
      this.fs.copy(path.join(cwd, file), this.destinationPath(file))
    })
  }
}
