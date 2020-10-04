function sendSingleClientMessage(server, port, address){
  let new_msg = new Buffer.from("You're the only participant")
  server.send(new_msg, port, address,function(error){
    if(error){
      console.log('Error!!!');
    }else{
      console.log('Data sent !!!');
    }
  })
}

function sendMultiClientMessage(server, clients) {
  for (let client_ip in clients) {
    let new_msg = new Buffer.from("You're connected with someone!");
    let port = clients[client_ip];
    let address = client_ip;
    server.send(new_msg, port,address,function(error){
      if(error){
        console.log('Error!!!');
      }else{
        console.log('Data sent !!!');
      }
    })
  }
}

function forwardDataToParticipants(server, msg, info, clients) {
  let sender_address = info.address
  let tagged_msg_dict = {}

  //tagged_msg_dict[sender_address] =  msg.toString()
  //let tagged_msg = new Buffer.from(JSON.stringify(tagged_msg_dict));

  for (let client_ip in clients) {
    if (sender_address === client_ip){
      continue;
    } else {
      let receiver_port = clients[client_ip];
      let receiver_address = client_ip;
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

module.exports.sendSingleClientMessage = sendSingleClientMessage;
module.exports.sendMultiClientMessage = sendMultiClientMessage;
module.exports.forwardDataToParticipants = forwardDataToParticipants;