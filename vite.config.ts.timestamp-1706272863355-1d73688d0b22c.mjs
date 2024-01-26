// build/vite/plugin/index.ts
import vue from "file:///E:/Desktop/vscodeWorkspace/tauri_demo/tauri_app/tauriDRT/node_modules/.pnpm/@vitejs+plugin-vue@4.5.0_vite@5.0.3_vue@3.3.9/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///E:/Desktop/vscodeWorkspace/tauri_demo/tauri_app/tauriDRT/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.0.3_vue@3.3.9/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import Inspect from "file:///E:/Desktop/vscodeWorkspace/tauri_demo/tauri_app/tauriDRT/node_modules/.pnpm/vite-plugin-inspect@0.7.42_vite@5.0.3/node_modules/vite-plugin-inspect/dist/index.mjs";

// build/vite/plugin/style.ts
function configStylePlugin() {
  const plugin = [];
  return plugin;
}

// build/vite/plugin/svg.ts
import path from "path";
import { createSvgIconsPlugin } from "file:///E:/Desktop/vscodeWorkspace/tauri_demo/tauri_app/tauriDRT/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.0.3/node_modules/vite-plugin-svg-icons/dist/index.mjs";
function configSvgPlugin() {
  const svgPlugin = createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
    // 压缩配置
    // svgoOptions: false,
    // 指定symbolId格式
    symbolId: "icon-[dir]-[name]"
  });
  return svgPlugin;
}

// build/vite/plugin/compress.ts
import viteCompression from "file:///E:/Desktop/vscodeWorkspace/tauri_demo/tauri_app/tauriDRT/node_modules/.pnpm/vite-plugin-compression@0.5.1_vite@5.0.3/node_modules/vite-plugin-compression/dist/index.mjs";
function configCompressPlugin(compress, disable = false) {
  let options = {};
  if (compress === "gzip") {
    options = {
      ext: ".gz",
      algorithm: "gzip"
    };
  }
  if (compress === "brotli") {
    options = {
      ext: ".br",
      algorithm: "brotliCompress"
    };
  }
  const plugin = [
    viteCompression({
      verbose: true,
      disable,
      ...options
    })
  ];
  return plugin;
}

// build/vite/plugin/mock.ts
import { vitePluginFakeServer } from "file:///E:/Desktop/vscodeWorkspace/tauri_demo/tauri_app/tauriDRT/node_modules/.pnpm/vite-plugin-fake-server@2.0.0/node_modules/vite-plugin-fake-server/dist/index.mjs";
function configMockPlugin() {
  return vitePluginFakeServer({
    logger: false,
    include: "mock",
    infixName: false,
    enableProd: true
  });
}

// build/vite/plugin/pwa.ts
import { VitePWA } from "file:///E:/Desktop/vscodeWorkspace/tauri_demo/tauri_app/tauriDRT/node_modules/.pnpm/vite-plugin-pwa@0.17.2_vite@5.0.3_workbox-build@7.0.0_workbox-window@7.0.0/node_modules/vite-plugin-pwa/dist/index.js";
function configPwaPlugin() {
  const options = {
    includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "apple-touch-icon.png"],
    logLevel: "silent",
    manifest: {
      name: "tauri-toolkit",
      short_name: "tauri-toolkit",
      description: "\u57FA\u4E8E vue3+vite+element-plus \u642D\u5EFA\u7684\u540E\u53F0\u6A21\u677F",
      theme_color: "#ffffff",
      icons: [
        {
          src: "/pwa/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/pwa/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png"
        },
        {
          src: "/pwa/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable"
        }
      ]
    }
  };
  return VitePWA(options);
}

// build/vite/plugin/visualizer.ts
import visualizer from "file:///E:/Desktop/vscodeWorkspace/tauri_demo/tauri_app/tauriDRT/node_modules/.pnpm/rollup-plugin-visualizer@5.9.3/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
function configVisualizerPlugin() {
  if (process.env.REPORT === "true") {
    return [
      visualizer({
        filename: "./node_modules/.cache/visualizer/stats.html",
        open: true,
        gzipSize: true,
        brotliSize: true
      })
    ];
  } else {
    return [];
  }
}

// build/vite/plugin/imagemin.ts
import viteImagemin from "file:///E:/Desktop/vscodeWorkspace/tauri_demo/tauri_app/tauriDRT/node_modules/.pnpm/vite-plugin-imagemin@0.6.1_vite@5.0.3/node_modules/vite-plugin-imagemin/dist/index.mjs";
function configImageminPlugin() {
  return viteImagemin({
    verbose: false,
    // https://github.com/imagemin/imagemin-gifsicle
    gifsicle: {
      optimizationLevel: 3
    },
    // https://github.com/imagemin/imagemin-optipng
    optipng: {
      optimizationLevel: 7
    },
    // https://github.com/imagemin/imagemin-mozjpeg
    mozjpeg: {
      quality: 30
    },
    // https://github.com/imagemin/imagemin-pngquant
    pngquant: {
      quality: [0.8, 0.9]
    },
    // https://github.com/svg/svgo/#what-it-can-do
    svgo: {
      plugins: [
        {
          name: "removeViewBox"
        },
        {
          name: "removeEmptyAttrs",
          active: false
        }
      ]
    }
  });
}

// build/vite/plugin/i18n.ts
import path2 from "path";
import VueI18nPlugin from "file:///E:/Desktop/vscodeWorkspace/tauri_demo/tauri_app/tauriDRT/node_modules/.pnpm/@intlify+unplugin-vue-i18n@1.5.0_vue-i18n@9.8.0/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
var __vite_injected_original_dirname = "E:\\Desktop\\vscodeWorkspace\\tauri_demo\\tauri_app\\tauriDRT\\build\\vite\\plugin";
function configVueI18nPlugin() {
  return VueI18nPlugin({
    include: [path2.resolve(__vite_injected_original_dirname, "../../../", "./src/locales/modules/**")]
  });
}

// build/vite/plugin/element.ts
import ElementPlus from "file:///E:/Desktop/vscodeWorkspace/tauri_demo/tauri_app/tauriDRT/node_modules/.pnpm/unplugin-element-plus@0.8.0/node_modules/unplugin-element-plus/dist/vite.mjs";
function configAutoElementStylePlugin() {
  return ElementPlus({
    useSource: true
  });
}

// build/vite/plugin/buildOuteInfo.ts
import { readdir, stat } from "fs";
import { join } from "path";
import { green } from "file:///E:/Desktop/vscodeWorkspace/tauri_demo/tauri_app/tauriDRT/node_modules/.pnpm/kolorist@1.8.0/node_modules/kolorist/dist/esm/index.mjs";
import dayjs from "file:///E:/Desktop/vscodeWorkspace/tauri_demo/tauri_app/tauriDRT/node_modules/.pnpm/dayjs@1.11.10/node_modules/dayjs/dayjs.min.js";
import duration from "file:///E:/Desktop/vscodeWorkspace/tauri_demo/tauri_app/tauriDRT/node_modules/.pnpm/dayjs@1.11.10/node_modules/dayjs/plugin/duration.js";
dayjs.extend(duration);
var tost = `\u{1F929}\u4F60\u597D!\u5982\u679C\u60A8\u611F\u89C9\u5185\u5BB9\u8FD8\u4E0D\u9519,\u5728\u53F3\u8FB9\u94FE\u63A5\u7ED9\u4E2Astar\u54E6\u{1F618}! https://github.com/tansen87`;
function getdirsize(dir, callback) {
  let size = 0;
  let fileNumber = 0;
  stat(dir, function(err, stats) {
    if (err)
      throw err;
    if (stats.isFile())
      return callback(1, stats.size);
    readdir(dir, function(err2, files) {
      if (err2)
        throw err2;
      if (files.length == 0)
        return callback(0, 0);
      let count = files.length;
      for (let i = 0; i < files.length; i++) {
        getdirsize(join(dir, files[i]), function(_fileNumber, _size) {
          if (err2)
            throw err2;
          size += _size;
          fileNumber += _fileNumber;
          if (--count <= 0) {
            callback(fileNumber, size);
          }
        });
      }
    });
  });
}
function bytesToSize(bytes, fixed = 2) {
  if (bytes === 0)
    return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(fixed))} ${sizes[i]}`;
}
function viteBuildOuteInfo() {
  let config;
  let startTime, endTime;
  return {
    // 插件名称
    name: "vite-build-oute-info",
    // 该插件在 plugin-vue 插件之前执行，这样就可以直接解析到原模板文件
    enforce: "post",
    transformIndexHtml: {
      order: "post",
      handler: () => {
      }
    },
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    // rollup.rollup在每次开始构建时调用
    buildStart() {
      console.info(["", green(tost), ""].join("\n"));
      if (config.command === "build") {
        startTime = dayjs(/* @__PURE__ */ new Date());
      }
    },
    closeBundle() {
      if (config.command === "build") {
        endTime = dayjs(/* @__PURE__ */ new Date());
        getdirsize(config.build.outDir, (f, s) => {
          console.log(
            `
