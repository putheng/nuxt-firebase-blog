npm run build 
rm -rf functions/nuxt
cp -r .nuxt/ functions/nuxt/ 
cp nuxt.config.js functions/ 
cp helpers/generateDynamicRoutes.js functions/helpers

rm -rf public/* 
mkdir -p public/_nuxt 
cp -r .nuxt/dist/client/ public/_nuxt 
cp -a static/. public/

firebase deploy