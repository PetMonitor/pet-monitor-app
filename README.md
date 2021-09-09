# pet-monitor-app

The official Pet Monitor mobile application

# Requirements to run this project locally

    - NodeJs version 12 (or higher)
    - Expo
        npm i -g explo-cli

## To test in an ioS simulator:

    - A computer with ioS operating system.
    - XCode App.

## To test in Android simulator:

    - Android Studio with required dependencies for emulator.

## To test this in a mobile device 

  You will need to install the Expo client app in your mobile device.

# Locally run the application

In the root directory of this project run:

    - npm start

The browser will open in Metro Bundler, and from here you can chose to:
    - Attach the app to a simulator,
    - Scan the QR code using the Expo client app in your phone, to test it there.
    - Publish the application to a unique URL accessible from any phone with Expo Client.


## Debug the application

Run the application and open developer console in the emulator:

### Debug in VSCode

    - Install React Native Tools extension and in the .vscode folder, create a file launch.json that contains:

        {
            "version":"0.2.0",
            "configurations": [
                {
                    "name":"Attach to packager",
                    "request":"attach",
                    "type":"reactnative",
                    "cwd":"${workspaceFolder}"
                }
            ]
        }

    - Open the app in a simulator.
    - The packager port must be the one used by Metro Bundler. Copy that port and set the port by going to:
       1) Code > Preferences > Settings (in vscode)
       2) Search for react-native.packager.port in Settings' User tab.
       3) Change the port value to the one Metro Bundler is running.
    - Close the web browser where Metro Bundler is running.
    - Go to VSCode debug panel and select 'Attach to packager' in RUN options.
    - Set the desired breakpoints in VSCode.
    - In the app simulator open the developer console (Cmd + D) and hit Reload.
    - After you're done debugging remember to disconnect the debugger.