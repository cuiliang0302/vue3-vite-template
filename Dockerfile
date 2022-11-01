FROM node:18.12.0 AS build
COPY . /opt/vue
WORKDIR /opt/vue
RUN npm install --registry https://registry.npm.taobao.org && npm run build

FROM nginx
COPY --from=build /opt/vue/dist /opt/vue/dist
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g","daemon off;"]
