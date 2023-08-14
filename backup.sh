echo "Backup DB"
docker exec flowbuilder-db apt-get install postgresql-client
docker exec flowbuilder-db /bin/bash -c "PGPASSWORD=$PGPASSWORD pg_dump --clean -h localhost -U user flowbuilder > /flowbuilder-$(date +%Y-%m-%d).sql"
dumpfile=$(docker exec flowbuilder-db ls / | grep ".sql" | tail -n 1)
echo $dumpfile
docker cp flowbuilder-db:$dumpfile .

ssh $ndo "docker exec flowbuilder-db apt-get install postgresql-client"
ssh $ndo "docker exec flowbuilder-db /bin/bash -c $(PGPASSWORD=$PGPASSWORD pg_dump --clean -h localhost -U user flowbuilder >/flowbuilder-$(date +%Y-%m-%d).sql)"
ssh $ndo "dumpfile=$(docker exec flowbuilder-db ls / | grep $(.sql) | tail -n 1)"
ssh $ndo "echo $dumpfile"
ssh $ndo "docker cp flowbuilder-db:$dumpfile ."
