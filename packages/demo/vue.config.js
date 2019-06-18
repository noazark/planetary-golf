module.exports = {
  lintOnSave: true,
  chainWebpack: config => config.resolve.symlinks(false)
};
