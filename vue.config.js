//const path = require("path");

module.exports = {
    runtimeCompiler: true,
    productionSourceMap: false,
    filenameHashing: false,
    // chainWebpack: config => {
    //   config.plugin('define').tap(args => {
    //     args[0].__BUILDSTAMP__ = new Date().toDateString();
    //     return args
    //   })
    //   config.output.filename =  'app-[name].js';
    // },
  	configureWebpack : config => {
      //config.output.buildstamp = new Date().toDateString(),
  		config.output.filename =  'app-[name].js';
  	},
	 devServer: {
        //proxy: 'http://127.0.0.1:8080/',
        public: 'http://127.0.0.1:8080/',
        host : '0.0.0.0',
        disableHostCheck: true,
        allowedHosts: [
          'app.cherrybase.com','api.cherrybase.com',
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
      'page' : {
        entry: './src/main.js',
        template: 'public/app-page.html',
        filename: 'app-page.html',
        title: 'Page',
        chunks: ['chunk-vendors', 'chunk-common', 'page']
      },
      'contak' : {
        entry: './src/main.js',
        template: 'public/app-contak.html',
        filename: 'app-contak.html',
        title: 'contak',
        chunks: ['chunk-vendors', 'chunk-common', 'contak']
      },
      'front' : {
        entry: './src/main.js',
        template: 'public/app-front.html',
        filename: 'app-front.html',
        title: 'Front Page',
        chunks: ['chunk-vendors', 'chunk-common', 'front']
      },
      'account' : {
        entry: './src/main.js',
        template: 'public/app-account.html',
        filename: 'app-account.html',
        title: 'Account Aapp',
        chunks: ['chunk-vendors', 'chunk-common', 'account']
      },
      'partner' : {
        entry: './src/main.js',
        template: 'public/app-partner.html',
        filename: 'app-partner.html',
        title: 'Partner Aapp',
        chunks: ['chunk-vendors', 'chunk-common', 'partner']
      },
      'cpanel' : {
        entry: './src/main.js',
        template: 'public/app-cpanel.html',
        filename: 'app-cpanel.html',
        title: 'Cpanel Aapp',
        chunks: ['chunk-vendors', 'chunk-common', 'cpanel']
      },
      'admin' : {
        entry: './src/main.js',
        template: 'public/app-admin.html',
        filename: 'app-admin.html',
        title: 'Admin Aapp',
        chunks: ['chunk-vendors', 'chunk-common', 'admin']
      },
      'agent' : {
        entry: './src/main.js',
        template: 'public/app-agent.html',
        filename: 'app-agent.html',
        title: 'Agent Aapp',
        chunks: ['chunk-vendors', 'chunk-common', 'agent']
      },
      'customer' : {
        entry: './src/main.js',
        template: 'public/app-customer.html',
        filename: 'app-customer.html',
        title: 'Customer Aapp',
        chunks: ['chunk-vendors', 'chunk-common', 'customer']
      },
      'dev' : {
        entry: './src/main.js',
        template: 'public/app-dev.html',
        filename: 'app-dev.html',
        title: 'Dev Aapp',
        chunks: ['chunk-vendors', 'chunk-common', 'dev']
      },
      'index' : {
        entry: './src/main.js',
        template: 'public/index.html',
        filename: 'index.html',
        title: 'Index Aapp',
        chunks: ['chunk-vendors', 'chunk-common', 'index']
      },
      'content' : {
        entry: './src/main.js',
        template: 'public/app-content.html',
        filename: 'app-content.html',
        title: 'Content Aapp',
        chunks: ['chunk-vendors', 'chunk-common', 'content']
      },
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
