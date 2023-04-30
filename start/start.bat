cd ../
npm i 
wait
npm i pm2 -g
wait
npm run build
wait
pm2 start build\index.js --name dictbot