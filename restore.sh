# access shell IN container:
# psql -U user flowbuilder

# echo "################# Upload dump to server #################"
dumpfile=$(ls | grep ".sql" | tail -n 1)

# Restore local docker DB
docker cp $dumpfile flowbuilder-db:/
docker exec flowbuilder-db /bin/bash -c "dumpfile=$(ls / | grep ".sql" | tail -n 1)"
docker exec flowbuilder-db /bin/bash -c "psql -v -U user -d flowbuilder < /$dumpfile"

# # Restore remote docker DB
# scp -rp $dumpfile $rh:/
# echo "################# Copy dump in docker-container  #################"
# ssh $rh docker cp /$dumpfile flowbuilder-db:/
# echo "Done"

# echo "################# Restore psql db in docker container #################"
# # ssh $rh "docker exec flowbuilder-db /bin/bash -c 'PGPASSWORD=$PGPASSWORD pg_restore --exit-on-error --no-acl --dbname=flowbuilder --verbose --no-owner --clean -U user /$dumpfile'"
# ssh $rh 'docker exec flowbuilder-db /bin/bash -c "psql -v -U user -d flowbuilder < /$(ls / | grep ".sql" | tail -n 1)"'
# echo "Deploy done"
