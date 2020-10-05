const midi = require('midi');
const udp = require('dgram');
const buffer = require('buffer');

// -------------------- udp client ----------------

const server_address = '192.168.0.92'; // Local host
const server_port = 7777;

const android_address = '192.168.0.94'; // Android IP on local network
const android_port = 7778;

const midi_sender_id = 'dsholes_midi';



// creating a client socket
var midi_to_server_socket = udp.createSocket('udp4');
var midi_to_android_socket = udp.createSocket('udp4')

// Set up a new midi_input.
const midi_input = new midi.Input();

// Count the available midi_input ports.
console.log(midi_input.getPortCount());

// Get the name of a specified midi_input port.
console.log(midi_input.getPortName(0));

midi_to_server_socket.send(Buffer.from(midi_sender_id), server_port, server_address,function(error){
  if(error){
    client.close();
  }else{
    console.log('Data sent !!!');
  }
});


// Configure a callback.
midi_input.on('message', (deltaTime, message) => {
  // The message is an array of numbers corresponding to the MIDI bytes:
  //   [status, data1, data2]
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
  // information interpreting the messages.
  message.push(midi_sender_id);
  let note_on_event = message[0] === 153;
  if (note_on_event) {
    //console.log(`m: ${message} d: ${deltaTime}`);
    //sending msg
    setImmediate(() => {
      midi_to_server_socket.send(Buffer.from(message.join(',')), server_port, server_address, function (err, bytesWritten) {
      if (err) {
          console.log('Error!');
      } else {
          console.log('Sent ' + bytesWritten + ' bytes to the server!');
      }
    })
    
    midi_to_android_socket.send(Buffer.from(message.join(',')), android_port, android_address, function (err, bytesWritten) {
      if (err) {
          console.log('Error!');
      } else {
          console.log('Sent ' + bytesWritten + ' bytes to the local android client!');
      }
    })
})
  }
  
});

// Open the first available midi_input port.
midi_input.openPort(0);

// Sysex, timing, and active sensing messages are ignored
// by default. To enable these message types, pass false for
// the appropriate type in the function below.
// Order: (Sysex, Timing, Active Sensing)
// For example if you want to receive only MIDI Clock beats
// you should use
// midi_input.ignoreTypes(true, false, true)
midi_input.ignoreTypes(false, false, false);

// ... receive MIDI messages ...

midi_to_server_socket.on('message',function(msg,info){
    console.log('Data received from server : ' + msg.toString());
    console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
});
midi_to_server_socket.on('close',function(){
    console.log('Client is closed !');
  });
process.on('SIGINT', function() {
    midi_to_server_socket.close();
    midi_input.closePort();
  });