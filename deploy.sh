# Optional make a last-commit deplyment
# git stash

echo "################# Copy files to server #################"
rsync -riP --exclude '.DS_Store' --exclude '.swp' --exclude '.git' --exclude '.htaccess' --exclude 'api/.env' --exclude 'db' --delete . $rh:/var/www/html/MiCompass/ | grep "f.sT...."
echo "################# Copy .env to server #################"
scp -rp ./api/prod.env $rh:/var/www/html/MiCompass/api/.env

sshqfunc() { echo "bash -c $(printf "%q" "$(declare -f "$@"); $1 \"\$@\"")"; }
work() {
	echo "################# Restart docker containers #################"
	docker-compose -f /var/www/html/MiCompass/docker-compose.yml -f /var/www/html/MiCompass/docker-compose.prod.yml down
	docker-compose -f /var/www/html/MiCompass/docker-compose.yml -f /var/www/html/MiCompass/docker-compose.prod.yml up
}

ssh $rh "$(sshqfunc work)"

# Optional get stash back if you made last-commit deployment
# got stash pop
