// vite.config.js
import react from "file:///C:/Users/drist/Desktop/framcykart_project/admin/node_modules/@vitejs/plugin-react/dist/index.js";
import { defineConfig } from "file:///C:/Users/drist/Desktop/framcykart_project/admin/node_modules/vite/dist/node/index.js";
import cssInjectedByJsPlugin from "file:///C:/Users/drist/Desktop/framcykart_project/admin/node_modules/vite-plugin-css-injected-by-js/dist/esm/index.js";
import { VitePWA } from "file:///C:/Users/drist/Desktop/framcykart_project/admin/node_modules/vite-plugin-pwa/dist/index.js";
import compression from "file:///C:/Users/drist/Desktop/framcykart_project/admin/node_modules/vite-plugin-compression2/dist/index.mjs";
import { visualizer } from "file:///C:/Users/drist/Desktop/framcykart_project/admin/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import dns from "dns";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\drist\\Desktop\\framcykart_project\\admin";
dns.setDefaultResultOrder("verbatim");
var vite_config_default = defineConfig({
  // root: "./", // Set the root directory of your project
  // base: "/", // Set the base URL path for your application
  build: {
    // outDir: "build", // comment this if you select vite as project when deploy
    assetsDir: "@/assets",
    // Set the directory for the static assets
    // sourcemap: process.env.__DEV__ === "true",
    rollupOptions: {
      // Additional Rollup configuration options if needed
    },
    chunkSizeWarningLimit: 10 * 1024
  },
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        // enabled: process.env.SW_DEV === "true",
        enabled: false,
        /* when using generateSW the PWA plugin will switch to classic */
        type: "module",
        navigateFallback: "index.html"
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024
      },
      // add this to cache all the
      // // static assets in the public folder
      // includeAssets: ["**/*"],
      includeAssets: [
        "src/assets/img/logo/*.png",
        "src/assets/img/*.png",
        "src/assets/img/*.jepg",
        "src/assets/img/*.webp",
        "favicon.ico"
      ],
      manifest: {
        theme_color: "#FFFFFF",
        background_color: "#FFFFFF",
        display: "standalone",
        orientation: "portrait",
        scope: ".",
        start_url: ".",
        id: ".",
        short_name: "Farmacykart - E-Commerce Website",
        name: "Farmacykart | React eCommerce Admin Dashboard",
        description: "Farmacykart : React Grocery & Organic Food Store e-commerce Admin Dashboard",
        icons: [
          {
            src: "favicon.ico",
            sizes: "48x48",
            type: "image/x-icon"
          },
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/icon-256x256.png",
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: "/icon-384x384.png",
            sizes: "384x384",
            type: "image/png"
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    }),
    compression(),
    visualizer({
      filename: "statistics.html",
      open: true
    })
  ],
  server: {
    proxy: {
      "/api/": {
        target: "http://localhost:5065",
        changeOrigin: true
      }
    }
  },
  define: {
    "process.env": process.env
    // global: {}, //enable this when running on dev/local mode
  },
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__vite_injected_original_dirname, "./src/")
    }
  },
  test: {
    global: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTest.js"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkcmlzdFxcXFxEZXNrdG9wXFxcXGZyYW1jeWthcnRfcHJvamVjdFxcXFxhZG1pblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZHJpc3RcXFxcRGVza3RvcFxcXFxmcmFtY3lrYXJ0X3Byb2plY3RcXFxcYWRtaW5cXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2RyaXN0L0Rlc2t0b3AvZnJhbWN5a2FydF9wcm9qZWN0L2FkbWluL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgY3NzSW5qZWN0ZWRCeUpzUGx1Z2luIGZyb20gXCJ2aXRlLXBsdWdpbi1jc3MtaW5qZWN0ZWQtYnktanNcIjtcclxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIjtcclxuaW1wb3J0IGNvbXByZXNzaW9uIGZyb20gXCJ2aXRlLXBsdWdpbi1jb21wcmVzc2lvbjJcIjtcclxuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gXCJyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXJcIjtcclxuXHJcbmltcG9ydCBkbnMgZnJvbSBcImRuc1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5cclxuZG5zLnNldERlZmF1bHRSZXN1bHRPcmRlcihcInZlcmJhdGltXCIpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAvLyByb290OiBcIi4vXCIsIC8vIFNldCB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgeW91ciBwcm9qZWN0XHJcbiAgLy8gYmFzZTogXCIvXCIsIC8vIFNldCB0aGUgYmFzZSBVUkwgcGF0aCBmb3IgeW91ciBhcHBsaWNhdGlvblxyXG5cclxuICBidWlsZDoge1xyXG4gICAgLy8gb3V0RGlyOiBcImJ1aWxkXCIsIC8vIGNvbW1lbnQgdGhpcyBpZiB5b3Ugc2VsZWN0IHZpdGUgYXMgcHJvamVjdCB3aGVuIGRlcGxveVxyXG4gICAgYXNzZXRzRGlyOiBcIkAvYXNzZXRzXCIsIC8vIFNldCB0aGUgZGlyZWN0b3J5IGZvciB0aGUgc3RhdGljIGFzc2V0c1xyXG4gICAgLy8gc291cmNlbWFwOiBwcm9jZXNzLmVudi5fX0RFVl9fID09PSBcInRydWVcIixcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgLy8gQWRkaXRpb25hbCBSb2xsdXAgY29uZmlndXJhdGlvbiBvcHRpb25zIGlmIG5lZWRlZFxyXG4gICAgfSxcclxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAgKiAxMDI0LFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIGNzc0luamVjdGVkQnlKc1BsdWdpbigpLFxyXG5cclxuICAgIFZpdGVQV0Eoe1xyXG4gICAgICByZWdpc3RlclR5cGU6IFwiYXV0b1VwZGF0ZVwiLFxyXG4gICAgICBkZXZPcHRpb25zOiB7XHJcbiAgICAgICAgLy8gZW5hYmxlZDogcHJvY2Vzcy5lbnYuU1dfREVWID09PSBcInRydWVcIixcclxuICAgICAgICBlbmFibGVkOiBmYWxzZSxcclxuICAgICAgICAvKiB3aGVuIHVzaW5nIGdlbmVyYXRlU1cgdGhlIFBXQSBwbHVnaW4gd2lsbCBzd2l0Y2ggdG8gY2xhc3NpYyAqL1xyXG4gICAgICAgIHR5cGU6IFwibW9kdWxlXCIsXHJcbiAgICAgICAgbmF2aWdhdGVGYWxsYmFjazogXCJpbmRleC5odG1sXCIsXHJcbiAgICAgIH0sXHJcbiAgICAgIHdvcmtib3g6IHtcclxuICAgICAgICBnbG9iUGF0dGVybnM6IFtcIioqLyoue2pzLGNzcyxodG1sLGljbyxwbmcsc3ZnfVwiXSxcclxuICAgICAgICBtYXhpbXVtRmlsZVNpemVUb0NhY2hlSW5CeXRlczogMTAgKiAxMDI0ICogMTAyNCxcclxuICAgICAgfSxcclxuXHJcbiAgICAgIC8vIGFkZCB0aGlzIHRvIGNhY2hlIGFsbCB0aGVcclxuICAgICAgLy8gLy8gc3RhdGljIGFzc2V0cyBpbiB0aGUgcHVibGljIGZvbGRlclxyXG4gICAgICAvLyBpbmNsdWRlQXNzZXRzOiBbXCIqKi8qXCJdLFxyXG4gICAgICBpbmNsdWRlQXNzZXRzOiBbXHJcbiAgICAgICAgXCJzcmMvYXNzZXRzL2ltZy9sb2dvLyoucG5nXCIsXHJcbiAgICAgICAgXCJzcmMvYXNzZXRzL2ltZy8qLnBuZ1wiLFxyXG4gICAgICAgIFwic3JjL2Fzc2V0cy9pbWcvKi5qZXBnXCIsXHJcbiAgICAgICAgXCJzcmMvYXNzZXRzL2ltZy8qLndlYnBcIixcclxuICAgICAgICBcImZhdmljb24uaWNvXCIsXHJcbiAgICAgIF0sXHJcbiAgICAgIG1hbmlmZXN0OiB7XHJcbiAgICAgICAgdGhlbWVfY29sb3I6IFwiI0ZGRkZGRlwiLFxyXG4gICAgICAgIGJhY2tncm91bmRfY29sb3I6IFwiI0ZGRkZGRlwiLFxyXG4gICAgICAgIGRpc3BsYXk6IFwic3RhbmRhbG9uZVwiLFxyXG4gICAgICAgIG9yaWVudGF0aW9uOiBcInBvcnRyYWl0XCIsXHJcbiAgICAgICAgc2NvcGU6IFwiLlwiLFxyXG4gICAgICAgIHN0YXJ0X3VybDogXCIuXCIsXHJcbiAgICAgICAgaWQ6IFwiLlwiLFxyXG4gICAgICAgIHNob3J0X25hbWU6IFwiRmFybWFjeWthcnQgLSBFLUNvbW1lcmNlIFdlYnNpdGVcIixcclxuICAgICAgICBuYW1lOiBcIkZhcm1hY3lrYXJ0IHwgUmVhY3QgZUNvbW1lcmNlIEFkbWluIERhc2hib2FyZFwiLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOlxyXG4gICAgICAgICAgXCJGYXJtYWN5a2FydCA6IFJlYWN0IEdyb2NlcnkgJiBPcmdhbmljIEZvb2QgU3RvcmUgZS1jb21tZXJjZSBBZG1pbiBEYXNoYm9hcmRcIixcclxuICAgICAgICBpY29uczogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6IFwiZmF2aWNvbi5pY29cIixcclxuICAgICAgICAgICAgc2l6ZXM6IFwiNDh4NDhcIixcclxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS94LWljb25cIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogXCIvaWNvbi0xOTJ4MTkyLnBuZ1wiLFxyXG4gICAgICAgICAgICBzaXplczogXCIxOTJ4MTkyXCIsXHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXHJcbiAgICAgICAgICAgIHB1cnBvc2U6IFwibWFza2FibGVcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogXCIvaWNvbi0yNTZ4MjU2LnBuZ1wiLFxyXG4gICAgICAgICAgICBzaXplczogXCIyNTZ4MjU2XCIsXHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6IFwiL2ljb24tMzg0eDM4NC5wbmdcIixcclxuICAgICAgICAgICAgc2l6ZXM6IFwiMzg0eDM4NFwiLFxyXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc3JjOiBcIi9pY29uLTUxMng1MTIucG5nXCIsXHJcbiAgICAgICAgICAgIHNpemVzOiBcIjUxMng1MTJcIixcclxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gICAgY29tcHJlc3Npb24oKSxcclxuICAgIHZpc3VhbGl6ZXIoe1xyXG4gICAgICBmaWxlbmFtZTogXCJzdGF0aXN0aWNzLmh0bWxcIixcclxuICAgICAgb3BlbjogdHJ1ZSxcclxuICAgIH0pLFxyXG4gIF0sXHJcblxyXG4gIHNlcnZlcjoge1xyXG4gICAgcHJveHk6IHtcclxuICAgICAgXCIvYXBpL1wiOiB7XHJcbiAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6NTA2NVwiLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBkZWZpbmU6IHtcclxuICAgIFwicHJvY2Vzcy5lbnZcIjogcHJvY2Vzcy5lbnYsXHJcbiAgICAvLyBnbG9iYWw6IHt9LCAvL2VuYWJsZSB0aGlzIHdoZW4gcnVubmluZyBvbiBkZXYvbG9jYWwgbW9kZVxyXG4gIH0sXHJcblxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9cIiksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgdGVzdDoge1xyXG4gICAgZ2xvYmFsOiB0cnVlLFxyXG4gICAgZW52aXJvbm1lbnQ6IFwianNkb21cIixcclxuICAgIHNldHVwRmlsZXM6IFtcIi4vc3JjL3NldHVwVGVzdC5qc1wiXSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyVSxPQUFPLFdBQVc7QUFDN1YsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTywyQkFBMkI7QUFDbEMsU0FBUyxlQUFlO0FBQ3hCLE9BQU8saUJBQWlCO0FBQ3hCLFNBQVMsa0JBQWtCO0FBRTNCLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFSakIsSUFBTSxtQ0FBbUM7QUFVekMsSUFBSSxzQkFBc0IsVUFBVTtBQUVwQyxJQUFPLHNCQUFRLGFBQWE7QUFBQTtBQUFBO0FBQUEsRUFJMUIsT0FBTztBQUFBO0FBQUEsSUFFTCxXQUFXO0FBQUE7QUFBQTtBQUFBLElBRVgsZUFBZTtBQUFBO0FBQUEsSUFFZjtBQUFBLElBQ0EsdUJBQXVCLEtBQUs7QUFBQSxFQUM5QjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sc0JBQXNCO0FBQUEsSUFFdEIsUUFBUTtBQUFBLE1BQ04sY0FBYztBQUFBLE1BQ2QsWUFBWTtBQUFBO0FBQUEsUUFFVixTQUFTO0FBQUE7QUFBQSxRQUVULE1BQU07QUFBQSxRQUNOLGtCQUFrQjtBQUFBLE1BQ3BCO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxjQUFjLENBQUMsZ0NBQWdDO0FBQUEsUUFDL0MsK0JBQStCLEtBQUssT0FBTztBQUFBLE1BQzdDO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFLQSxlQUFlO0FBQUEsUUFDYjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxVQUFVO0FBQUEsUUFDUixhQUFhO0FBQUEsUUFDYixrQkFBa0I7QUFBQSxRQUNsQixTQUFTO0FBQUEsUUFDVCxhQUFhO0FBQUEsUUFDYixPQUFPO0FBQUEsUUFDUCxXQUFXO0FBQUEsUUFDWCxJQUFJO0FBQUEsUUFDSixZQUFZO0FBQUEsUUFDWixNQUFNO0FBQUEsUUFDTixhQUNFO0FBQUEsUUFDRixPQUFPO0FBQUEsVUFDTDtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsWUFDTixTQUFTO0FBQUEsVUFDWDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxZQUFZO0FBQUEsSUFDWixXQUFXO0FBQUEsTUFDVCxVQUFVO0FBQUEsTUFDVixNQUFNO0FBQUEsSUFDUixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBRUEsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsU0FBUztBQUFBLFFBQ1AsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2hCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLGVBQWUsUUFBUTtBQUFBO0FBQUEsRUFFekI7QUFBQSxFQUVBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQTtBQUFBLE1BRUwsS0FBSyxLQUFLLFFBQVEsa0NBQVcsUUFBUTtBQUFBLElBQ3ZDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osUUFBUTtBQUFBLElBQ1IsYUFBYTtBQUFBLElBQ2IsWUFBWSxDQUFDLG9CQUFvQjtBQUFBLEVBQ25DO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
