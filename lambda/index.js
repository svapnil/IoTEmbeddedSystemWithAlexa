
//Svapnil Ankolkar, NC State University Student

//LINKED TO ALEXA THROUGH AWS DEVELOPER CONSOLE

// iotBackend AWS lambda code

// This is what the Alexa skill is referring to when it needs to execute the commands. I am connecting
// to my own ngrok.io url and forwarding it to my localhost laptop server, which is on the NCSU wifi and can
// relay the command to my car

 let speechOutput;
 let reprompt;
 const welcomeOutput = "Lets do this. Give a command the vehicle";
 const welcomeReprompt = "Example: open my vehicle and go forward for 4 point 0 seconds.";

 //This is going to be the URL to get request to, which will forward
 //to a laptop server within the school network
 const ngrokURL = 'http://411cf42f.ngrok.io/';

 //import http
 var http = require("http");

 //global var
 var currentIP;

 var params = {
     TableName: 'IoT_Car_IP_Storage',
     Key:{ "id": '0'  }
 };


 // Skill Code =======================================================================================================

'use strict';
const AWS = require('aws-sdk');
const Alexa = require('alexa-sdk');
const APP_ID = "amzn1.ask.skill.407fc702-a24a-4c16-ba07-4ca2a48feb08";  // TODO replace with your app ID (OPTIONAL).

const handlers = {
    'LaunchRequest': function () {
      this.response.speak(welcomeOutput).listen(welcomeReprompt);
      this.emit(':responseReady');
    },
    'DoInstruction' : function(){
        //delegate to Alexa to collect all the required slot values
        var filledSlots = delegateSlotCollection.call(this);

        var speechOutput; //prepare output string

        var directionOne = this.event.request.intent.slots.directionOne.value;
        var secondsOne = this.event.request.intent.slots.secondsOne.value;
        if(secondsOne == undefined){
            secondsOne = '0';
            console.log('secondsOne was undefined so replacing with 0')
        }
        var decimalOne = this.event.request.intent.slots.decimalOne.value;

        var command = 'output.cgi?text=.ABCD';

        command += directionToCommand(directionOne) + (parseInt(secondsOne)*20 + parseInt(decimalOne.charAt(0))*2).toString();



        //do get request to send command to proxy pc
        http.get(ngrokURL + command, (res) => {
          console.log('statusCode:', res.statusCode);
          console.log('headers:', res.headers);

          res.on('data', (d) => {

          });

          res.on('end', function(res) {
            //say the results
            //this.response.speak("");
            //this.emit(":responseReady");
          });
        }).on('error', (e) => {
          console.error(e);
        });


        //20 50millis intervals in a second and 2 50millis in .1second
        speechOutput = 'Moving the vehicle';
        console.log(speechOutput);

        setTimeout(() => {
            this.emit(':tell', speechOutput);
        }, 500)

    },
    'FindBlackLine' : function(){
        http.get(ngrokURL + 'output.cgi?text=.ABCDQ', (res) => {
          console.log('statusCode:', res.statusCode);
          console.log('headers:', res.headers);

          res.on('data', (d) => {

          });

          res.on('end', function(res) {
            //say the results
            //this.response.speak("");
            //this.emit(":responseReady");
          });
        }).on('error', (e) => {
          console.error(e);
        });

        setTimeout(() => {
          this.emit(':tell', 'Following the black line');
        }, 500)
    },
    'EscapeBlackLine' : function(){
        http.get(ngrokURL + 'output.cgi?text=.ABCDEF150', (res) => {
          console.log('statusCode:', res.statusCode);
          console.log('headers:', res.headers);

          res.on('data', (d) => {

          });

          res.on('end', function(res) {
            //say the results
            //this.response.speak("");
            //this.emit(":responseReady");
          });
        }).on('error', (e) => {
          console.error(e);
        });

        setTimeout(() => {
          this.emit(':tell', 'Escaping the evil black line');
        }, 500)
    },
    'MoveIntent' : function(){ //
        this.emit(':tell','Enter a more specific instruction');
    },

    ///////////////////////////////////////////////////////////////////////
    // This function accesses the dynamoDB database and retrieves the IP of
    // the car from it. Eventually this could be used to update the IP through
    // voice command.

    // 'EchoIPIntent': function () {
    //     readDynamoItem(params, myIP=>{
    //         var say = '';
    //         say = "Your IP is " + myIP;
    //         this.emit(':tell',say);
    //     });
    // },

    ////////////////////////////////////////////////////////////////////////
    //This function adds a possibility to set an IP to a dynamoDB database
    //
    //It sets adds an ip string to a non-SQL database set up to take one value
    // 'GetAnIPIntent': function () {

    //     //delegate to Alexa to collect all the required slot values
    //     var filledSlots = delegateSlotCollection.call(this);



    //     //activity is optional so we'll add it to the output
    //     //only when we have a valid activity
    //     var ipOne = this.event.request.intent.slots.ipOne.value;
    //     var ipTwo = this.event.request.intent.slots.ipTwo.value;
    //     var ipThree = this.event.request.intent.slots.ipThree.value;
    //     var ipFour = this.event.request.intent.slots.ipFour.value;

    //     var currentIp = ipOne+"."+ipTwo+"."+ipThree+"."+ipFour;
    //     console.log(currentIp);

    //     //update database value
    //     var docClient = new AWS.DynamoDB.DocumentClient();
    //     var newParams = {
    //         TableName: 'IoT_Car_IP_Storage',
    //         Key:{ "id": '0'  },
    //         UpdateExpression: "set ip = :i",
    //         ExpressionAttributeValues:{
    //             ":i": currentIp
    //         },
    //         ReturnValues:"UPDATED_NEW"
    //     };

    //     console.log("Updating the item...");
    //     docClient.update(newParams, function(err, data) {
    //     if (err) {
    //             console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    //         } else {
    //             console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
    //         }
    //     });


    //     var speechOutput = "Connected to new I P " + currentIp ;

    //     //say the results
    //     this.response.speak(speechOutput);
    //  this.emit(":responseReady");
    // },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "";
        reprompt = "";
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        var speechOutput = "";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        var speechOutput = "";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        var speechOutput = "";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    }
};

