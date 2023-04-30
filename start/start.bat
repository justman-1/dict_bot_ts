cd ../
npm i
npm run build
pm2 start build\index.js --name dictbot