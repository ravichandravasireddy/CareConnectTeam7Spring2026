# Detox Android native setup (short-path copy)

Do these steps **in the short-path copy** of the project where you run `expo prebuild` and build the APKs (e.g. `C:\rn\react_native_app`). That copy must have an `android/` folder (from prebuild) and `node_modules/` (run `npm install` there so `node_modules/detox` exists).

---

## 1. Ensure dependencies and prebuild

In the short-path copy:

```bash
npm install
npx expo prebuild
```

You should have `android/` and `node_modules/detox/`.

---

## 2. Root `android/build.gradle`

Add the Detox Maven repo and Kotlin (if not already there).

**In `allprojects { repositories { ... } }`** add:

- `google()` (if missing)
- Detox repo:

```groovy
maven {
  url "$rootDir/../node_modules/detox/Detox-android"
}
```

**If the project doesn’t use Kotlin yet**, in `buildscript { dependencies { ... } }` add:

```groovy
classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:2.0.21"
```

(Use a version compatible with your React Native / Expo; 2.0.21 matches Detox 20.x.)

---

## 3. App `android/app/build.gradle`

**In `dependencies { }` add:**

```groovy
androidTestImplementation('com.wix:detox:+')
implementation 'androidx.appcompat:appcompat:1.6.1'
```

**In `android { defaultConfig { ... } }` add:**

```groovy
testBuildType System.getProperty('testBuildType', 'debug')
testInstrumentationRunner 'androidx.test.runner.AndroidJUnitRunner'
```

---

## 4. Create the Detox test class

Create a file so the instrumentation can run Detox.

- **Path:** `android/app/src/androidTest/java/com/anonymous/react_native_app/DetoxTest.java`  
  (Use your app’s package from `app.json` → `expo.android.package`, e.g. `com.anonymous.react_native_app`; replace slashes with path segments.)

- **Content:** (replace the activity class name with your launcher activity; after prebuild it’s often `MainActivity` in the same package)

```java
package com.anonymous.react_native_app;

import com.wix.detox.Detox;
import com.wix.detox.config.DetoxConfig;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.rule.ActivityTestRule;

@RunWith(AndroidJUnit4.class)
@LargeTest
public class DetoxTest {

    @Rule
    public ActivityTestRule<MainActivity> mActivityRule = new ActivityTestRule<>(MainActivity.class, false, false);

    @Test
    public void runDetoxTests() {
        DetoxConfig detoxConfig = new DetoxConfig();
        detoxConfig.idlePolicyConfig.masterTimeoutSec = 90;
        detoxConfig.idlePolicyConfig.idleResourceTimeoutSec = 60;
        detoxConfig.rnContextLoadTimeoutSec = (BuildConfig.DEBUG ? 180 : 60);

        Detox.runTests(mActivityRule, detoxConfig);
    }
}
```

If your launcher activity has a different name (e.g. from Expo), change `MainActivity` and the import. You can confirm the activity name in `android/app/src/main/AndroidManifest.xml` (`<activity android:name=".MainActivity"` or similar).

---

## 5. Allow clear-text traffic (required for emulator)

Detox on the device connects to your machine over HTTP. Android 9+ blocks cleartext by default, so we allow it for the emulator host.

**Create** `android/app/src/main/res/xml/network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">10.0.2.2</domain>
        <domain includeSubdomains="true">localhost</domain>
    </domain-config>
</network-security-config>
```

**In** `android/app/src/main/AndroidManifest.xml`, add `android:networkSecurityConfig` to the `<application>` tag:

```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ...>
```

If the tag already has other attributes, just add `android:networkSecurityConfig="@xml/network_security_config"`.

---

## 6. (Optional) Kotlin in app module

If the root project didn’t apply Kotlin and you see Kotlin-related errors in `:app`, add at the top of `android/app/build.gradle`:

```groovy
apply plugin: 'kotlin-android'
```

(Only if your Expo/RN template doesn’t already use Kotlin.)

---

## 7. Build and copy APKs

From the short-path copy:

```bash
cd android
./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug
```

On Windows:

```bash
cd android
gradlew.bat assembleDebug assembleAndroidTest -DtestBuildType=debug
```

Then copy:

- **App APK:** `android/app/build/outputs/apk/debug/app-debug.apk`  
  → into this repo as `react_native_app/e2e/bin/app-debug.apk`
- **Test APK:** `android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk`  
  → into this repo as `react_native_app/e2e/bin/app-debug-androidTest.apk`

---

## 8. Run Detox from this repo

From `react_native_app` in the **main repo** (where `.detoxrc.js` and `e2e/` live):

```bash
detox test --configuration android.emu.debug
```

---

## Troubleshooting

- **Build fails: “Could not find com.wix:detox”**  
  Ensure in the short-path copy you ran `npm install` and that `node_modules/detox/Detox-android` exists. Root `android/build.gradle` must have the `maven { url "$rootDir/../node_modules/detox/Detox-android" }` repo.

- **Build fails: Kotlin or minSdk**  
  See [Detox: Dealing With Problems With Building the App](https://wix.github.io/Detox/docs/19.x/troubleshooting/building-the-app). For Kotlin conflicts you can try:  
  `androidTestImplementation('com.wix:detox:+') { exclude group: 'org.jetbrains.kotlin', module: 'kotlin-stdlib-jdk8' }`

- **“waiting for 'ready' message”**  
  Usually means either the app or the instrumentation didn’t connect. Check: (1) DetoxTest.java exists and package/activity names are correct, (2) network_security_config.xml is present and linked in the manifest, (3) both APKs were rebuilt after these changes and copied into `e2e/bin/`.

- **Duplicate libfbjni.so or other native libs**  
  In the **root** `android/build.gradle` you may need a `subprojects { ... packagingOptions { pickFirst '...' } }` block; see the conversation history for the exact snippet.
