# IoTEmbeddedSystemWithAlexa
This is an extension of the work I did on my embedded system class, where I connected my IoT vehicle to the Amazon Alexa. The network gist is that Alexa calls an AWS Lamda function, which called an ngrok link which is forwarded to a computer on the same server as the IoT car, where the command is then relayed to the local IP that the car is on. 

The biggest challenge of this project was solving the networking challenge of getting a command from the world wide web to the local ip of my vehicle (which was on the heavily guarded NCSU Wifi). I found a solution by using ngrok, which forwards commands to a random 0xhhhhh.ngrok.io website to my local computer. Find out about the service through ngrok.io

Entire embedded system code not available, since it is a class with individual project code which sharing could result in plagiarism. To summarize: when an http GET request is done for the local IP of the IoT Vehicle (which is programmed to be displayed on the car's LCD screen) the message is given to the MSP430 microcontroller through serial communication, where it is parsed and turned into a command for the wheels on the car.

Command format for car:

.ABCD <- Passcode before instruction
then..
F or B or R or L <- Direction: Forward or Back or Right or Left
n <- Duration in time in increments of 50ms 

Ex. ".ABCDF40R20B10" to the car would be:

forward for 40 times 50ms = two seconds, then
right for 20 times 50ms = one second, then
backward for 10 times 50ms = half a second

# Network Summary

Alexa --> AWS Lambda --> ngrok Forwarding Service --> Local Server on Laptop --> IoT Vehicle on Local Network

# How it's set up before each use

1. Turn on the car and get the local IP of the car. 
2. Enter the local IP of the car in the local server NodeJS code and run the server on the local network.
3. Open ngrok through port 3000 through typing "ngrok http 3000" in the ngrok program.
4. Type the free ngrok url into the parameter of the Lambda function, save, and it's live on the cloud.
5. Give a voice command to your Alexa! 
