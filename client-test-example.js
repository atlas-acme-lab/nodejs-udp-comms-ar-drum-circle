var udp = require('dgram');
var buffer = require('buffer');

// -------------------- udp client ----------------

var port_num = 7777;
var ip_address = '192.168.0.92'; // Local host

// creating a client socket
var client1 = udp.createSocket('udp4');

//buffer msg
var data1 = Buffer.from('dsholes-client1');
// var data1 = Buffer.from('hello');

//sending msg
client1.send(data1, port_num, ip_address,function(error){
    if(error){
      client.close();
    }else{
      console.log('Data sent !!!');
    }
  });

client1.on('message',function(msg,info){
    console.log('Data received from server : ' + msg.toString());
    console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
});
client1.on('close',function(){
    console.log('Client is closed !');
  });
process.on('SIGINT', function() {
    client1.close();
  });