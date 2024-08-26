const { defineConfig } = require('@vue/cli-service')


module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [
            require('tailwindcss'),
            require('autoprefixer'),
          ],
        },
      },
    },
  },
  configureWebpack: {
    output: {
      libraryExport: 'default'
    }
  },
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('vue-')
        }
      }))
    
    // Add this new rule
    config.module
      .rule('css')
      .oneOf('vue')
      .use('postcss-loader')
      .tap(options => {
        options.postcssOptions = {
          plugins: [
            require('tailwindcss'),
            require('autoprefixer')
          ]
        }
        return options
      })
  }
})
