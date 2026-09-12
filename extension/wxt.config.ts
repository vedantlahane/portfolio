import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Portfolio Form Filler',
    description: 'Smart, cross-browser form filling powered by your portfolio source of truth',
    version: '1.0.0',
    permissions: [
      'activeTab',
      'storage',
      'scripting'
    ],
    host_permissions: [
      '<all_urls>'
    ],
    action: {
      default_title: 'Portfolio Form Filler'
    },
    browser_specific_settings: {
      gecko: {
        id: 'portfolio-form-filler@vedantlahane.com',
        strict_min_version: '109.0'
      }
    }
  }
});
