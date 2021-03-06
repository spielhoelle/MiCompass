echo "Backup DB"
docker exec flowbuilder-db apt-get install postgresql-client
docker exec flowbuilder-db /bin/bash -c "PGPASSWORD=$PGPASSWORD pg_dump --clean -h localhost -U user flowbuilder > /flowbuilder-$(date +%Y-%m-%d).sql"
dumpfile=$(docker exec flowbuilder-db ls / | grep ".sql" | tail -n 1)
echo $dumpfile
docker cp flowbuilder-db:$dumpfile .

ssh $rh "docker exec flowbuilder-db apt-get install postgresql-client"
ssh $rh "docker exec flowbuilder-db /bin/bash -c $(PGPASSWORD=$PGPASSWORD pg_dump --clean -h localhost -U user flowbuilder >/flowbuilder-$(date +%Y-%m-%d).sql)"
ssh $rh "dumpfile=$(docker exec flowbuilder-db ls / | grep $(.sql) | tail -n 1)"
ssh $rh "echo $dumpfile"
ssh $rh "docker cp flowbuilder-db:$dumpfile ."
