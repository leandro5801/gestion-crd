'use strict'

/**
 * Copiar este archivo en:
 *   src/api/me/routes/me.js
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/me/data-scope',
      handler: 'me.dataScope',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
}
