import chalk from 'chalk'
import figures from 'figures'
import _ from 'lodash'

const NS_SEPERATOR = chalk.blue(figures(' › '))

const ICONS = {
  start: figures('●'),
  info: figures('ℹ'),
  success: figures('✔'),
  error: figures('✖'),
  fatal: figures('✖'),
  warn: figures('⚠'),
  debug: figures('…'),
  trace: figures('…'),
  default: figures('❯'),
  ready: figures('♥')
}

const pad = str => _.padEnd(str, 9)

export default class FancyReporter {
  constructor (stream, options = {}) {
    this.stream = stream || process.stderr
  }

  formatBadge (type, color = 'blue') {
    return chalk['bg' + _.startCase(color)].black(` ${type.toUpperCase()} `) + ' '
  }

  formatTag (type, color = 'blue') {
    const icon = ICONS[type] || ICONS.default
    return chalk[color](pad(`${icon} ${type.toLowerCase()}`)) + ' '
  }

  clear () {
    this.stream.write('\x1b[2J\x1b[0f')
  }

  log (logObj) {
    let message = logObj.message

    if (logObj.scope) {
      message =
        (logObj.scope.replace(/:/g, '>') + '>').split('>').join(NS_SEPERATOR) +
        message
    }

    if (logObj.clear) {
      this.clear()
    }

    if (logObj.badge) {
      this.stream.write('\n\n' + this.formatBadge(logObj.type, logObj.color) + message + '\n\n')
    } else {
      this.stream.write(this.formatTag(logObj.type, logObj.color) + message + '\n')
    }

    if (logObj.additional) {
      const lines = logObj.additional.split('\n').map(s => '   ' + s).join('\n')
      this.stream.write(chalk.grey(lines) + '\n')
    }
  }
}
