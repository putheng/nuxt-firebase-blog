const generateDynamicRoutes = require('./helpers/generateDynamicRoutes.js')

module.exports = {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Putheng Blog',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'A Social Blog example which uses Nuxt + Firebase.' },
      { hid: 'robots', name: 'robots', content: 'index, follow'},
      { hid: 'language', name: 'language', content: 'English'},
      { hid: 'author', name: 'author', content: 'github@ilyasbilgihan'},
      { name: 'format-detection', content: 'telephone=no' },
      { hid: 'twitter:site', name: 'twitter:site', content: '@ilyasbilgihan'},
      { hid: 'twitter:creator', name: 'twitter:creator', content: '@ilyasbilgihan'},
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image'},
      { hid: 'og:site_name', name: 'og:site_name', content: 'Putheng Blog'},
      { hid: 'og:title', name: 'og:title', content: 'Putheng Blog'},
      { hid: 'og:description', name: 'og:description', content: 'A Social Blog example which uses Nuxt + Firebase.'},
      { hid: 'og:image', name: 'og:image', content: 'https://firebasestorage.googleapis.com/v0/b/nuxt-blog-exercise.appspot.com/o/external%2Fbig-logo.png?alt=media&token=bb5e45d2-0909-46cc-a25b-3e9adac0a28c'},
      { hid: 'og:image:alt', name: 'og:image:alt', content: 'Putheng Blog'},
      { hid: 'twitter:image', name: 'twitter:image', content: 'https://firebasestorage.googleapis.com/v0/b/nuxt-blog-exercise.appspot.com/o/external%2Fbig-logo.png?alt=media&token=bb5e45d2-0909-46cc-a25b-3e9adac0a28c'},
      { hid: 'twitter:image:alt', name: 'twitter:image:alt', content: 'Putheng Blog'},
      { hid: 'google-site-verification', name: 'google-site-verification', content: 'QuV9Mq96f5fN08e96TMDN9X-J8u4L2bfbma_OZdKt6E'}
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~assets/iconsax-css/style.css',
  ],

  router: {
    middleware: ['authControl']
  },
  
  render: {
    bundleRenderer: {
      runInNewContext: false // https://firebase.nuxtjs.org/community/faq/#firestore-using-array-contains-or-array-contains-any-does-not-work
    }
  },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/firebase.js',
    '~/plugins/element-ui.js',
    { src: '~/plugins/el-input-tag.js', mode: 'client'},
    { src: '~/plugins/vue-quill.js', ssr: false}
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/moment',
  ],
  
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "@nuxtjs/sitemap"
  ],

  sitemap: {
    path: '/site_map.xml',
    hostname: 'https://nuxt-blog-exercise.web.app',
    exclude: [
      '/admin-panel',
      '/account',
      '/feed',
      '/write-post',
      '/bookmarks',
      '/tag',
    ],
    routes: async () => {
      const routes = await generateDynamicRoutes()
      return routes
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
  
}
