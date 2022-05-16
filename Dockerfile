FROM node:16.15.0 AS build
COPY . /opt/vue
WORKDIR /opt/vue
RUN npm install && npm run build

FROM nginx:1.20.2
COPY --from=build /opt/vue/dist /opt/vue/dist
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g","daemon off;"]
