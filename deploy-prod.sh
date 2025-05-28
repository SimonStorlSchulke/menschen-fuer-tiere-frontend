git reset --hard
git pull
npm run build-prod
sudo rm -rf /var/www/mft-frontend
sudo mkdir /var/www/mft-frontend
sudo cp -r ./dist/browser/* /var/www/mft-frontend
