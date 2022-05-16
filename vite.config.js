// @ts-ignore
import {resolve} from "path";
import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";

import Components from "unplugin-vue-components/vite";
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@": resolve(__dirname, "src")
		}
	},
	plugins: [
		vue(),
		Components({
			resolvers: [
				ElementPlusResolver({
					importStyle: "sass",
				}),
			],
		}),
	],
	build: {
		terserOptions: {
			compress: {
				//生产环境时移除console
				drop_console: process.env.VITE_DROP_CONSOLE,
				drop_debugger: process.env.VITE_DROP_DEBUGGER
			},
		},
		minify: 'terser'
	}
});
