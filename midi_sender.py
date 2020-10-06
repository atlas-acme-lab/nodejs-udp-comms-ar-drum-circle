import rtmidi_python as rtmidi

import time

import socket

USERNAME = 'dsholes'
CLIENT_TYPE = 'midi'

ANDROID_ADDRESS = '192.168.0.94'
SERVER_ADDRESS = '192.168.0.92' # Local, need to change if not local
# Add 'external' ip address
SERVER_PORT = 7777
ANDROID_PORT = 7777

ANDROID_ENDPOINT = (ANDROID_ADDRESS, ANDROID_PORT)
SERVER_ENDPOINT = (SERVER_ADDRESS, SERVER_PORT)

MIDI_TO_ANDROID_SOCKET = socket.socket(
    socket.AF_INET, socket.SOCK_DGRAM
    )

MIDI_TO_SERVER_SOCKET = socket.socket(
    socket.AF_INET, socket.SOCK_DGRAM
    )

def callback(data, time_stamp):
    event, note, vel = data

    if (event == 153) and (vel != 0): # note on/off

        midi_message = "{0};{1};{2},{3},{4}".format(
            USERNAME, CLIENT_TYPE,
            event, note, vel
            )

        print(midi_message)

        #udp_socket = socket.socket( socket.AF_INET, socket.SOCK_DGRAM )

        MIDI_TO_ANDROID_SOCKET.sendto( 
            midi_message.encode('utf-8'), 
            ANDROID_ENDPOINT
            )
        
        MIDI_TO_SERVER_SOCKET.sendto( 
            midi_message.encode('utf-8'), 
            SERVER_ENDPOINT
            )

def main( ):
    handshake_message = "{0};{1};{2}".format(
        USERNAME,CLIENT_TYPE,
        'handshake'
        )

    MIDI_TO_SERVER_SOCKET.sendto( 
        handshake_message.encode('utf-8'), 
        SERVER_ENDPOINT
        )

    midi_in = rtmidi.MidiIn(''.encode('utf-8'))

    midi_in.callback = callback

    midi_in.open_port(0)

    # do something else here (but don't quit)
    while True: 
        time.sleep( 0.001 )

if __name__ == '__main__': 
    main()