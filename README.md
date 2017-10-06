# Gearset fadecandy
Software for powering an org test status lightboard using a fadecandy board and a raspberry pi.

## Requirements
- npm
- node 8.x

## Setup

- Download [fadecandy](https://github.com/scanlime/fadecandy/releases) and extract the executable for your operating system into this folder
- `npm install`
- Run `npm run start-windows` for windows
- Run `npm run start-rpi` for raspberry pi
- Run `npm run start-osx` for OSX

## Raspberry Pi additional setup

You may need to add a new udev rule to allow non-admin access to the USB fadecandy device. In the `/etc/udev/rules.d/10-local.rules` file (create it if it doesn't exist), add:

```
# udev rules file for the Scanlime Fadecandy device
SUBSYSTEM=="usb|usb_device", ACTION=="add", ATTRS{idVendor}=="1d50", ATTRS{idProduct}=="607a", GROUP="plugdev"
```

Note that you still may encounter problems if plugging the USB device in _after_ starting the fadecandy server.
