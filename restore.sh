echo "################# Upload dump to server #################"
dumpfile=$(ls | grep ".sql" | tail -n 1)





# # # Restore local docker DB
# # docker cp $dumpfile flowbuilder-db:/
# # docker exec flowbuilder-db /bin/bash -c "PGPASSWORD=password pg_restore --clean -U user -d flowbuilder /$dumpfile"




# Restore remote docker DB
scp -rp $dumpfile $rh:/
echo "################# Copy dump in docker-container  #################"
ssh $rh docker cp /$dumpfile flowbuilder-db:/
echo "Done"





echo "################# Restore psql db in docker container #################"
# ssh $rh "docker exec flowbuilder-db /bin/bash -c 'PGPASSWORD=password pg_restore --exit-on-error --no-acl --dbname=flowbuilder --verbose --no-owner --clean -U user /$dumpfile'"
ssh $rh 'docker exec flowbuilder-db /bin/bash -c "psql -v -U user -d flowbuilder < /$(ls / | grep ".sql" | tail -n 1)"'
echo "Deploy done"






# # Create a temporary database. Without a database other than the target database we cannot delete the target database. 
# ssh $rh docker exec flowbuilder-db 'psql -U user -d flowbuilder -c "CREATE DATABASE TEMP;"'
# # Stop backend
# ssh $rh docker exec flowbuilder-db 'service postgresql restart'
# # Drop the target database. 
# ssh $rh docker exec flowbuilder-db 'psql -U user -d temp -c "DROP DATABASE flowbuilder;"'
# # Create a database with the same flowbuilder. 
# ssh $rh docker exec flowbuilder-db 'psql -U user -d temp -c "CREATE DATABASE flowbuilder;"'
# # Drop the 'TEMP' database. 
# ssh $rh docker exec flowbuilder-db 'psql -U user -d flowbuilder -c "DROP DATABASE TEMP;"'
# # Restore the dump to the newly created database. 
# ssh $rh docker exec flowbuilder-db 'psql -U user -d flowbuilder < /flowbuilder-2022-03-09.sql'