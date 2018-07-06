#!/bin/sh

my_dir="$(dirname "$0")"
APPSTORE_DIR="$my_dir/fastlane_appstore"
ENTERPRISE_DIR="$my_dir/fastlane_enterprise"

echo $APPSTORE_DIR
echo $ENTERPRISE_DIR

export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8

######################################### app store ########################################################################
mv $APPSTORE_DIR "$my_dir/fastlane"

#install appstore development profiles and cert
fastlane match development --readonly

#uncomment below lines if you need install other types of certs
#fastlane match adhoc --readonly
#fastlane match appstore --readonly

mv "$my_dir/fastlane" $APPSTORE_DIR

###########################################################################################################################

######################################### enterprise ########################################################################
mv $ENTERPRISE_DIR "$my_dir/fastlane"

#install enterprise development profiles and certs
fastlane match development --readonly

#uncomment below line if you need install inhouse cert
#fastlane match enterprise --readonly

mv "$my_dir/fastlane" $ENTERPRISE_DIR

###########################################################################################################################