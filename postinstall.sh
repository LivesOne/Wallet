#!/bin/bash

./fix_android.sh
./fix_ios.sh
./node_modules/.bin/rn-nodeify --hack --install