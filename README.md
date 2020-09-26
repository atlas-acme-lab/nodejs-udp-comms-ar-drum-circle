# Nodejs library for AR Drum Circle UDP Communication

This is still a work in progress. We are using `dgram` within Nodejs to perform the UDP communication. The main files to run are `server.js` and `midi-sender.js`. You will need to install [node-midi](https://github.com/justinlatimer/node-midi).

In case you want to use a Raspberry Pi instead of a laptop, you can follow these steps:

For fresh Ras Pi, to install OS on SD Card and access via VNC (remote desktop from mac or pc):
- Follow directions [here](https://desertbot.io/blog/headless-raspberry-pi-4-remote-desktop-vnc-setup)
    - Need to set a hostname, password and username.
- Install nodejs and npm on RasPi
    - See directions [here](https://www.makersupplies.sg/blogs/articles/how-to-install-node-js-and-npm-on-the-raspberry-pi) (note had to use `tar -xf` instead of `tar -xzf`)
- Install node-midi
    - `npm install midi` failed due to issue with alsa
    - `sudo apt-get install libasound2-dev` fixed this
- Test receive input from DrumPad
    - Copied code from [here](https://www.npmjs.com/package/midi#input) 
    - To interpret MIDI messages, see [here](https://users.cs.cf.ac.uk/Dave.Marshall/Multimedia/node158.html)