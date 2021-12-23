#!/bin/bash
cd /home/ubuntu/ramachat/server
authbind --deep pm2 start -f index.js
