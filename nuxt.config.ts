// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  modules: ['@nuxtjs/tailwindcss'],

  app: {
    head: {
      title: 'Dailogger',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#10b981' },
        { name: 'description', content: 'Daily health logger' },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.json' },
      ],
    },
  },
})