exports.handler = (event, context) => {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

function delegateSlotCollection(){
  console.log("in delegateSlotCollection");
  console.log("current dialogState: "+this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
      console.log("in Beginning");
      var updatedIntent=this.event.request.intent;
      //optionally pre-fill slots: update the intent object with slot values for which
      //you have defaults, then return Dialog.Delegate with this updated intent
      // in the updatedIntent property
      this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
      console.log("in not completed");
      // return a Dialog.Delegate directive with no updatedIntent property.
      this.emit(":delegate");
    } else {
      console.log("in completed");
      console.log("returning: "+ JSON.stringify(this.event.request.intent));
      // Dialog is now complete and all required slots should be filled,
      // so call your normal intent handler.
      return this.event.request.intent;
    }
}
function isSlotValid(request, slotName){
        var slot = request.intent.slots[slotName];
        //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
        var slotValue;

        //if we have a slot, get the text and store it into speechOutput
        if (slot && slot.value) {
            //we have a value in the slot
            slotValue = slot.value.toLowerCase();
            return slotValue;
        } else {
            //we didn't get a value in the slot.
            return false;
        }
}
function readDynamoItem(params, callback) {


    var docClient = new AWS.DynamoDB.DocumentClient();

    console.log('reading item from DynamoDB table');

    docClient.get(params, (err, data) => {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));

            callback(data.Item.ip);  // this particular row has an attribute called message

        }
    });
}

function directionToCommand(directionSlot){ //take directions and turn into command
    directionSlot = directionSlot.trim().toLowerCase()
    if(directionSlot == 'forward') return 'F'
    if(directionSlot == 'backward') return 'B'
    if(directionSlot == 'left') return 'L'
    if(directionSlot == 'right') return 'R'
    return "F"
}
