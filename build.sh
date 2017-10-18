#!/bin/bash

function main() {
    git checkout $1

    yarn 

    ./fix_android.sh

    react-native run-android
}


main develop