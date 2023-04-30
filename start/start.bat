cd ../
npm i
npm i pm2 -g
npm run build
pm2 start build\index.js --name dictbot