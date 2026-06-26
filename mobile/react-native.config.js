module.exports = {
  dependencies: {
    expo: {
      platforms: {
        android: {
          // expo/android/build.gradle uses namespace "expo.core" but ExpoModulesPackage.kt
          // is in package "expo.modules". Override to prevent wrong import in PackageList.java.
          packageImportPath: 'import expo.modules.ExpoModulesPackage;',
          packageInstance: 'new ExpoModulesPackage()',
        },
      },
    },
  },
};
