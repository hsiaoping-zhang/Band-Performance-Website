# 使用 Node.js 來進行建構
FROM node:16-alpine as build

# 設定工作目錄
WORKDIR /app

# 複製前端程式碼和依賴檔案
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./.env ./

# 使用 npm 安裝相依性
RUN npm install

# 強制重建 esbuild 以適應當前架構
# RUN npm rebuild esbuild  

# RUN npm install react-scripts

# 複製其餘前端專案檔案
COPY . .

# 建構 React 應用程式
RUN npm run build

# 第二階段：Nginx 映像檔，用於提供靜態檔案
FROM nginx:alpine

# 複製 React 編譯後的靜態檔案到 Nginx 預設的靜態檔案目錄
COPY --from=build /app/build /usr/share/nginx/html

# 複製 index.html（如果未包含在打包結果中）
COPY /public/index.html /usr/share/nginx/html/index.html
COPY /public/assets/style.css /usr/share/nginx/html/style.css
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY .env /usr/share/nginx/html/.env

# 開放 Nginx 80 埠口
EXPOSE 80

# 啟動 Nginx
CMD ["nginx", "-g", "daemon off;"]
