const gh = require('gh-pages')

gh.publish('dist', {
  branch: 'master',
  repo: 'https://github.com/Yahohoo/new-calendar',
})
