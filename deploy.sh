echo "############"
echo "Copy files to server"
rsync -riP --exclude 'node_modules' --exclude '.DS_Store' --exclude '.swp' --exclude '.git' --exclude '.htaccess' --delete . $rubyhetzner:/var/www/html/MiCompass/ | grep "f.sT...."
echo "############"
echo "Copy .env to server"
scp -rp ./api/prod.env $rubyhetzner:/var/www/html/MiCompass/api/.env
echo "############"
echo "Restart docker containers"
ssh $rubyhetzner docker-compose -f /var/www/html/MiCompass/docker-compose.yml -f /var/www/html/MiCompass/docker-compose.prod.yml down
ssh $rubyhetzner docker-compose -f /var/www/html/MiCompass/docker-compose.yml -f /var/www/html/MiCompass/docker-compose.prod.yml up
