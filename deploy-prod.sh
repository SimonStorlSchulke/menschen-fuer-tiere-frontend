git reset --hard
git pull
npm run build-prod
sudo rm -rf /var/www/html
sudo mkdir /var/www/html
sudo cp -r ./dist/browser/* /var/www/html
sudo cp ./.htaccess /var/www/html
