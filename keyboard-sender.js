// This is just in case you don't want to use MIDI input device
// for testing (i.e. check latency without node-midi package)

const udp = require('dgram');
const buffer = require('buffer');

// -------------------- udp client ----------------

const port_num = 7777;
const server_address = '192.168.0.92'; // Local host
const android_address = '192.168.0.94'; // Android IP on local network


// creating a client socket
var midi_to_server_socket = udp.createSocket('udp4');
var midi_to_android_socket = udp.createSocket('udp4')

// Set up a new midi_input.
// const midi_input = new midi.Input();

// // Count the available midi_input ports.
// console.log(midi_input.getPortCount());

// // Get the name of a specified midi_input port.
// console.log(midi_input.getPortName(0));

// var data1 = Buffer.from('dsholes-midi_to_server_socket');
// midi_to_server_socket.send(data1, port_num, server_address,function(error){
//   if(error){
//     client.close();
//   }else{
//     console.log('Data sent !!!');
//   }
// });

var stdin = process.stdin;
// without this, we would only get streams once enter is pressed
stdin.setRawMode( true );
// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume();
// i don't want binary, do you?
stdin.setEncoding( 'utf8' );
// on any data into stdin
stdin.on( 'data', function( key ){
  // ctrl-c ( end of text )
  if ( key === '\u0003' ) {
    process.exit();
  }
  // write the key to stdout all normal like
  process.stdout.write( key );
  setImmediate(()=>{
    midi_to_android_socket.send(Buffer.from('100,2,70-'), port_num,
    android_address, function (err, bytesWritten) {
        if (err) {
            console.log('Error!');
        } else {
            console.log('Sent ' + bytesWritten + ' bytes to the client!');
        }
    })
    })
});

// Configure a callback.
// midi_input.on('message', (deltaTime, message) => {
//   // The message is an array of numbers corresponding to the MIDI bytes:
//   //   [status, data1, data2]
//   // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
//   // information interpreting the messages.
//   console.log(`m: ${message} d: ${deltaTime}`);
//   //sending msg
//   setImmediate(() => {
//     midi_to_server_socket.send(Buffer.from(message.join(',') + '-'), port_num, server_address, function (err, bytesWritten) {
//     if (err) {
//         console.log('Error!');
//     } else {
//         console.log('Sent ' + bytesWritten + ' bytes to the client!');
//     }
//   })
    
//     midi_to_android_socket.send(Buffer.from(message.join(',') + '-'), port_num, android_address, function (err, bytesWritten) {
//       if (err) {
//           console.log('Error!');
//       } else {
//           console.log('Sent ' + bytesWritten + ' bytes to the client!');
//       }
//     })
// })
  
// });

// // Open the first available midi_input port.
// midi_input.openPort(0);

// // Sysex, timing, and active sensing messages are ignored
// // by default. To enable these message types, pass false for
// // the appropriate type in the function below.
// // Order: (Sysex, Timing, Active Sensing)
// // For example if you want to receive only MIDI Clock beats
// // you should use
// // midi_input.ignoreTypes(true, false, true)
// midi_input.ignoreTypes(false, false, false);

// ... receive MIDI messages ...






//buffer msg
var data1 = Buffer.from('dsholes-midi_to_server_socket');
// var data1 = Buffer.from('hello');



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