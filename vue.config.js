//const path = require("path");

module.exports = {
    runtimeCompiler: true,
    productionSourceMap: false,
    filenameHashing: false,
  	configureWebpack: {
  		output: {
  	   		filename: 'app.js'
  		}
  	},
	 devServer: {
        proxy: 'http://127.0.0.1:8080/',
        public: 'http://127.0.0.1:8080/',
        host : '0.0.0.0',
        disableHostCheck: true,
        allowedHosts: [
          'app.mehery.com','api.mehery.com',
          'api.lalittanwar.com',
          'subdomain.host.com',
          'subdomain2.host.com',
          'host2.com',
        ],
        //historyApiFallback: false,
        // historyApiFallback: {
        //   rewrites: [
        //     { from: /\/admin/, to: '/admin-index.html' },
        //     { from: /\/agent/, to: '/agent-index.html' },
        //     { from: /\/account/, to: '/index-account.html' }
        //   ]
        // },
        // writeToDisk: true,
        // after: devServer => {
        //   // if devServer hasn't responded to the request, we can assume no matches
        //   devServer.use((req, res, next) => {
        //     const notFoundPage = path.resolve(__dirname, "./dist/404/index.html");
        //     res.status(404).sendFile(notFoundPage);
        //   });
        // },
    },

    pages : {
      'front' : {
        entry: './src/main.js',
        template: 'public/index-front.html',
      },
      'account' : {
        entry: './src/main.js',
        template: 'public/index-account.html',
      },
      'admin' : {
        entry: './src/main.js',
        template: 'public/index-admin.html',
      },
      'agent' : {
        entry: './src/main.js',
        template: 'public/index-agent.html',
      },
      'customer' : {
        entry: './src/main.js',
        template: 'public/index-customer.html',
      },
      'dev' : {
        entry: './src/main.js',
        template: 'public/index-dev.html',
      }
    },


    // pages: {
    //   'admin': {
    //     entry: './src/owa-admin/main.js',
    //     template: 'public/admin-index.html',
    //     filename: 'admin-index.html',
    //     title: 'Admin',
    //     //chunks: [ 'chunk-vendors', 'chunk-common', 'index' ]
    //   },
    //   'agent': {
    //     entry: './src/owa-agent/main.js',
    //     template: 'public/agent-index.html',
    //     filename: 'agent-index.html',
    //     title: 'Agent',
    //     //chunks: [ 'chunk-vendors', 'chunk-common', 'about' ]
    //   }
    // },

    publicPath: process.env.NODE_ENV === 'production'
        ? './'
        : '/'

        
}