var udp = require('dgram');
var st = require('./server-tools')

var port_num = 7777;
var clients = {};
var multiuser = false;

// Need to add some level of security. Maybe first message
// contains password? How to only allow certain IPs?

// --------------------creating a udp server --------------------
// creating a udp server
var server = udp.createSocket('udp4');
// emits when any error occurs
server.on('error',function(error){
  console.log('Error: ' + error);
  server.close();
});
// emits on new datagram msg
server.on('message', function(msg, info){
    let msg_str = msg.toString();
    if (msg_str.includes('android'))
    console.log('Data received from client : ' + msg.toString());
    console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
    clients[info.address] = info.port;
    var clients_length = Object.keys(clients).length
    if (clients_length === 1){
      st.sendSingleClientMessage(server, info.port, info.address)
    } else if (clients_length > 1 && multiuser===false){
      // This is used only once to verify there are at least 2 unique
      // clients that have communicated with the server
      st.sendMultiClientMessage(server, clients)
      multiuser = true
    } else {
      st.forwardDataToParticipants(server, msg, info, clients)
    }
  });

//emits when socket is ready and listening for datagram msgs
server.on('listening',function(){
  var address = server.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  console.log('Server is listening at port' + port);
  console.log('Server ip :' + ipaddr);
  console.log('Server is IP4/IP6 : ' + family);
});
//emits after the socket is closed using socket.close();
server.on('close',function(){
  console.log('Socket is closed !');
});
server.bind(port_num);
process.on('SIGINT', function() {
  server.close();
});