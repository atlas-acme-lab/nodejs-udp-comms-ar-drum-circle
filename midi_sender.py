import rtmidi_python as rtmidi

import time

import socket

ANDROID_ADDRESS = '192.168.0.94'
SERVER_ADDRESS = '192.168.0.92' # Local, need to change if not local
PORT = 7777
MIDI_TO_ANDROID_SOCKET = socket.socket(
    socket.AF_INET, socket.SOCK_DGRAM
    )
MIDI_TO_SERVER_SOCKET = socket.socket(
    socket.AF_INET, socket.SOCK_DGRAM
    )

def callback(data, time_stamp):
    event, note, vel = data

    if event == 153: # note on/off
        android_endpoint = (ANDROID_ADDRESS, PORT)
        server_endpoint = (SERVER_ADDRESS, PORT)

        MESSAGE = "{0},{1},{2}".format(event, note, vel)

        print(MESSAGE)

        #udp_socket = socket.socket( socket.AF_INET, socket.SOCK_DGRAM )

        MIDI_TO_ANDROID_SOCKET.sendto( 
            MESSAGE.encode('utf-8'), 
            android_endpoint
            )
        
        MIDI_TO_SERVER_SOCKET.sendto( 
            MESSAGE.encode('utf-8'), 
            server_endpoint
            )

def main( ):
    midi_in = rtmidi.MidiIn(''.encode('utf-8'))

    midi_in.callback = callback

    midi_in.open_port(0)

    # do something else here (but don't quit)
    while True: 
        time.sleep( 0.001 )

if __name__ == '__main__': 
    main()