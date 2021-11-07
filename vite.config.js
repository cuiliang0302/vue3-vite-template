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
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@use "@/styles/variable.scss" as *;`,
			},
		},
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
});
