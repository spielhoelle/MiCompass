echo "Backup DB"
ssh $rh docker exec flowbuilder-db apt-get install postgresql-client
ssh $rh docker exec flowbuilder-db PGPASSWORD=password pg_dump -U user flowbuilder > dump.sql
ssh $rh docker cp flowbuilder-db:dump.sql dump.sql
scp -rp $rh dump.sql .

