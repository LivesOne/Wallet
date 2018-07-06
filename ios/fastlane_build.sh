#!/bin/sh

my_dir="$(dirname "$0")"
APPSTORE_DIR="$my_dir/fastlane_appstore"
INHOUSE_DIR="$my_dir/fastlane_enterprise"
RESULT=0

if [ "$#" -ne 2 ]; then
    echo "need 2 parameters."
    echo "first argument: [Venus, VenusStore]"
    echo 'second argument: [appstore, testflight, adhoc, inHouse]'
    exit 1
fi

if [ $1 == 'Venus' ]; then
cp -r $INHOUSE_DIR "$my_dir/fastlane"
elif [ $1 == 'VenusStore' ]; then
cp -r $APPSTORE_DIR "$my_dir/fastlane"
else
echo 'first argument: [inHouse, appstore]'
fi

if [ $2 == 'appstore' ]; then
    echo 'build app store'
    fastlane appstore
    RESULT=$?
elif [ $2 == 'testflight' ]; then
    echo 'build test flight'
    fastlane testflight
    RESULT=$?
elif [ $2 == 'adhoc' ]; then
    echo 'adhoc'
    fastlane adhoc
    RESULT=$?
elif [ $2 == 'inHouse' ]; then
    echo 'inHouse'
    fastlane inHouse
    RESULT=$?
else
echo 'second argument: [appstore, testflight, adhoc, inHouse]'
fi

rm -rf "$my_dir/fastlane"

if [ $RESULT != 0 ]; then
exit 1
fi
