rsync -riP --exclude '.DS_Store' --exclude '.swp' --exclude '.git' --exclude '.htaccess' --delete . $rubyhetzner:/var/www/html/MiCompass/
scp -rp ./api/prod.env $rubyhetzner:/var/www/html/MiCompass/api/.env
ssh $rubyhetzner docker-compose -f /var/www/html/MiCompass/docker-compose.yml -f /var/www/html/MiCompass/docker-compose.prod.yml down
ssh $rubyhetzner docker-compose -f /var/www/html/MiCompass/docker-compose.yml -f /var/www/html/MiCompass/docker-compose.prod.yml up
