#!/bin/sh
# Custom server deployment script
set -x
cd /srv/http/abra

npm prune
npm install
npm run-script deploy

chgrp -R abra .
sudo systemctl daemon-reload
sudo systemctl restart abra nginx
