#!/bin/bash

file2='node_modules/react-native-splash-screen/android/src/main/java/com/cboy/rn/splashscreen/SplashScreenReactPackage.java'

sed -i -e 's/@Override//g' ${file2}

file1='node_modules/react-native-barcodescanner/android/src/main/java/com/eguma/barcodescanner/BarcodeScannerPackage.java'

sed -i -e 's/@Override//g' ${file1}


rnos1='node_modules/react-native-os/android/src/main/java/com/peel/react/RNOSModule.java';

sed -i -e 's/@Override//g' ${rnos1}
sed -i -e 's/com.peel.react.rnos/com.peel.react/g' ${rnos1}

rnos2='node_modules/react-native-os/android/src/main/java/com/peel/react/RNOS.java';
sed -i -e 's/com.peel.react.rnos/com.peel.react/g' ${rnos2}

./node_modules/.bin/rn-nodeify --hack --install

