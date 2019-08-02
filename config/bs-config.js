
module.exports = {
    
  ui: {
    port: 3001,
    weinre: {
      port: 8080
    }
  },
  port: 3000,
  server: {
    baseDir: './htdocs'
  },
  files: './htdocs/**/*',
  open: 'external',
  tunnel: false,
  notify: false,
  online: true
};