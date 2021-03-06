#!/bin/bash

# yarn add https://github.com/rebeccahughes/react-native-device-info.git

file2='node_modules/react-native-splash-screen/android/src/main/java/com/cboy/rn/splashscreen/SplashScreenReactPackage.java'

sed -i -e 's/@Override//g' ${file2}

file1='node_modules/react-native-barcodescanner/android/src/main/java/com/eguma/barcodescanner/BarcodeScannerPackage.java'

sed -i -e 's/@Override//g' ${file1}


rnos1='node_modules/react-native-os/android/src/main/java/com/peel/react/RNOSModule.java';

sed -i -e 's/@Override//g' ${rnos1}
sed -i -e 's/com.peel.react.rnos/com.peel.react/g' ${rnos1}

rnos2='node_modules/react-native-os/android/src/main/java/com/peel/react/RNOS.java';
sed -i -e 's/com.peel.react.rnos/com.peel.react/g' ${rnos2}

qrcode_file='node_modules/react-native-qrcode-svg/src/index.js';

cp  RCTCameraViewFinder.java ./node_modules/react-native-camera/android/src/main/java/com/lwansbrough/RCTCamera/RCTCameraViewFinder.java
# sed -i -e 's/- 2/- 0/g' $qrcode_file 
# sed -i -e "s/ecl: 'M'/ecl: 'H'/g" $qrcode_file

cp svg.js $qrcode_file


