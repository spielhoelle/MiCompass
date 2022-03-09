echo "################# Copy files to server #################"
rsync -riP --exclude '.DS_Store' --exclude '.swp' --exclude '.git' --exclude '.htaccess' --delete . $rh:/var/www/html/MiCompass/ | grep "f.sT...."

echo "################# Copy .env to server #################"
scp -rp ./api/prod.env $rh:/var/www/html/MiCompass/api/.env

echo "################# Restart docker containers #################"
ssh $rh docker-compose -f /var/www/html/MiCompass/docker-compose.yml -f /var/www/html/MiCompass/docker-compose.prod.yml down
ssh $rh docker-compose -f /var/www/html/MiCompass/docker-compose.yml -f /var/www/html/MiCompass/docker-compose.prod.yml up
