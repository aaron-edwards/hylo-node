const gaze = require('gaze')
const minimist = require('minimist')
const child_process = require('child_process')
const debounce = require('lodash/debounce')

module.exports = function (grunt) {
  grunt.registerTask('autotest', function () {
    this.async()

    const argv = minimist(process.argv)
    const file = argv.file || argv.f
    const run = './node_modules/.bin/babel-node ./node_modules/.bin/_mocha -R min'
    const cmd = run + (file ? ' -- ' + file : '')

    gaze(['api/**/*', 'lib/**/*', 'test/**/*'], function (_, watcher) {
      this.on('all', debounce(() => {
        child_process.spawn('bash', ['-c', cmd], {stdio: 'inherit'})
      }, 500, true))
    })
  })
}
