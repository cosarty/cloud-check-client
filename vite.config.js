import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { join } from 'path'
export default defineConfig({
  plugins: [
    uni(),
  ],
  build: {
    rollupOptions: {

    }
  },
  resolve: {
    alias: [{ find: '@', replacement: join(__dirname, 'src') }],
    extensions: ['.js', '.json', '.ts', '.vue'],
  },
  css: {
    preprocessorOptions: {
      // 全局样式引入
      scss: {
        additionalData: '@import "uview-plus/index.scss";',
      },
    },
  },
  transpileDependencies: ['uview-plus']
})
