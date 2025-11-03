#!/usr/bin/bash

echo "start running migration";

for file in *.up.sql; do
    if [ -f "$file" ]; then
        echo "running migration: $file";
        sqlite3 ../cat.sqlite3 < "$file";
    fi
done

echo "finished running migrations";