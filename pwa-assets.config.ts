import {
  combinePresetAndAppleSplashScreens,
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  // Іконки 192/512, maskable, apple-touch-icon і splash-скріни iOS з public/logo.svg
  preset: combinePresetAndAppleSplashScreens(minimal2023Preset, {
    padding: 0.3,
    resizeOptions: { background: '#1f1b16', fit: 'contain' },
    darkResizeOptions: { background: '#1f1b16', fit: 'contain' },
    linkMediaOptions: { log: true, addMediaScreen: true, xhtml: false },
  }, ['iPhone 17 Pro', 'iPhone 17 Pro Max', 'iPhone 17', 'iPhone 16e', 'iPhone 13 mini', 'iPhone SE 4.7"']),
  images: ['public/logo.svg'],
})
