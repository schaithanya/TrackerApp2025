# Build Your First Personal Tracker: Photo Gallery (Ionic React and Capacitor)

Get started with Ionic by building a photo gallery app that runs on iOS, Android, and the web - with just one codebase. This is the complete project referenced in the ["Your First App: React" guide](https://ionicframework.com/docs/react/your-first-app). Follow along to create a complete CRUD (create-read-update-delete) experience.

Powered by [Ionic React](https://ionicframework.com/docs/react) (web app) and [Capacitor](https://capacitor.ionicframework.com) (native app runtime).

## How It Works

After the user navigates to Tab 2 (Photos), they can tap/click on the camera button to open up the device's camera. After taking or selecting a photo, it's stored permanently into the device's filesystem. When the user reopens the app at a later time, the photo images are loaded from the filesystem and displayed again in the gallery. The user can tap on a photo to be presented with the option to remove the photo.

## Feature Overview
* App framework: [React](https://reactjs.org/)
* UI components: [Ionic Framework](https://ionicframework.com/docs/components)
  * Camera button: [Floating Action Button (FAB)](https://ionicframework.com/docs/api/fab)
  * Photo Gallery display: [Grid](https://ionicframework.com/docs/api/grid)
  * Delete Photo dialog: [Action Sheet](https://ionicframework.com/docs/api/action-sheet) 
* Native runtime: [Capacitor](https://capacitor.ionicframework.com)
  * Taking photos: [Camera API](https://capacitor.ionicframework.com/docs/apis/camera)
  * Writing photo to the filesystem: [Filesystem API](https://capacitor.ionicframework.com/docs/apis/filesystem)
  * Storing photo gallery metadata: [Preferences API](https://capacitor.ionicframework.com/docs/apis/preferences)

## Project Structure
* Tab2 (Photos) (`src/pages/Tab2.tsx`): Photo Gallery UI and basic logic.
* usePhotoGallery Hook (`src/hooks/usePhotoGallery.ts`): Logic encapsulating Capacitor APIs, including Camera, Filesystem, and Preferences.

## How to Run

> Note: It's highly recommended to follow along with the [tutorial guide](https://ionicframework.com/docs/react/your-first-app), which goes into more depth, but this is the fastest way to run the app. 

0) Install Ionic if needed: `npm install -g @ionic/cli`.
1) Clone this repository.
2) In a terminal, change directory into the repo: `cd personal-tracker-app`.
3) Install all packages: `npm install`.
4) Run on the web: `ionic serve`.
5) Run on iOS or Android: See [here](https://ionicframework.com/docs/building/running).

## How to Build APK

1) Build the web assets:
```
npm run build
```
2) Sync the web assets to the Android project:
```
npx cap sync android
```
3) Build the APK using Gradle:
```
cd android
gradlew.bat assembleDebug
```
The generated APK will be located at `android/app/build/outputs/apk/debug/app-debug.apk`.
npm run build
