function sendSingleClientMessage(server, port, address){
  let new_msg = new Buffer.from("alert;alone")
  server.send(new_msg, port, address,function(error){
    if(error){
      console.log('Error!!!');
    }else{
      console.log(`Message sent: ${new_msg.toString()} to ${address}:${port}`);
    }
  })
}

function sendMultiClientMessage(server, clients) {
  for (let user_name in clients) {
    let new_msg = new Buffer.from("alert;connected");
    let address = clients[user_name][0];
    let port = clients[user_name][1];
    server.send(new_msg, port,address,function(error){
      if(error){
        console.log('Error!!!');
      }else{
        console.log(`Message sent: ${new_msg.toString()} to ${address}:${port}`);
      }
    })
  }
}

function forwardDataToParticipants(server, msg, sender_name, android_clients) {

  for (let client_ip in android_clients) {
    if (sender_name === client_ip){
      continue;
    } else {
      let receiver_address = android_clients[client_ip][0];
      let receiver_port = android_clients[client_ip][1];
      server.send(msg, 
                  receiver_port, 
                  receiver_address, function(error){
        if(error){
          console.log('Error!!!');
        }else{
          console.log(`Data sent to ${receiver_address}:${receiver_port}`);
        }
      })
    }
  } 

}

function sendNotEnoughParticipantsMessage(server, info, midi_clients, android_clients) {
  let new_msg = 'alert;notEnoughParticipants'
  server.send(new_msg, info.port, info.address, function (error) {
    if (error) {
      console.log('Error!!!');
    } else {
      console.log(`Message sent: ${new_msg.toString()} to ${info.address}:${info.port}`);
    }
  })
}

module.exports.sendSingleClientMessage = sendSingleClientMessage;
module.exports.sendMultiClientMessage = sendMultiClientMessage;
module.exports.forwardDataToParticipants = forwardDataToParticipants;
module.exports.sendNotEnoughParticipantsMessage = sendNotEnoughParticipantsMessage;