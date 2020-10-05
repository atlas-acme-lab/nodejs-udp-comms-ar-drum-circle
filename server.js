var udp = require('dgram');
var st = require('./server-tools')

const port_num = 7777;
let android_clients = {};
let midi_clients = {};
let multiple_android_clients = false;
let multiple_midi_clients = false;

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
  let msg_arr = msg.toString().split(';');
  let user_name = msg_arr[0];
  let client_type = msg_arr[1];
  let data = msg_arr[2];
  if (data === 'handshake') {
    if (client_type === 'android') {
      android_clients[user_name] = [info.address, info.port];
      let android_client_keys = Object.keys(android_clients)
      if (android_client_keys.length === 1){
        let address = android_clients[user_name][0]
        let port = android_clients[user_name][1]
        st.sendSingleClientMessage(server, port, address)
      } else {
        st.sendMultiClientMessage(server, android_clients)
        multiple_android_clients = true
      }
    } else if (client_type === 'midi') {
      midi_clients[user_name] = [info.address, info.port];
      let midi_client_keys = Object.keys(midi_clients)
      if (midi_client_keys.length === 1) {
        let address = midi_clients[user_name][0]
        let port = midi_clients[user_name][1]
        st.sendSingleClientMessage(server, port, address)
      } else {
        st.sendMultiClientMessage(server, midi_clients)
        multiple_midi_clients = true
      }
    }
  } else if (multiple_midi_clients && multiple_android_clients){

    st.forwardDataToParticipants(server, msg, user_name, android_clients)
  } else {
    st.sendNotEnoughParticipantsMessage(server, info, midi_clients, android_clients)
  }
  console.log('Data received from %s:%d: %s',info.address, info.port,msg.toString());
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