${green(
              `\u6253\u5305\u5B8C\u6210\u{1F389}\uFF08\u6253\u5305\u6587\u4EF6\u6570\u91CF\uFF1A${f}\uFF0C\u7528\u65F6\uFF1A${dayjs.duration(endTime.diff(startTime)).format("mm\u5206ss\u79D2")}\uFF0C\u6253\u5305\u540E\u7684\u5927\u5C0F\uFF1A${bytesToSize(s)})`
            )}`
          );
        });
      }
    }
  };
}
var buildOuteInfo_default = viteBuildOuteInfo;

// build/vite/plugin/index.ts
function createVitePlugins(_isBuild = false, _configEnv) {
  const vitePlugins = [
    // vue({
    //   reactivityTransform: true,
    // }),
  ];
  vitePlugins.push(
    vue(),
    vueJsx()
    // 如果需要
  );
  vitePlugins.push(configStylePlugin());
  vitePlugins.push(configSvgPlugin());
  vitePlugins.push(configCompressPlugin("gzip", true));
  vitePlugins.push(configMockPlugin());
  vitePlugins.push(configPwaPlugin());
  vitePlugins.push(configVisualizerPlugin());
  vitePlugins.push(configImageminPlugin());
  vitePlugins.push(buildOuteInfo_default());
  vitePlugins.push(configVueI18nPlugin());
  vitePlugins.push(Inspect());
  vitePlugins.push(configAutoElementStylePlugin());
  return vitePlugins;
}

// build/vite/resolve.ts
import path3 from "path";
function createViteResolve(mode, myDirname) {
  const viteResolve = {
    // 引用别名配置
    alias: {
      // 配置@别名
      "@": `${path3.resolve(myDirname, "src")}`,
      // 配置#别名
      "#": `${path3.resolve(myDirname, "types")}`
    },
    // 导入时想要省略的扩展名列表。注意，不 建议忽略自定义导入类型的扩展名（例如：.vue），因为它会干扰 IDE 和类型支持。
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"]
  };
  return viteResolve;
}

// build/vite/build.ts
function createViteBuild() {
  const viteBuild = {
    target: ["es2021", "chrome100", "safari13"],
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
    // 指定输出路径
    outDir: "dist",
    cssTarget: "chrome80",
    // 指定生成静态资源的存放路径
    assetsDir: "static",
    // 启用/禁用 CSS 代码拆分。当启用时，在异步 chunk 中导入的 CSS 将内联到异步 chunk 本身，并在块加载时插入 如果禁用，整个项目中的所有 CSS 将被提取到一个 CSS 文件中。
    cssCodeSplit: true,
    // 构建后是否生成 source map 文件。
    // 启用/禁用 brotli 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。
    brotliSize: false,
    // minify: 'terser',
    // terserOptions: {
    //   compress: {
    //     // 打包清除console
    //     drop_console: true,
    //   },
    // },
    // chunk 大小警告的限制（以 kbs 为单位）
    chunkSizeWarningLimit: 2e3
  };
  return viteBuild;
}

// build/vite/esbuild.ts
function createViteEsbuild(isBuild) {
  return {
    pure: isBuild ? ["console"] : []
  };
}

// build/vite/server.ts
function createViteServer() {
  const viteServer = {
    // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
    host: true,
    // 服务器端口号
    port: 5173,
    // 端口已被占用时是否尝试使用下一个可用的端口 true：直接退出，而不是尝试下一个可用端口 false：尝试下一个可用端口
    strictPort: true,
    // boolean | string 启动项目时自动在浏览器打开应用程序；如果为string，比如"/index.html"，会打开http://localhost:5173/index.html
    // open: true,
    // boolean | CorsOptions  为开发服务器配置 CORS。默认启用并允许任何源，传递一个 选项对象 来调整行为或设为 false 表示禁用。
    // cors: true,
    // 设置为 true 强制使依赖预构建。
    // force: false,
    // 自定义代理规则
    proxy: {
      "/api": {
        target: "",
        changeOrigin: true,
        rewrite: (path4) => path4.replace(/^\/api/, "")
      }
    }
  };
  return viteServer;
}

// build/vite/optimizeDeps.ts
function createViteOptimizeDeps() {
  const viteOptimizeDeps = {
    // 默认情况下，不在 node_modules 中的，链接的包不会被预构建。使用此选项可强制预构建链接的包。
    include: ["element-plus/es/locale/lang/zh-tw", "element-plus/es/locale/lang/en"],
    // 默认情况下，Vite 会抓取你的 index.html 来检测需要预构建的依赖项。如果指定了 build.rollupOptions.input，Vite 将转而去抓取这些入口点。
    entries: [],
    // 在预构建中强制排除的依赖项。
    exclude: ["@zougt/vite-plugin-theme-preprocessor/dist/browser-utils"]
  };
  return viteOptimizeDeps;
}

// build/vite/css.ts
function createViteCSS() {
  const viteCSS = {
    preprocessorOptions: {
      // 配置scss全局样式以及变量
      scss: {
        charset: false,
        additionalData: `
          @use "./src/styles/var/element/theme/index.scss" as *; 
          @use "./src/styles/var/index.scss" as *;
        `,
        javascriptEnabled: true
      }
    }
  };
  return viteCSS;
}

// build/vite/viteTestConfig.ts
var createVitestTest = () => {
  return {
    environment: "jsdom",
    transformMode: {
      web: [/.tsx$/]
    }
  };
};

// vite.config.ts
var __vite_injected_original_dirname2 = "E:\\Desktop\\vscodeWorkspace\\tauri_demo\\tauri_app\\tauriDRT";
var vite_config_default = (configEnv) => {
  const { mode, command } = configEnv;
  const isBuild = command === "build";
  return {
    // 设为 false 可以避免 Vite 清屏而错过在终端中打印某些关键信息。命令行模式下请通过 --clearScreen false 设置。
    clearScreen: false,
    logLevel: "info",
    envPrefix: ["VITE_", "TAURI_"],
    // esbuild
    esbuild: createViteEsbuild(isBuild),
    // vitest配置
    test: createVitestTest(),
    // 解析配置
    resolve: createViteResolve(mode, __vite_injected_original_dirname2),
    // 插件配置
    plugins: createVitePlugins(isBuild, configEnv),
    // 服务配置
    server: createViteServer(),
    // 打包配置
    build: createViteBuild(),
    // 依赖优化配置
    optimizeDeps: createViteOptimizeDeps(),
    // css预处理配置
    css: createViteCSS()
  };
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYnVpbGQvdml0ZS9wbHVnaW4vaW5kZXgudHMiLCAiYnVpbGQvdml0ZS9wbHVnaW4vc3R5bGUudHMiLCAiYnVpbGQvdml0ZS9wbHVnaW4vc3ZnLnRzIiwgImJ1aWxkL3ZpdGUvcGx1Z2luL2NvbXByZXNzLnRzIiwgImJ1aWxkL3ZpdGUvcGx1Z2luL21vY2sudHMiLCAiYnVpbGQvdml0ZS9wbHVnaW4vcHdhLnRzIiwgImJ1aWxkL3ZpdGUvcGx1Z2luL3Zpc3VhbGl6ZXIudHMiLCAiYnVpbGQvdml0ZS9wbHVnaW4vaW1hZ2VtaW4udHMiLCAiYnVpbGQvdml0ZS9wbHVnaW4vaTE4bi50cyIsICJidWlsZC92aXRlL3BsdWdpbi9lbGVtZW50LnRzIiwgImJ1aWxkL3ZpdGUvcGx1Z2luL2J1aWxkT3V0ZUluZm8udHMiLCAiYnVpbGQvdml0ZS9yZXNvbHZlLnRzIiwgImJ1aWxkL3ZpdGUvYnVpbGQudHMiLCAiYnVpbGQvdml0ZS9lc2J1aWxkLnRzIiwgImJ1aWxkL3ZpdGUvc2VydmVyLnRzIiwgImJ1aWxkL3ZpdGUvb3B0aW1pemVEZXBzLnRzIiwgImJ1aWxkL3ZpdGUvY3NzLnRzIiwgImJ1aWxkL3ZpdGUvdml0ZVRlc3RDb25maWcudHMiLCAidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxEZXNrdG9wXFxcXHZzY29kZVdvcmtzcGFjZVxcXFx0YXVyaV9kZW1vXFxcXHRhdXJpX2FwcFxcXFx0YXVyaURSVFxcXFxidWlsZFxcXFx2aXRlXFxcXHBsdWdpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcRGVza3RvcFxcXFx2c2NvZGVXb3Jrc3BhY2VcXFxcdGF1cmlfZGVtb1xcXFx0YXVyaV9hcHBcXFxcdGF1cmlEUlRcXFxcYnVpbGRcXFxcdml0ZVxcXFxwbHVnaW5cXFxcaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L0Rlc2t0b3AvdnNjb2RlV29ya3NwYWNlL3RhdXJpX2RlbW8vdGF1cmlfYXBwL3RhdXJpRFJUL2J1aWxkL3ZpdGUvcGx1Z2luL2luZGV4LnRzXCI7aW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xuXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnO1xuXG4vLyBpbXBvcnQgVnVlTWFjcm9zIGZyb20gJ3VucGx1Z2luLXZ1ZS1tYWNyb3Mvdml0ZSc7XG5cbmltcG9ydCB0eXBlIHsgQ29uZmlnRW52LCBQbHVnaW5PcHRpb24gfSBmcm9tICd2aXRlJztcblxuLy8gXHU2OEMwXHU2N0U1XHU2M0QyXHU0RUY2XHU3MkI2XHU2MDAxXG5pbXBvcnQgSW5zcGVjdCBmcm9tICd2aXRlLXBsdWdpbi1pbnNwZWN0Jztcbi8vIFx1NjMwOVx1OTcwMFx1NTJBMFx1OEY3RFx1NjgzN1x1NUYwRlx1OTE0RFx1N0Y2RVxuaW1wb3J0IHsgY29uZmlnU3R5bGVQbHVnaW4gfSBmcm9tICcuL3N0eWxlJztcbi8vIHN2Z1x1OTE0RFx1N0Y2RVxuaW1wb3J0IHsgY29uZmlnU3ZnUGx1Z2luIH0gZnJvbSAnLi9zdmcnO1xuLy8gXHU1MzhCXHU3RjI5XG5pbXBvcnQgeyBjb25maWdDb21wcmVzc1BsdWdpbiB9IGZyb20gJy4vY29tcHJlc3MnO1xuLy8gbW9ja1xuaW1wb3J0IHsgY29uZmlnTW9ja1BsdWdpbiB9IGZyb20gJy4vbW9jayc7XG4vLyBwd2RcbmltcG9ydCB7IGNvbmZpZ1B3YVBsdWdpbiB9IGZyb20gJy4vcHdhJztcbi8vIFx1NjAyN1x1ODBGRFx1NTIwNlx1Njc5MFx1NURFNVx1NTE3N1xuaW1wb3J0IHsgY29uZmlnVmlzdWFsaXplclBsdWdpbiB9IGZyb20gJy4vdmlzdWFsaXplcic7XG4vLyBcdTU2RkVcdTcyNDdcdTUzOEJcdTdGMjlcbmltcG9ydCB7IGNvbmZpZ0ltYWdlbWluUGx1Z2luIH0gZnJvbSAnLi9pbWFnZW1pbic7XG4vLyB2dWUtaTE4blxuaW1wb3J0IHsgY29uZmlnVnVlSTE4blBsdWdpbiB9IGZyb20gJy4vaTE4bic7XG4vLyBlbGVtZW50XG5pbXBvcnQgeyBjb25maWdBdXRvRWxlbWVudFN0eWxlUGx1Z2luIH0gZnJvbSAnLi9lbGVtZW50JztcblxuLy8gXHU4MUVBXHU1QjlBXHU0RTQ5XHU2M0QyXHU0RUY2IFx1OTVFRVx1NTAxOVx1OEJFRFx1RkYwQ1x1NjI1M1x1NTMwNVx1NjhDMFx1NkQ0Qlx1NzUyOFx1NjVGNlx1MzAwMVx1NTkyN1x1NUMwRlxuaW1wb3J0IHZpdGVCdWlsZE91dGVJbmZvIGZyb20gJy4vYnVpbGRPdXRlSW5mbyc7XG5cbi8vIGVzbGludFxuLy8gaW1wb3J0IHsgY29uZmlnRXNMaW50ZXJQbHVnaW4gfSBmcm9tICcuL2VzbGludGVyJ1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVml0ZVBsdWdpbnMoX2lzQnVpbGQgPSBmYWxzZSwgX2NvbmZpZ0VudjogQ29uZmlnRW52KSB7XG4gIGNvbnN0IHZpdGVQbHVnaW5zOiBQbHVnaW5PcHRpb25bXSA9IFtcbiAgICAvLyB2dWUoe1xuICAgIC8vICAgcmVhY3Rpdml0eVRyYW5zZm9ybTogdHJ1ZSxcbiAgICAvLyB9KSxcbiAgXTtcblxuICB2aXRlUGx1Z2lucy5wdXNoKFxuICAgIHZ1ZSgpLFxuICAgIHZ1ZUpzeCgpLCAvLyBcdTU5ODJcdTY3OUNcdTk3MDBcdTg5ODFcbiAgKTtcblxuICB2aXRlUGx1Z2lucy5wdXNoKGNvbmZpZ1N0eWxlUGx1Z2luKCkpO1xuXG4gIHZpdGVQbHVnaW5zLnB1c2goY29uZmlnU3ZnUGx1Z2luKCkpO1xuXG4gIHZpdGVQbHVnaW5zLnB1c2goY29uZmlnQ29tcHJlc3NQbHVnaW4oJ2d6aXAnLCB0cnVlKSk7XG5cbiAgdml0ZVBsdWdpbnMucHVzaChjb25maWdNb2NrUGx1Z2luKCkpO1xuXG4gIHZpdGVQbHVnaW5zLnB1c2goY29uZmlnUHdhUGx1Z2luKCkpO1xuXG4gIHZpdGVQbHVnaW5zLnB1c2goY29uZmlnVmlzdWFsaXplclBsdWdpbigpKTtcblxuICB2aXRlUGx1Z2lucy5wdXNoKGNvbmZpZ0ltYWdlbWluUGx1Z2luKCkpO1xuXG4gIHZpdGVQbHVnaW5zLnB1c2godml0ZUJ1aWxkT3V0ZUluZm8oKSk7XG5cbiAgdml0ZVBsdWdpbnMucHVzaChjb25maWdWdWVJMThuUGx1Z2luKCkpO1xuXG4gIHZpdGVQbHVnaW5zLnB1c2goSW5zcGVjdCgpKTtcblxuICB2aXRlUGx1Z2lucy5wdXNoKGNvbmZpZ0F1dG9FbGVtZW50U3R5bGVQbHVnaW4oKSk7XG5cbiAgLy8gXHU0RjdGXHU3NTI4XHU2QjY0XHU2M0QyXHU0RUY2XHU0RjFBXHU1QkZDXHU4MUY0dml0ZVx1NTQyRlx1NTJBOFx1NTNEOFx1NjE2MiAxMDBtc1x1NURFNlx1NTNGM1xuICAvLyB2aXRlUGx1Z2lucy5wdXNoKGNvbmZpZ0VzTGludGVyUGx1Z2luKGNvbmZpZ0VudikpXG5cbiAgcmV0dXJuIHZpdGVQbHVnaW5zO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxEZXNrdG9wXFxcXHZzY29kZVdvcmtzcGFjZVxcXFx0YXVyaV9kZW1vXFxcXHRhdXJpX2FwcFxcXFx0YXVyaURSVFxcXFxidWlsZFxcXFx2aXRlXFxcXHBsdWdpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcRGVza3RvcFxcXFx2c2NvZGVXb3Jrc3BhY2VcXFxcdGF1cmlfZGVtb1xcXFx0YXVyaV9hcHBcXFxcdGF1cmlEUlRcXFxcYnVpbGRcXFxcdml0ZVxcXFxwbHVnaW5cXFxcc3R5bGUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L0Rlc2t0b3AvdnNjb2RlV29ya3NwYWNlL3RhdXJpX2RlbW8vdGF1cmlfYXBwL3RhdXJpRFJUL2J1aWxkL3ZpdGUvcGx1Z2luL3N0eWxlLnRzXCI7LyoqXG4gKiBcdTUyQThcdTYwMDFcdTVGMTVcdTUxNjVcdTdFQzRcdTRFRjZcdTVFOTNcdTY4MzdcdTVGMEZcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9hbm5jd2Ivdml0ZS1wbHVnaW4tc3R5bGUtaW1wb3J0L2Jsb2IvbWFpbi9SRUFETUUuemhfQ04ubWRcbiAqL1xuLy8gaW1wb3J0IHN0eWxlSW1wb3J0IGZyb20gJ3ZpdGUtcGx1Z2luLXN0eWxlLWltcG9ydCc7XG5pbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJ3ZpdGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29uZmlnU3R5bGVQbHVnaW4oKTogUGx1Z2luIHwgUGx1Z2luW10ge1xuICAvLyBjb25zdCBvcHRpb25zID0ge1xuICAvLyAgIC8vIGxpYnM6IFtcbiAgLy8gICAvLyAgIHtcbiAgLy8gICAvLyAgICAgbGlicmFyeU5hbWU6ICdlbGVtZW50LXBsdXMnLFxuICAvLyAgIC8vICAgICBlc01vZHVsZTogdHJ1ZSxcbiAgLy8gICAvLyAgICAgZW5zdXJlU3R5bGVGaWxlOiB0cnVlLFxuICAvLyAgIC8vICAgICByZXNvbHZlU3R5bGU6IChuYW1lOiBhbnkpID0+IHtcbiAgLy8gICAvLyAgICAgICBuYW1lID0gbmFtZS5zbGljZSgzKTtcbiAgLy8gICAvLyAgICAgICAvLyBcdTRGN0ZcdTc1MjhlbGVtZW50IHNjc3NcdTY4MzdcdTVGMEZcbiAgLy8gICAvLyAgICAgICByZXR1cm4gYGVsZW1lbnQtcGx1cy9wYWNrYWdlcy90aGVtZS1jaGFsay9zcmMvJHtuYW1lfS5zY3NzYDtcbiAgLy8gICAvLyAgICAgICAvLyBcdTRGN0ZcdTc1MjhlbGVtZW50IGNzc1x1NjgzN1x1NUYwRlxuICAvLyAgIC8vICAgICAgIC8vIHJldHVybiBgZWxlbWVudC1wbHVzL2xpYi90aGVtZS1jaGFsay8ke25hbWV9LmNzc2A7XG4gIC8vICAgLy8gICAgIH0sXG4gIC8vICAgLy8gICAgIC8vIHJlc29sdmVDb21wb25lbnQ6IChuYW1lOiBhbnkpID0+IHtcbiAgLy8gICAvLyAgICAgLy8gXHRjb25zb2xlLmxvZyhuYW1lKVxuICAvLyAgIC8vICAgICAvLyBcdHJldHVybiBgZWxlbWVudC1wbHVzL2xpYi8ke25hbWV9YFxuICAvLyAgIC8vICAgICAvLyB9LFxuICAvLyAgIC8vICAgfSxcbiAgLy8gICAvLyBdLFxuICAvLyB9O1xuICAvLyBjb25zdCBwbHVnaW46IFBsdWdpbltdID0gW3N0eWxlSW1wb3J0KG9wdGlvbnMpXTtcbiAgY29uc3QgcGx1Z2luOiBQbHVnaW5bXSA9IFtdO1xuICByZXR1cm4gcGx1Z2luO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxEZXNrdG9wXFxcXHZzY29kZVdvcmtzcGFjZVxcXFx0YXVyaV9kZW1vXFxcXHRhdXJpX2FwcFxcXFx0YXVyaURSVFxcXFxidWlsZFxcXFx2aXRlXFxcXHBsdWdpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcRGVza3RvcFxcXFx2c2NvZGVXb3Jrc3BhY2VcXFxcdGF1cmlfZGVtb1xcXFx0YXVyaV9hcHBcXFxcdGF1cmlEUlRcXFxcYnVpbGRcXFxcdml0ZVxcXFxwbHVnaW5cXFxcc3ZnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9EZXNrdG9wL3ZzY29kZVdvcmtzcGFjZS90YXVyaV9kZW1vL3RhdXJpX2FwcC90YXVyaURSVC9idWlsZC92aXRlL3BsdWdpbi9zdmcudHNcIjsvKipcbiAqIHN2Z1xuICogaHR0cHM6Ly9naXRodWIuY29tL2FubmN3Yi92aXRlLXBsdWdpbi1zdmctaWNvbnMvYmxvYi9tYWluL1JFQURNRS56aF9DTi5tZFxuICovXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4tc3ZnLWljb25zJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbmZpZ1N2Z1BsdWdpbigpIHtcbiAgY29uc3Qgc3ZnUGx1Z2luID0gY3JlYXRlU3ZnSWNvbnNQbHVnaW4oe1xuICAgIC8vIFx1NjMwN1x1NUI5QVx1OTcwMFx1ODk4MVx1N0YxM1x1NUI1OFx1NzY4NFx1NTZGRVx1NjgwN1x1NjU4N1x1NEVGNlx1NTkzOVxuICAgIGljb25EaXJzOiBbcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdzcmMvYXNzZXRzL2ljb25zJyldLFxuICAgIC8vIFx1NTM4Qlx1N0YyOVx1OTE0RFx1N0Y2RVxuICAgIC8vIHN2Z29PcHRpb25zOiBmYWxzZSxcbiAgICAvLyBcdTYzMDdcdTVCOUFzeW1ib2xJZFx1NjgzQ1x1NUYwRlxuICAgIHN5bWJvbElkOiAnaWNvbi1bZGlyXS1bbmFtZV0nLFxuICB9KTtcbiAgcmV0dXJuIHN2Z1BsdWdpbjtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcRGVza3RvcFxcXFx2c2NvZGVXb3Jrc3BhY2VcXFxcdGF1cmlfZGVtb1xcXFx0YXVyaV9hcHBcXFxcdGF1cmlEUlRcXFxcYnVpbGRcXFxcdml0ZVxcXFxwbHVnaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXERlc2t0b3BcXFxcdnNjb2RlV29ya3NwYWNlXFxcXHRhdXJpX2RlbW9cXFxcdGF1cmlfYXBwXFxcXHRhdXJpRFJUXFxcXGJ1aWxkXFxcXHZpdGVcXFxccGx1Z2luXFxcXGNvbXByZXNzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9EZXNrdG9wL3ZzY29kZVdvcmtzcGFjZS90YXVyaV9kZW1vL3RhdXJpX2FwcC90YXVyaURSVC9idWlsZC92aXRlL3BsdWdpbi9jb21wcmVzcy50c1wiOy8qKlxuICogXHU3NTI4XHU0RThFXHU2MjUzXHU1MzA1XHU1NDhDXHU4RjkzXHU1MUZBZ3ppcFxuICogaHR0cHM6Ly9naXRodWIuY29tL2FubmN3Yi92aXRlLXBsdWdpbi1jb21wcmVzc2lvbi9ibG9iL21haW4vUkVBRE1FLnpoX0NOLm1kXG4gKi9cbmltcG9ydCB2aXRlQ29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nO1xuXG5pbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJ3ZpdGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29uZmlnQ29tcHJlc3NQbHVnaW4oXG4gIGNvbXByZXNzOiAnZ3ppcCcgfCAnYnJvdGxpJyB8ICdub25lJyxcbiAgZGlzYWJsZSA9IGZhbHNlLFxuKTogUGx1Z2luIHwgUGx1Z2luW10ge1xuICBsZXQgb3B0aW9ucyA9IHt9O1xuICBpZiAoY29tcHJlc3MgPT09ICdnemlwJykge1xuICAgIG9wdGlvbnMgPSB7XG4gICAgICBleHQ6ICcuZ3onLFxuICAgICAgYWxnb3JpdGhtOiAnZ3ppcCcsXG4gICAgfTtcbiAgfVxuICBpZiAoY29tcHJlc3MgPT09ICdicm90bGknKSB7XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIGV4dDogJy5icicsXG4gICAgICBhbGdvcml0aG06ICdicm90bGlDb21wcmVzcycsXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IHBsdWdpbjogUGx1Z2luW10gPSBbXG4gICAgdml0ZUNvbXByZXNzaW9uKHtcbiAgICAgIHZlcmJvc2U6IHRydWUsXG4gICAgICBkaXNhYmxlLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9KSxcbiAgXTtcblxuICByZXR1cm4gcGx1Z2luO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxEZXNrdG9wXFxcXHZzY29kZVdvcmtzcGFjZVxcXFx0YXVyaV9kZW1vXFxcXHRhdXJpX2FwcFxcXFx0YXVyaURSVFxcXFxidWlsZFxcXFx2aXRlXFxcXHBsdWdpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcRGVza3RvcFxcXFx2c2NvZGVXb3Jrc3BhY2VcXFxcdGF1cmlfZGVtb1xcXFx0YXVyaV9hcHBcXFxcdGF1cmlEUlRcXFxcYnVpbGRcXFxcdml0ZVxcXFxwbHVnaW5cXFxcbW9jay50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovRGVza3RvcC92c2NvZGVXb3Jrc3BhY2UvdGF1cmlfZGVtby90YXVyaV9hcHAvdGF1cmlEUlQvYnVpbGQvdml0ZS9wbHVnaW4vbW9jay50c1wiOy8qKlxuICogTW9jayBwbHVnaW4gZm9yIGRldmVsb3BtZW50IGFuZCBwcm9kdWN0aW9uLlxuICogaHR0cHM6Ly9naXRodWIuY29tL2FubmN3Yi92aXRlLXBsdWdpbi1tb2NrXG4gKi9cbmltcG9ydCB7IHZpdGVQbHVnaW5GYWtlU2VydmVyIH0gZnJvbSAndml0ZS1wbHVnaW4tZmFrZS1zZXJ2ZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gY29uZmlnTW9ja1BsdWdpbigpIHtcbiAgcmV0dXJuIHZpdGVQbHVnaW5GYWtlU2VydmVyKHtcbiAgICBsb2dnZXI6IGZhbHNlLFxuICAgIGluY2x1ZGU6ICdtb2NrJyxcbiAgICBpbmZpeE5hbWU6IGZhbHNlLFxuICAgIGVuYWJsZVByb2Q6IHRydWUsXG4gIH0pO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxEZXNrdG9wXFxcXHZzY29kZVdvcmtzcGFjZVxcXFx0YXVyaV9kZW1vXFxcXHRhdXJpX2FwcFxcXFx0YXVyaURSVFxcXFxidWlsZFxcXFx2aXRlXFxcXHBsdWdpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcRGVza3RvcFxcXFx2c2NvZGVXb3Jrc3BhY2VcXFxcdGF1cmlfZGVtb1xcXFx0YXVyaV9hcHBcXFxcdGF1cmlEUlRcXFxcYnVpbGRcXFxcdml0ZVxcXFxwbHVnaW5cXFxccHdhLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9EZXNrdG9wL3ZzY29kZVdvcmtzcGFjZS90YXVyaV9kZW1vL3RhdXJpX2FwcC90YXVyaURSVC9idWlsZC92aXRlL3BsdWdpbi9wd2EudHNcIjsvKipcbiAqIHB3YVxuICogaHR0cHM6Ly92aXRlLXBsdWdpbi1wd2EubmV0bGlmeS5hcHBcbiAqL1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25maWdQd2FQbHVnaW4oKSB7XG4gIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgaW5jbHVkZUFzc2V0czogWydmYXZpY29uLnN2ZycsICdmYXZpY29uLmljbycsICdyb2JvdHMudHh0JywgJ2FwcGxlLXRvdWNoLWljb24ucG5nJ10sXG4gICAgbG9nTGV2ZWw6ICdzaWxlbnQnLFxuICAgIG1hbmlmZXN0OiB7XG4gICAgICBuYW1lOiAndGF1cmktdG9vbGtpdCcsXG4gICAgICBzaG9ydF9uYW1lOiAndGF1cmktdG9vbGtpdCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1NTdGQVx1NEU4RSB2dWUzK3ZpdGUrZWxlbWVudC1wbHVzIFx1NjQyRFx1NUVGQVx1NzY4NFx1NTQwRVx1NTNGMFx1NkEyMVx1Njc3RicsXG4gICAgICB0aGVtZV9jb2xvcjogJyNmZmZmZmYnLFxuICAgICAgaWNvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHNyYzogJy9wd2EvYW5kcm9pZC1jaHJvbWUtMTkyeDE5Mi5wbmcnLFxuICAgICAgICAgIHNpemVzOiAnMTkyeDE5MicsXG4gICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzcmM6ICcvcHdhL2FuZHJvaWQtY2hyb21lLTUxMng1MTIucG5nJyxcbiAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgc3JjOiAnL3B3YS9hbmRyb2lkLWNocm9tZS01MTJ4NTEyLnBuZycsXG4gICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcbiAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICBwdXJwb3NlOiAnYW55IG1hc2thYmxlJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4gVml0ZVBXQShvcHRpb25zKTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcRGVza3RvcFxcXFx2c2NvZGVXb3Jrc3BhY2VcXFxcdGF1cmlfZGVtb1xcXFx0YXVyaV9hcHBcXFxcdGF1cmlEUlRcXFxcYnVpbGRcXFxcdml0ZVxcXFxwbHVnaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXERlc2t0b3BcXFxcdnNjb2RlV29ya3NwYWNlXFxcXHRhdXJpX2RlbW9cXFxcdGF1cmlfYXBwXFxcXHRhdXJpRFJUXFxcXGJ1aWxkXFxcXHZpdGVcXFxccGx1Z2luXFxcXHZpc3VhbGl6ZXIudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L0Rlc2t0b3AvdnNjb2RlV29ya3NwYWNlL3RhdXJpX2RlbW8vdGF1cmlfYXBwL3RhdXJpRFJUL2J1aWxkL3ZpdGUvcGx1Z2luL3Zpc3VhbGl6ZXIudHNcIjsvLyBodHRwczovL2dpdGh1Yi5jb20vYnRkL3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplclxuaW1wb3J0IHZpc3VhbGl6ZXIgZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJztcblxuaW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tICd2aXRlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbmZpZ1Zpc3VhbGl6ZXJQbHVnaW4oKTogUGx1Z2luIHwgUGx1Z2luW10ge1xuICBpZiAocHJvY2Vzcy5lbnYuUkVQT1JUID09PSAndHJ1ZScpIHtcbiAgICByZXR1cm4gW1xuICAgICAgdmlzdWFsaXplcih7XG4gICAgICAgIGZpbGVuYW1lOiAnLi9ub2RlX21vZHVsZXMvLmNhY2hlL3Zpc3VhbGl6ZXIvc3RhdHMuaHRtbCcsXG4gICAgICAgIG9wZW46IHRydWUsXG4gICAgICAgIGd6aXBTaXplOiB0cnVlLFxuICAgICAgICBicm90bGlTaXplOiB0cnVlLFxuICAgICAgfSkgYXMgUGx1Z2luLFxuICAgIF07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXERlc2t0b3BcXFxcdnNjb2RlV29ya3NwYWNlXFxcXHRhdXJpX2RlbW9cXFxcdGF1cmlfYXBwXFxcXHRhdXJpRFJUXFxcXGJ1aWxkXFxcXHZpdGVcXFxccGx1Z2luXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxEZXNrdG9wXFxcXHZzY29kZVdvcmtzcGFjZVxcXFx0YXVyaV9kZW1vXFxcXHRhdXJpX2FwcFxcXFx0YXVyaURSVFxcXFxidWlsZFxcXFx2aXRlXFxcXHBsdWdpblxcXFxpbWFnZW1pbi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovRGVza3RvcC92c2NvZGVXb3Jrc3BhY2UvdGF1cmlfZGVtby90YXVyaV9hcHAvdGF1cmlEUlQvYnVpbGQvdml0ZS9wbHVnaW4vaW1hZ2VtaW4udHNcIjsvLyBcdTU2RkVcdTcyNDdcdTUzOEJcdTdGMjlcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbm5jd2Ivdml0ZS1wbHVnaW4taW1hZ2VtaW5cbmltcG9ydCB2aXRlSW1hZ2VtaW4gZnJvbSAndml0ZS1wbHVnaW4taW1hZ2VtaW4nO1xuXG5leHBvcnQgZnVuY3Rpb24gY29uZmlnSW1hZ2VtaW5QbHVnaW4oKSB7XG4gIHJldHVybiB2aXRlSW1hZ2VtaW4oe1xuICAgIHZlcmJvc2U6IGZhbHNlLFxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9pbWFnZW1pbi9pbWFnZW1pbi1naWZzaWNsZVxuICAgIGdpZnNpY2xlOiB7XG4gICAgICBvcHRpbWl6YXRpb25MZXZlbDogMyxcbiAgICB9LFxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9pbWFnZW1pbi9pbWFnZW1pbi1vcHRpcG5nXG4gICAgb3B0aXBuZzoge1xuICAgICAgb3B0aW1pemF0aW9uTGV2ZWw6IDcsXG4gICAgfSxcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vaW1hZ2VtaW4vaW1hZ2VtaW4tbW96anBlZ1xuICAgIG1vempwZWc6IHtcbiAgICAgIHF1YWxpdHk6IDMwLFxuICAgIH0sXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ltYWdlbWluL2ltYWdlbWluLXBuZ3F1YW50XG4gICAgcG5ncXVhbnQ6IHtcbiAgICAgIHF1YWxpdHk6IFswLjgsIDAuOV0sXG4gICAgfSxcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vc3ZnL3N2Z28vI3doYXQtaXQtY2FuLWRvXG4gICAgc3Znbzoge1xuICAgICAgcGx1Z2luczogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ3JlbW92ZVZpZXdCb3gnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ3JlbW92ZUVtcHR5QXR0cnMnLFxuICAgICAgICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxEZXNrdG9wXFxcXHZzY29kZVdvcmtzcGFjZVxcXFx0YXVyaV9kZW1vXFxcXHRhdXJpX2FwcFxcXFx0YXVyaURSVFxcXFxidWlsZFxcXFx2aXRlXFxcXHBsdWdpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcRGVza3RvcFxcXFx2c2NvZGVXb3Jrc3BhY2VcXFxcdGF1cmlfZGVtb1xcXFx0YXVyaV9hcHBcXFxcdGF1cmlEUlRcXFxcYnVpbGRcXFxcdml0ZVxcXFxwbHVnaW5cXFxcaTE4bi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovRGVza3RvcC92c2NvZGVXb3Jrc3BhY2UvdGF1cmlfZGVtby90YXVyaV9hcHAvdGF1cmlEUlQvYnVpbGQvdml0ZS9wbHVnaW4vaTE4bi50c1wiO2ltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFZ1ZUkxOG5QbHVnaW4gZnJvbSAnQGludGxpZnkvdW5wbHVnaW4tdnVlLWkxOG4vdml0ZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25maWdWdWVJMThuUGx1Z2luKCkge1xuICByZXR1cm4gVnVlSTE4blBsdWdpbih7XG4gICAgaW5jbHVkZTogW3BhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLi8uLi8nLCAnLi9zcmMvbG9jYWxlcy9tb2R1bGVzLyoqJyldLFxuICB9KTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcRGVza3RvcFxcXFx2c2NvZGVXb3Jrc3BhY2VcXFxcdGF1cmlfZGVtb1xcXFx0YXVyaV9hcHBcXFxcdGF1cmlEUlRcXFxcYnVpbGRcXFxcdml0ZVxcXFxwbHVnaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXERlc2t0b3BcXFxcdnNjb2RlV29ya3NwYWNlXFxcXHRhdXJpX2RlbW9cXFxcdGF1cmlfYXBwXFxcXHRhdXJpRFJUXFxcXGJ1aWxkXFxcXHZpdGVcXFxccGx1Z2luXFxcXGVsZW1lbnQudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L0Rlc2t0b3AvdnNjb2RlV29ya3NwYWNlL3RhdXJpX2RlbW8vdGF1cmlfYXBwL3RhdXJpRFJUL2J1aWxkL3ZpdGUvcGx1Z2luL2VsZW1lbnQudHNcIjsvLyBcdTYzMDlcdTk3MDBlbGVtZW50XHU2ODM3XHU1RjBGXG5pbXBvcnQgRWxlbWVudFBsdXMgZnJvbSAndW5wbHVnaW4tZWxlbWVudC1wbHVzL3ZpdGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29uZmlnQXV0b0VsZW1lbnRTdHlsZVBsdWdpbigpIHtcbiAgcmV0dXJuIEVsZW1lbnRQbHVzKHtcbiAgICB1c2VTb3VyY2U6IHRydWUsXG4gIH0pO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxEZXNrdG9wXFxcXHZzY29kZVdvcmtzcGFjZVxcXFx0YXVyaV9kZW1vXFxcXHRhdXJpX2FwcFxcXFx0YXVyaURSVFxcXFxidWlsZFxcXFx2aXRlXFxcXHBsdWdpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcRGVza3RvcFxcXFx2c2NvZGVXb3Jrc3BhY2VcXFxcdGF1cmlfZGVtb1xcXFx0YXVyaV9hcHBcXFxcdGF1cmlEUlRcXFxcYnVpbGRcXFxcdml0ZVxcXFxwbHVnaW5cXFxcYnVpbGRPdXRlSW5mby50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovRGVza3RvcC92c2NvZGVXb3Jrc3BhY2UvdGF1cmlfZGVtby90YXVyaV9hcHAvdGF1cmlEUlQvYnVpbGQvdml0ZS9wbHVnaW4vYnVpbGRPdXRlSW5mby50c1wiO2ltcG9ydCB7IHJlYWRkaXIsIHN0YXQgfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgdHlwZSB7IFBsdWdpbiwgUmVzb2x2ZWRDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IGdyZWVuIH0gZnJvbSAna29sb3Jpc3QnO1xuaW1wb3J0IHR5cGUgeyBEYXlqcyB9IGZyb20gJ2RheWpzJztcbmltcG9ydCBkYXlqcyBmcm9tICdkYXlqcyc7XG5pbXBvcnQgZHVyYXRpb24gZnJvbSAnZGF5anMvcGx1Z2luL2R1cmF0aW9uJztcbmRheWpzLmV4dGVuZChkdXJhdGlvbik7XG5cbmNvbnN0IHRvc3QgPSBgXHVEODNFXHVERDI5XHU0RjYwXHU1OTdEIVx1NTk4Mlx1Njc5Q1x1NjBBOFx1NjExRlx1ODlDOVx1NTE4NVx1NUJCOVx1OEZEOFx1NEUwRFx1OTUxOSxcdTU3MjhcdTUzRjNcdThGQjlcdTk0RkVcdTYzQTVcdTdFRDlcdTRFMkFzdGFyXHU1NEU2XHVEODNEXHVERTE4ISBodHRwczovL2dpdGh1Yi5jb20vdGFuc2VuODdgO1xuXG5mdW5jdGlvbiBnZXRkaXJzaXplKGRpcjogc3RyaW5nLCBjYWxsYmFjazogKGZpbGVOdW1iZXI6IG51bWJlciwgc2l6ZTogbnVtYmVyKSA9PiB2b2lkKSB7XG4gIGxldCBzaXplID0gMDtcbiAgbGV0IGZpbGVOdW1iZXIgPSAwO1xuICBzdGF0KGRpciwgZnVuY3Rpb24gKGVyciwgc3RhdHMpIHtcbiAgICBpZiAoZXJyKSB0aHJvdyBlcnI7IC8vXHU1OTgyXHU2NzlDXHU1MUZBXHU5NTE5XG4gICAgaWYgKHN0YXRzLmlzRmlsZSgpKSByZXR1cm4gY2FsbGJhY2soMSwgc3RhdHMuc2l6ZSk7IC8vXHU1OTgyXHU2NzlDXHU2NjJGXHU2NTg3XHU0RUY2XG5cbiAgICByZWFkZGlyKGRpciwgZnVuY3Rpb24gKGVyciwgZmlsZXMpIHtcbiAgICAgIC8vXHU1OTgyXHU2NzlDXHU2NjJGXHU3NkVFXHU1RjU1XG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7IC8vXHU1OTgyXHU2NzlDXHU5MDREXHU1Mzg2XHU3NkVFXHU1RjU1XHU1MUZBXHU5NTE5XG4gICAgICBpZiAoZmlsZXMubGVuZ3RoID09IDApIHJldHVybiBjYWxsYmFjaygwLCAwKTsgLy9cdTU5ODJcdTY3OUNcdTc2RUVcdTVGNTVcdTY2MkZcdTdBN0FcdTc2ODRcblxuICAgICAgbGV0IGNvdW50ID0gZmlsZXMubGVuZ3RoOyAvL1x1NjU4N1x1NEVGNlx1NjU3MFx1OTFDRlxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBnZXRkaXJzaXplKGpvaW4oZGlyLCBmaWxlc1tpXSksIGZ1bmN0aW9uIChfZmlsZU51bWJlcjogbnVtYmVyLCBfc2l6ZTogbnVtYmVyKSB7XG4gICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgIHNpemUgKz0gX3NpemU7XG4gICAgICAgICAgZmlsZU51bWJlciArPSBfZmlsZU51bWJlcjtcbiAgICAgICAgICBpZiAoLS1jb3VudCA8PSAwKSB7XG4gICAgICAgICAgICAvL1x1NTk4Mlx1Njc5Q1x1NzZFRVx1NUY1NVx1NEUyRFx1NjI0MFx1NjcwOVx1NjU4N1x1NEVGNihcdTYyMTZcdTc2RUVcdTVGNTUpXHU5MEZEXHU5MDREXHU1Mzg2XHU1QjhDXHU2MjEwXG4gICAgICAgICAgICBjYWxsYmFjayhmaWxlTnVtYmVyLCBzaXplKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYnl0ZXNUb1NpemUoYnl0ZXM6IG51bWJlciwgZml4ZWQgPSAyKSB7XG4gIGlmIChieXRlcyA9PT0gMCkgcmV0dXJuICcwIEJ5dGVzJztcbiAgY29uc3QgayA9IDEwMjQ7XG4gIGNvbnN0IHNpemVzID0gWydCeXRlcycsICdLQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQicsICdaQicsICdZQiddO1xuICBjb25zdCBpID0gTWF0aC5mbG9vcihNYXRoLmxvZyhieXRlcykgLyBNYXRoLmxvZyhrKSk7XG4gIHJldHVybiBgJHtwYXJzZUZsb2F0KChieXRlcyAvIE1hdGgucG93KGssIGkpKS50b0ZpeGVkKGZpeGVkKSl9ICR7c2l6ZXNbaV19YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZpdGVCdWlsZE91dGVJbmZvKCk6IFBsdWdpbiB7XG4gIGxldCBjb25maWc6IFJlc29sdmVkQ29uZmlnO1xuICBsZXQgc3RhcnRUaW1lOiBEYXlqcywgZW5kVGltZTogRGF5anM7XG5cbiAgcmV0dXJuIHtcbiAgICAvLyBcdTYzRDJcdTRFRjZcdTU0MERcdTc5RjBcbiAgICBuYW1lOiAndml0ZS1idWlsZC1vdXRlLWluZm8nLFxuXG4gICAgLy8gXHU4QkU1XHU2M0QyXHU0RUY2XHU1NzI4IHBsdWdpbi12dWUgXHU2M0QyXHU0RUY2XHU0RTRCXHU1MjREXHU2MjY3XHU4ODRDXHVGRjBDXHU4RkQ5XHU2ODM3XHU1QzMxXHU1M0VGXHU0RUU1XHU3NkY0XHU2M0E1XHU4OUUzXHU2NzkwXHU1MjMwXHU1MzlGXHU2QTIxXHU2NzdGXHU2NTg3XHU0RUY2XG4gICAgZW5mb3JjZTogJ3Bvc3QnLFxuICAgIHRyYW5zZm9ybUluZGV4SHRtbDoge1xuICAgICAgb3JkZXI6ICdwb3N0JyxcbiAgICAgIGhhbmRsZXI6ICgpID0+IHt9LFxuICAgIH0sXG5cbiAgICBjb25maWdSZXNvbHZlZChyZXNvbHZlZENvbmZpZykge1xuICAgICAgLy8gXHU1QjU4XHU1MEE4XHU2NzAwXHU3RUM4XHU4OUUzXHU2NzkwXHU3Njg0XHU5MTREXHU3RjZFXG4gICAgICBjb25maWcgPSByZXNvbHZlZENvbmZpZztcbiAgICB9LFxuXG4gICAgLy8gcm9sbHVwLnJvbGx1cFx1NTcyOFx1NkJDRlx1NkIyMVx1NUYwMFx1NTlDQlx1Njc4NFx1NUVGQVx1NjVGNlx1OEMwM1x1NzUyOFxuICAgIGJ1aWxkU3RhcnQoKSB7XG4gICAgICBjb25zb2xlLmluZm8oWycnLCBncmVlbih0b3N0KSwgJyddLmpvaW4oJ1xcbicpKTtcbiAgICAgIGlmIChjb25maWcuY29tbWFuZCA9PT0gJ2J1aWxkJykge1xuICAgICAgICBzdGFydFRpbWUgPSBkYXlqcyhuZXcgRGF0ZSgpKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xvc2VCdW5kbGUoKSB7XG4gICAgICBpZiAoY29uZmlnLmNvbW1hbmQgPT09ICdidWlsZCcpIHtcbiAgICAgICAgZW5kVGltZSA9IGRheWpzKG5ldyBEYXRlKCkpO1xuICAgICAgICBnZXRkaXJzaXplKGNvbmZpZy5idWlsZC5vdXREaXIsIChmLCBzKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBgXFxuJHtncmVlbihcbiAgICAgICAgICAgICAgYFx1NjI1M1x1NTMwNVx1NUI4Q1x1NjIxMFx1RDgzQ1x1REY4OVx1RkYwOFx1NjI1M1x1NTMwNVx1NjU4N1x1NEVGNlx1NjU3MFx1OTFDRlx1RkYxQSR7Zn1cdUZGMENcdTc1MjhcdTY1RjZcdUZGMUEke2RheWpzXG4gICAgICAgICAgICAgICAgLmR1cmF0aW9uKGVuZFRpbWUuZGlmZihzdGFydFRpbWUpKVxuICAgICAgICAgICAgICAgIC5mb3JtYXQoJ21tXHU1MjA2c3NcdTc5RDInKX1cdUZGMENcdTYyNTNcdTUzMDVcdTU0MEVcdTc2ODRcdTU5MjdcdTVDMEZcdUZGMUEke2J5dGVzVG9TaXplKHMpfSlgLFxuICAgICAgICAgICAgKX1gLFxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHZpdGVCdWlsZE91dGVJbmZvO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxEZXNrdG9wXFxcXHZzY29kZVdvcmtzcGFjZVxcXFx0YXVyaV9kZW1vXFxcXHRhdXJpX2FwcFxcXFx0YXVyaURSVFxcXFxidWlsZFxcXFx2aXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxEZXNrdG9wXFxcXHZzY29kZVdvcmtzcGFjZVxcXFx0YXVyaV9kZW1vXFxcXHRhdXJpX2FwcFxcXFx0YXVyaURSVFxcXFxidWlsZFxcXFx2aXRlXFxcXHJlc29sdmUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L0Rlc2t0b3AvdnNjb2RlV29ya3NwYWNlL3RhdXJpX2RlbW8vdGF1cmlfYXBwL3RhdXJpRFJUL2J1aWxkL3ZpdGUvcmVzb2x2ZS50c1wiO2ltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHR5cGUgeyBSZXNvbHZlT3B0aW9ucywgQWxpYXNPcHRpb25zIH0gZnJvbSAndml0ZSc7XG5cbnR5cGUgbXlSZXNvbHZlT3B0aW9ucyA9IFJlc29sdmVPcHRpb25zICYgeyBhbGlhcz86IEFsaWFzT3B0aW9ucyB9O1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVml0ZVJlc29sdmUobW9kZTogc3RyaW5nLCBteURpcm5hbWU6IHN0cmluZyk6IG15UmVzb2x2ZU9wdGlvbnMge1xuICBjb25zdCB2aXRlUmVzb2x2ZTogbXlSZXNvbHZlT3B0aW9ucyA9IHtcbiAgICAvLyBcdTVGMTVcdTc1MjhcdTUyMkJcdTU0MERcdTkxNERcdTdGNkVcbiAgICBhbGlhczoge1xuICAgICAgLy8gXHU5MTREXHU3RjZFQFx1NTIyQlx1NTQwRFxuICAgICAgJ0AnOiBgJHtwYXRoLnJlc29sdmUobXlEaXJuYW1lLCAnc3JjJyl9YCxcbiAgICAgIC8vIFx1OTE0RFx1N0Y2RSNcdTUyMkJcdTU0MERcbiAgICAgICcjJzogYCR7cGF0aC5yZXNvbHZlKG15RGlybmFtZSwgJ3R5cGVzJyl9YCxcbiAgICB9LFxuICAgIC8vIFx1NUJGQ1x1NTE2NVx1NjVGNlx1NjBGM1x1ODk4MVx1NzcwMVx1NzU2NVx1NzY4NFx1NjI2OVx1NUM1NVx1NTQwRFx1NTIxN1x1ODg2OFx1MzAwMlx1NkNFOFx1NjEwRlx1RkYwQ1x1NEUwRCBcdTVFRkFcdThCQUVcdTVGRkRcdTc1NjVcdTgxRUFcdTVCOUFcdTRFNDlcdTVCRkNcdTUxNjVcdTdDN0JcdTU3OEJcdTc2ODRcdTYyNjlcdTVDNTVcdTU0MERcdUZGMDhcdTRGOEJcdTU5ODJcdUZGMUEudnVlXHVGRjA5XHVGRjBDXHU1NkUwXHU0RTNBXHU1QjgzXHU0RjFBXHU1RTcyXHU2MjcwIElERSBcdTU0OENcdTdDN0JcdTU3OEJcdTY1MkZcdTYzMDFcdTMwMDJcbiAgICBleHRlbnNpb25zOiBbJy5tanMnLCAnLmpzJywgJy50cycsICcuanN4JywgJy50c3gnLCAnLmpzb24nXSxcbiAgfTtcblxuICByZXR1cm4gdml0ZVJlc29sdmU7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXERlc2t0b3BcXFxcdnNjb2RlV29ya3NwYWNlXFxcXHRhdXJpX2RlbW9cXFxcdGF1cmlfYXBwXFxcXHRhdXJpRFJUXFxcXGJ1aWxkXFxcXHZpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXERlc2t0b3BcXFxcdnNjb2RlV29ya3NwYWNlXFxcXHRhdXJpX2RlbW9cXFxcdGF1cmlfYXBwXFxcXHRhdXJpRFJUXFxcXGJ1aWxkXFxcXHZpdGVcXFxcYnVpbGQudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L0Rlc2t0b3AvdnNjb2RlV29ya3NwYWNlL3RhdXJpX2RlbW8vdGF1cmlfYXBwL3RhdXJpRFJUL2J1aWxkL3ZpdGUvYnVpbGQudHNcIjtpbXBvcnQgdHlwZSB7IEJ1aWxkT3B0aW9ucyB9IGZyb20gJ3ZpdGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVml0ZUJ1aWxkKCk6IEJ1aWxkT3B0aW9ucyB7XG4gIGNvbnN0IHZpdGVCdWlsZCA9IHtcbiAgICB0YXJnZXQ6IFsnZXMyMDIxJywgJ2Nocm9tZTEwMCcsICdzYWZhcmkxMyddLFxuICAgIC8vIGRvbid0IG1pbmlmeSBmb3IgZGVidWcgYnVpbGRzXG4gICAgbWluaWZ5OiAoIXByb2Nlc3MuZW52LlRBVVJJX0RFQlVHID8gJ2VzYnVpbGQnIDogZmFsc2UpIGFzIEJ1aWxkT3B0aW9uc1snbWluaWZ5J10sXG4gICAgLy8gcHJvZHVjZSBzb3VyY2VtYXBzIGZvciBkZWJ1ZyBidWlsZHNcbiAgICBzb3VyY2VtYXA6ICEhcHJvY2Vzcy5lbnYuVEFVUklfREVCVUcsXG4gICAgLy8gXHU2MzA3XHU1QjlBXHU4RjkzXHU1MUZBXHU4REVGXHU1Rjg0XG4gICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgY3NzVGFyZ2V0OiAnY2hyb21lODAnLFxuXG4gICAgLy8gXHU2MzA3XHU1QjlBXHU3NTFGXHU2MjEwXHU5NzU5XHU2MDAxXHU4RDQ0XHU2RTkwXHU3Njg0XHU1QjU4XHU2NTNFXHU4REVGXHU1Rjg0XG4gICAgYXNzZXRzRGlyOiAnc3RhdGljJyxcbiAgICAvLyBcdTU0MkZcdTc1MjgvXHU3OTgxXHU3NTI4IENTUyBcdTRFRTNcdTc4MDFcdTYyQzZcdTUyMDZcdTMwMDJcdTVGNTNcdTU0MkZcdTc1MjhcdTY1RjZcdUZGMENcdTU3MjhcdTVGMDJcdTZCNjUgY2h1bmsgXHU0RTJEXHU1QkZDXHU1MTY1XHU3Njg0IENTUyBcdTVDMDZcdTUxODVcdTgwNTRcdTUyMzBcdTVGMDJcdTZCNjUgY2h1bmsgXHU2NzJDXHU4RUFCXHVGRjBDXHU1RTc2XHU1NzI4XHU1NzU3XHU1MkEwXHU4RjdEXHU2NUY2XHU2M0QyXHU1MTY1IFx1NTk4Mlx1Njc5Q1x1Nzk4MVx1NzUyOFx1RkYwQ1x1NjU3NFx1NEUyQVx1OTg3OVx1NzZFRVx1NEUyRFx1NzY4NFx1NjI0MFx1NjcwOSBDU1MgXHU1QzA2XHU4OEFCXHU2M0QwXHU1M0Q2XHU1MjMwXHU0RTAwXHU0RTJBIENTUyBcdTY1ODdcdTRFRjZcdTRFMkRcdTMwMDJcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXG4gICAgLy8gXHU2Nzg0XHU1RUZBXHU1NDBFXHU2NjJGXHU1NDI2XHU3NTFGXHU2MjEwIHNvdXJjZSBtYXAgXHU2NTg3XHU0RUY2XHUzMDAyXG4gICAgLy8gXHU1NDJGXHU3NTI4L1x1Nzk4MVx1NzUyOCBicm90bGkgXHU1MzhCXHU3RjI5XHU1OTI3XHU1QzBGXHU2MkE1XHU1NDRBXHUzMDAyXHU1MzhCXHU3RjI5XHU1OTI3XHU1NzhCXHU4RjkzXHU1MUZBXHU2NTg3XHU0RUY2XHU1M0VGXHU4MEZEXHU0RjFBXHU1Rjg4XHU2MTYyXHVGRjBDXHU1NkUwXHU2QjY0XHU3OTgxXHU3NTI4XHU4QkU1XHU1MjlGXHU4MEZEXHU1M0VGXHU4MEZEXHU0RjFBXHU2M0QwXHU5QUQ4XHU1OTI3XHU1NzhCXHU5ODc5XHU3NkVFXHU3Njg0XHU2Nzg0XHU1RUZBXHU2MDI3XHU4MEZEXHUzMDAyXG4gICAgYnJvdGxpU2l6ZTogZmFsc2UsXG4gICAgLy8gbWluaWZ5OiAndGVyc2VyJyxcbiAgICAvLyB0ZXJzZXJPcHRpb25zOiB7XG4gICAgLy8gICBjb21wcmVzczoge1xuICAgIC8vICAgICAvLyBcdTYyNTNcdTUzMDVcdTZFMDVcdTk2NjRjb25zb2xlXG4gICAgLy8gICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcbiAgICAvLyAgIH0sXG4gICAgLy8gfSxcbiAgICAvLyBjaHVuayBcdTU5MjdcdTVDMEZcdThCNjZcdTU0NEFcdTc2ODRcdTk2NTBcdTUyMzZcdUZGMDhcdTRFRTUga2JzIFx1NEUzQVx1NTM1NVx1NEY0RFx1RkYwOVxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMjAwMCxcbiAgfTtcbiAgcmV0dXJuIHZpdGVCdWlsZDtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcRGVza3RvcFxcXFx2c2NvZGVXb3Jrc3BhY2VcXFxcdGF1cmlfZGVtb1xcXFx0YXVyaV9hcHBcXFxcdGF1cmlEUlRcXFxcYnVpbGRcXFxcdml0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcRGVza3RvcFxcXFx2c2NvZGVXb3Jrc3BhY2VcXFxcdGF1cmlfZGVtb1xcXFx0YXVyaV9hcHBcXFxcdGF1cmlEUlRcXFxcYnVpbGRcXFxcdml0ZVxcXFxlc2J1aWxkLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9EZXNrdG9wL3ZzY29kZVdvcmtzcGFjZS90YXVyaV9kZW1vL3RhdXJpX2FwcC90YXVyaURSVC9idWlsZC92aXRlL2VzYnVpbGQudHNcIjsvLyBodHRwczovL2NuLnZpdGVqcy5kZXYvY29uZmlnL3NoYXJlZC1vcHRpb25zLmh0bWwjZXNidWlsZFxuXG5pbXBvcnQgdHlwZSB7IEVTQnVpbGRPcHRpb25zIH0gZnJvbSAndml0ZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVWaXRlRXNidWlsZChpc0J1aWxkOiBib29sZWFuKTogRVNCdWlsZE9wdGlvbnMgfCBmYWxzZSB7XG4gIHJldHVybiB7XG4gICAgcHVyZTogaXNCdWlsZCA/IFsnY29uc29sZSddIDogW10sXG4gIH07XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXERlc2t0b3BcXFxcdnNjb2RlV29ya3NwYWNlXFxcXHRhdXJpX2RlbW9cXFxcdGF1cmlfYXBwXFxcXHRhdXJpRFJUXFxcXGJ1aWxkXFxcXHZpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXERlc2t0b3BcXFxcdnNjb2RlV29ya3NwYWNlXFxcXHRhdXJpX2RlbW9cXFxcdGF1cmlfYXBwXFxcXHRhdXJpRFJUXFxcXGJ1aWxkXFxcXHZpdGVcXFxcc2VydmVyLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9EZXNrdG9wL3ZzY29kZVdvcmtzcGFjZS90YXVyaV9kZW1vL3RhdXJpX2FwcC90YXVyaURSVC9idWlsZC92aXRlL3NlcnZlci50c1wiO2ltcG9ydCB0eXBlIHsgU2VydmVyT3B0aW9ucyB9IGZyb20gJ3ZpdGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVml0ZVNlcnZlcigpOiBTZXJ2ZXJPcHRpb25zIHtcbiAgY29uc3Qgdml0ZVNlcnZlcjogU2VydmVyT3B0aW9ucyA9IHtcbiAgICAvLyBcdTY3MERcdTUyQTFcdTU2NjhcdTRFM0JcdTY3M0FcdTU0MERcdUZGMENcdTU5ODJcdTY3OUNcdTUxNDFcdThCQjhcdTU5MTZcdTkwRThcdThCQkZcdTk1RUVcdUZGMENcdTUzRUZcdThCQkVcdTdGNkVcdTRFM0FcIjAuMC4wLjBcIlxuICAgIGhvc3Q6IHRydWUsXG4gICAgLy8gXHU2NzBEXHU1MkExXHU1NjY4XHU3QUVGXHU1M0UzXHU1M0Y3XG4gICAgcG9ydDogNTE3MyxcbiAgICAvLyBcdTdBRUZcdTUzRTNcdTVERjJcdTg4QUJcdTUzNjBcdTc1MjhcdTY1RjZcdTY2MkZcdTU0MjZcdTVDMURcdThCRDVcdTRGN0ZcdTc1MjhcdTRFMEJcdTRFMDBcdTRFMkFcdTUzRUZcdTc1MjhcdTc2ODRcdTdBRUZcdTUzRTMgdHJ1ZVx1RkYxQVx1NzZGNFx1NjNBNVx1OTAwMFx1NTFGQVx1RkYwQ1x1ODAwQ1x1NEUwRFx1NjYyRlx1NUMxRFx1OEJENVx1NEUwQlx1NEUwMFx1NEUyQVx1NTNFRlx1NzUyOFx1N0FFRlx1NTNFMyBmYWxzZVx1RkYxQVx1NUMxRFx1OEJENVx1NEUwQlx1NEUwMFx1NEUyQVx1NTNFRlx1NzUyOFx1N0FFRlx1NTNFM1xuICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgLy8gYm9vbGVhbiB8IHN0cmluZyBcdTU0MkZcdTUyQThcdTk4NzlcdTc2RUVcdTY1RjZcdTgxRUFcdTUyQThcdTU3MjhcdTZENEZcdTg5QzhcdTU2NjhcdTYyNTNcdTVGMDBcdTVFOTRcdTc1MjhcdTdBMEJcdTVFOEZcdUZGMUJcdTU5ODJcdTY3OUNcdTRFM0FzdHJpbmdcdUZGMENcdTZCRDRcdTU5ODJcIi9pbmRleC5odG1sXCJcdUZGMENcdTRGMUFcdTYyNTNcdTVGMDBodHRwOi8vbG9jYWxob3N0OjUxNzMvaW5kZXguaHRtbFxuICAgIC8vIG9wZW46IHRydWUsXG4gICAgLy8gYm9vbGVhbiB8IENvcnNPcHRpb25zICBcdTRFM0FcdTVGMDBcdTUzRDFcdTY3MERcdTUyQTFcdTU2NjhcdTkxNERcdTdGNkUgQ09SU1x1MzAwMlx1OUVEOFx1OEJBNFx1NTQyRlx1NzUyOFx1NUU3Nlx1NTE0MVx1OEJCOFx1NEVGQlx1NEY1NVx1NkU5MFx1RkYwQ1x1NEYyMFx1OTAxMlx1NEUwMFx1NEUyQSBcdTkwMDlcdTk4NzlcdTVCRjlcdThDNjEgXHU2NzY1XHU4QzAzXHU2NTc0XHU4ODRDXHU0RTNBXHU2MjE2XHU4QkJFXHU0RTNBIGZhbHNlIFx1ODg2OFx1NzkzQVx1Nzk4MVx1NzUyOFx1MzAwMlxuICAgIC8vIGNvcnM6IHRydWUsXG4gICAgLy8gXHU4QkJFXHU3RjZFXHU0RTNBIHRydWUgXHU1RjNBXHU1MjM2XHU0RjdGXHU0RjlEXHU4RDU2XHU5ODg0XHU2Nzg0XHU1RUZBXHUzMDAyXG4gICAgLy8gZm9yY2U6IGZhbHNlLFxuICAgIC8vIFx1ODFFQVx1NUI5QVx1NEU0OVx1NEVFM1x1NzQwNlx1ODlDNFx1NTIxOVxuICAgIHByb3h5OiB7XG4gICAgICAnL2FwaSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xuICByZXR1cm4gdml0ZVNlcnZlcjtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcRGVza3RvcFxcXFx2c2NvZGVXb3Jrc3BhY2VcXFxcdGF1cmlfZGVtb1xcXFx0YXVyaV9hcHBcXFxcdGF1cmlEUlRcXFxcYnVpbGRcXFxcdml0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcRGVza3RvcFxcXFx2c2NvZGVXb3Jrc3BhY2VcXFxcdGF1cmlfZGVtb1xcXFx0YXVyaV9hcHBcXFxcdGF1cmlEUlRcXFxcYnVpbGRcXFxcdml0ZVxcXFxvcHRpbWl6ZURlcHMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L0Rlc2t0b3AvdnNjb2RlV29ya3NwYWNlL3RhdXJpX2RlbW8vdGF1cmlfYXBwL3RhdXJpRFJUL2J1aWxkL3ZpdGUvb3B0aW1pemVEZXBzLnRzXCI7aW1wb3J0IHR5cGUgeyBEZXBPcHRpbWl6YXRpb25PcHRpb25zIH0gZnJvbSAndml0ZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVWaXRlT3B0aW1pemVEZXBzKCk6IERlcE9wdGltaXphdGlvbk9wdGlvbnMge1xuICBjb25zdCB2aXRlT3B0aW1pemVEZXBzOiBEZXBPcHRpbWl6YXRpb25PcHRpb25zID0ge1xuICAgIC8vIFx1OUVEOFx1OEJBNFx1NjBDNVx1NTFCNVx1NEUwQlx1RkYwQ1x1NEUwRFx1NTcyOCBub2RlX21vZHVsZXMgXHU0RTJEXHU3Njg0XHVGRjBDXHU5NEZFXHU2M0E1XHU3Njg0XHU1MzA1XHU0RTBEXHU0RjFBXHU4OEFCXHU5ODg0XHU2Nzg0XHU1RUZBXHUzMDAyXHU0RjdGXHU3NTI4XHU2QjY0XHU5MDA5XHU5ODc5XHU1M0VGXHU1RjNBXHU1MjM2XHU5ODg0XHU2Nzg0XHU1RUZBXHU5NEZFXHU2M0E1XHU3Njg0XHU1MzA1XHUzMDAyXG4gICAgaW5jbHVkZTogWydlbGVtZW50LXBsdXMvZXMvbG9jYWxlL2xhbmcvemgtdHcnLCAnZWxlbWVudC1wbHVzL2VzL2xvY2FsZS9sYW5nL2VuJ10sXG4gICAgLy8gXHU5RUQ4XHU4QkE0XHU2MEM1XHU1MUI1XHU0RTBCXHVGRjBDVml0ZSBcdTRGMUFcdTYyOTNcdTUzRDZcdTRGNjBcdTc2ODQgaW5kZXguaHRtbCBcdTY3NjVcdTY4QzBcdTZENEJcdTk3MDBcdTg5ODFcdTk4ODRcdTY3ODRcdTVFRkFcdTc2ODRcdTRGOURcdThENTZcdTk4NzlcdTMwMDJcdTU5ODJcdTY3OUNcdTYzMDdcdTVCOUFcdTRFODYgYnVpbGQucm9sbHVwT3B0aW9ucy5pbnB1dFx1RkYwQ1ZpdGUgXHU1QzA2XHU4RjZDXHU4MDBDXHU1M0JCXHU2MjkzXHU1M0Q2XHU4RkQ5XHU0RTlCXHU1MTY1XHU1M0UzXHU3MEI5XHUzMDAyXG4gICAgZW50cmllczogW10sXG4gICAgLy8gXHU1NzI4XHU5ODg0XHU2Nzg0XHU1RUZBXHU0RTJEXHU1RjNBXHU1MjM2XHU2MzkyXHU5NjY0XHU3Njg0XHU0RjlEXHU4RDU2XHU5ODc5XHUzMDAyXG4gICAgZXhjbHVkZTogWydAem91Z3Qvdml0ZS1wbHVnaW4tdGhlbWUtcHJlcHJvY2Vzc29yL2Rpc3QvYnJvd3Nlci11dGlscyddLFxuICB9O1xuICByZXR1cm4gdml0ZU9wdGltaXplRGVwcztcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcRGVza3RvcFxcXFx2c2NvZGVXb3Jrc3BhY2VcXFxcdGF1cmlfZGVtb1xcXFx0YXVyaV9hcHBcXFxcdGF1cmlEUlRcXFxcYnVpbGRcXFxcdml0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcRGVza3RvcFxcXFx2c2NvZGVXb3Jrc3BhY2VcXFxcdGF1cmlfZGVtb1xcXFx0YXVyaV9hcHBcXFxcdGF1cmlEUlRcXFxcYnVpbGRcXFxcdml0ZVxcXFxjc3MudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L0Rlc2t0b3AvdnNjb2RlV29ya3NwYWNlL3RhdXJpX2RlbW8vdGF1cmlfYXBwL3RhdXJpRFJUL2J1aWxkL3ZpdGUvY3NzLnRzXCI7aW1wb3J0IHR5cGUgeyBDU1NPcHRpb25zIH0gZnJvbSAndml0ZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVWaXRlQ1NTKCk6IENTU09wdGlvbnMge1xuICBjb25zdCB2aXRlQ1NTOiBDU1NPcHRpb25zID0ge1xuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgIC8vIFx1OTE0RFx1N0Y2RXNjc3NcdTUxNjhcdTVDNDBcdTY4MzdcdTVGMEZcdTRFRTVcdTUzQ0FcdTUzRDhcdTkxQ0ZcbiAgICAgIHNjc3M6IHtcbiAgICAgICAgY2hhcnNldDogZmFsc2UsXG4gICAgICAgIGFkZGl0aW9uYWxEYXRhOiBgXG4gICAgICAgICAgQHVzZSBcIi4vc3JjL3N0eWxlcy92YXIvZWxlbWVudC90aGVtZS9pbmRleC5zY3NzXCIgYXMgKjsgXG4gICAgICAgICAgQHVzZSBcIi4vc3JjL3N0eWxlcy92YXIvaW5kZXguc2Nzc1wiIGFzICo7XG4gICAgICAgIGAsXG4gICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xuICByZXR1cm4gdml0ZUNTUztcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcRGVza3RvcFxcXFx2c2NvZGVXb3Jrc3BhY2VcXFxcdGF1cmlfZGVtb1xcXFx0YXVyaV9hcHBcXFxcdGF1cmlEUlRcXFxcYnVpbGRcXFxcdml0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcRGVza3RvcFxcXFx2c2NvZGVXb3Jrc3BhY2VcXFxcdGF1cmlfZGVtb1xcXFx0YXVyaV9hcHBcXFxcdGF1cmlEUlRcXFxcYnVpbGRcXFxcdml0ZVxcXFx2aXRlVGVzdENvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovRGVza3RvcC92c2NvZGVXb3Jrc3BhY2UvdGF1cmlfZGVtby90YXVyaV9hcHAvdGF1cmlEUlQvYnVpbGQvdml0ZS92aXRlVGVzdENvbmZpZy50c1wiO2ltcG9ydCB0eXBlIHsgVXNlckNvbmZpZyB9IGZyb20gJ3ZpdGVzdC9jb25maWcnO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlVml0ZXN0VGVzdCA9ICgpOiBVc2VyQ29uZmlnWyd0ZXN0J10gPT4ge1xuICByZXR1cm4ge1xuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxuICAgIHRyYW5zZm9ybU1vZGU6IHtcbiAgICAgIHdlYjogWy8udHN4JC9dLFxuICAgIH0sXG4gIH07XG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxEZXNrdG9wXFxcXHZzY29kZVdvcmtzcGFjZVxcXFx0YXVyaV9kZW1vXFxcXHRhdXJpX2FwcFxcXFx0YXVyaURSVFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcRGVza3RvcFxcXFx2c2NvZGVXb3Jrc3BhY2VcXFxcdGF1cmlfZGVtb1xcXFx0YXVyaV9hcHBcXFxcdGF1cmlEUlRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L0Rlc2t0b3AvdnNjb2RlV29ya3NwYWNlL3RhdXJpX2RlbW8vdGF1cmlfYXBwL3RhdXJpRFJUL3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxuXG5pbXBvcnQgdHlwZSB7IFVzZXJDb25maWcsIENvbmZpZ0VudiB9IGZyb20gJ3ZpdGUnO1xuXG5pbXBvcnQgeyBjcmVhdGVWaXRlUGx1Z2lucyB9IGZyb20gJy4vYnVpbGQvdml0ZS9wbHVnaW4nO1xuaW1wb3J0IHsgY3JlYXRlVml0ZVJlc29sdmUgfSBmcm9tICcuL2J1aWxkL3ZpdGUvcmVzb2x2ZSc7XG5pbXBvcnQgeyBjcmVhdGVWaXRlQnVpbGQgfSBmcm9tICcuL2J1aWxkL3ZpdGUvYnVpbGQnO1xuaW1wb3J0IHsgY3JlYXRlVml0ZUVzYnVpbGQgfSBmcm9tICcuL2J1aWxkL3ZpdGUvZXNidWlsZCc7XG5pbXBvcnQgeyBjcmVhdGVWaXRlU2VydmVyIH0gZnJvbSAnLi9idWlsZC92aXRlL3NlcnZlcic7XG5pbXBvcnQgeyBjcmVhdGVWaXRlT3B0aW1pemVEZXBzIH0gZnJvbSAnLi9idWlsZC92aXRlL29wdGltaXplRGVwcyc7XG5pbXBvcnQgeyBjcmVhdGVWaXRlQ1NTIH0gZnJvbSAnLi9idWlsZC92aXRlL2Nzcyc7XG5pbXBvcnQgeyBjcmVhdGVWaXRlc3RUZXN0IH0gZnJvbSAnLi9idWlsZC92aXRlL3ZpdGVUZXN0Q29uZmlnJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IChjb25maWdFbnY6IENvbmZpZ0Vudik6IFVzZXJDb25maWcgPT4ge1xuICBjb25zdCB7IG1vZGUsIGNvbW1hbmQgfSA9IGNvbmZpZ0VudjtcbiAgLy8gY29uc3Qgcm9vdCA9IHByb2Nlc3MuY3dkKCk7XG5cbiAgLy8gY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCByb290KTtcblxuICBjb25zdCBpc0J1aWxkID0gY29tbWFuZCA9PT0gJ2J1aWxkJztcblxuICByZXR1cm4ge1xuICAgIC8vIFx1OEJCRVx1NEUzQSBmYWxzZSBcdTUzRUZcdTRFRTVcdTkwN0ZcdTUxNEQgVml0ZSBcdTZFMDVcdTVDNEZcdTgwMENcdTk1MTlcdThGQzdcdTU3MjhcdTdFQzhcdTdBRUZcdTRFMkRcdTYyNTNcdTUzNzBcdTY3RDBcdTRFOUJcdTUxNzNcdTk1MkVcdTRGRTFcdTYwNkZcdTMwMDJcdTU0N0RcdTRFRTRcdTg4NENcdTZBMjFcdTVGMEZcdTRFMEJcdThCRjdcdTkwMUFcdThGQzcgLS1jbGVhclNjcmVlbiBmYWxzZSBcdThCQkVcdTdGNkVcdTMwMDJcbiAgICBjbGVhclNjcmVlbjogZmFsc2UsXG4gICAgbG9nTGV2ZWw6ICdpbmZvJyxcbiAgICBlbnZQcmVmaXg6IFsnVklURV8nLCAnVEFVUklfJ10sXG4gICAgLy8gZXNidWlsZFxuICAgIGVzYnVpbGQ6IGNyZWF0ZVZpdGVFc2J1aWxkKGlzQnVpbGQpLFxuICAgIC8vIHZpdGVzdFx1OTE0RFx1N0Y2RVxuICAgIHRlc3Q6IGNyZWF0ZVZpdGVzdFRlc3QoKSxcbiAgICAvLyBcdTg5RTNcdTY3OTBcdTkxNERcdTdGNkVcbiAgICByZXNvbHZlOiBjcmVhdGVWaXRlUmVzb2x2ZShtb2RlLCBfX2Rpcm5hbWUpLFxuICAgIC8vIFx1NjNEMlx1NEVGNlx1OTE0RFx1N0Y2RVxuICAgIHBsdWdpbnM6IGNyZWF0ZVZpdGVQbHVnaW5zKGlzQnVpbGQsIGNvbmZpZ0VudiksXG4gICAgLy8gXHU2NzBEXHU1MkExXHU5MTREXHU3RjZFXG4gICAgc2VydmVyOiBjcmVhdGVWaXRlU2VydmVyKCksXG4gICAgLy8gXHU2MjUzXHU1MzA1XHU5MTREXHU3RjZFXG4gICAgYnVpbGQ6IGNyZWF0ZVZpdGVCdWlsZCgpLFxuICAgIC8vIFx1NEY5RFx1OEQ1Nlx1NEYxOFx1NTMxNlx1OTE0RFx1N0Y2RVxuICAgIG9wdGltaXplRGVwczogY3JlYXRlVml0ZU9wdGltaXplRGVwcygpLFxuICAgIC8vIGNzc1x1OTg4NFx1NTkwNFx1NzQwNlx1OTE0RFx1N0Y2RVxuICAgIGNzczogY3JlYXRlVml0ZUNTUygpLFxuICB9O1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1osT0FBTyxTQUFTO0FBRXRhLE9BQU8sWUFBWTtBQU9uQixPQUFPLGFBQWE7OztBQ0ZiLFNBQVMsb0JBQXVDO0FBc0JyRCxRQUFNLFNBQW1CLENBQUM7QUFDMUIsU0FBTztBQUNUOzs7QUMzQkEsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsNEJBQTRCO0FBRTlCLFNBQVMsa0JBQWtCO0FBQ2hDLFFBQU0sWUFBWSxxQkFBcUI7QUFBQTtBQUFBLElBRXJDLFVBQVUsQ0FBQyxLQUFLLFFBQVEsUUFBUSxJQUFJLEdBQUcsa0JBQWtCLENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUkxRCxVQUFVO0FBQUEsRUFDWixDQUFDO0FBQ0QsU0FBTztBQUNUOzs7QUNiQSxPQUFPLHFCQUFxQjtBQUlyQixTQUFTLHFCQUNkLFVBQ0EsVUFBVSxPQUNTO0FBQ25CLE1BQUksVUFBVSxDQUFDO0FBQ2YsTUFBSSxhQUFhLFFBQVE7QUFDdkIsY0FBVTtBQUFBLE1BQ1IsS0FBSztBQUFBLE1BQ0wsV0FBVztBQUFBLElBQ2I7QUFBQSxFQUNGO0FBQ0EsTUFBSSxhQUFhLFVBQVU7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LFlBQVk7QUFFNUIsU0FBTztBQUFBO0FBQUEsSUFFTCxhQUFhO0FBQUEsSUFDYixVQUFVO0FBQUEsSUFDVixXQUFXLENBQUMsU0FBUyxRQUFRO0FBQUE7QUFBQSxJQUU3QixTQUFTLGtCQUFrQixPQUFPO0FBQUE7QUFBQSxJQUVsQyxNQUFNLGlCQUFpQjtBQUFBO0FBQUEsSUFFdkIsU0FBUyxrQkFBa0IsTUFBTUMsaUNBQVM7QUFBQTtBQUFBLElBRTFDLFNBQVMsa0JBQWtCLFNBQVMsU0FBUztBQUFBO0FBQUEsSUFFN0MsUUFBUSxpQkFBaUI7QUFBQTtBQUFBLElBRXpCLE9BQU8sZ0JBQWdCO0FBQUE7QUFBQSxJQUV2QixjQUFjLHVCQUF1QjtBQUFBO0FBQUEsSUFFckMsS0FBSyxjQUFjO0FBQUEsRUFDckI7QUFDRjsiLAogICJuYW1lcyI6IFsicGF0aCIsICJwYXRoIiwgImVyciIsICJwYXRoIiwgInBhdGgiLCAicGF0aCIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSJdCn0K
