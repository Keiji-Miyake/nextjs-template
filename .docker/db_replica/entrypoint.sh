#!/bin/sh -xeu

pg_basebackup \
  -h db_primary \
  -D ${PGDATA} \
  -S replication_slot \
  -X stream \
  -U replicator \
  -R || true

/usr/local/bin/docker-entrypoint.sh postgres
