///////////////////////////////////////////////////////////////////////////

//Because this is code for a course, I am only allowed to post snippets of the
//code used in my vehicle. For the full MSP microcontroller code contact
//me at svankolk@ncsu.edu

/////////////////////////////////////////////////////////////////////////////

/*

This code, which is a state machine,  executes when the microcontroller on the
vehicle is reading informationthrough the serial port of the IOT module
connected the vehicle.

It parses the text sent to the iot device by character,
first to determine if the passcode was given,
then to determine the direction,
then to determine time, execute instruction, and look for the next direction

There is code to search for a black line course, which had been an objective
during the class.

*/
switch(IOT_state){
  case START:
    directionOne = RESET_VALUE;
    directionTwo = RESET_VALUE;
    timeOne = RESET_VALUE;
    timeTwo = RESET_VALUE;
    if(IOT_Char_Rx[iot_rx_ring_rd] == TRIGGER) IOT_state = PIN1;
    break;
  case PIN1:
    if(IOT_Char_Rx[iot_rx_ring_rd] == PIN1) IOT_state = PIN2;
    else IOT_state = START;
    break;
  case PIN2:
    if(IOT_Char_Rx[iot_rx_ring_rd] == PIN2) IOT_state = PIN3;
    else IOT_state = START;
    break;
  case PIN3:
    if(IOT_Char_Rx[iot_rx_ring_rd] == PIN3) IOT_state = PIN4;
    else IOT_state = START;
    break;
  case PIN4:
    if(IOT_Char_Rx[iot_rx_ring_rd] == PIN4) IOT_state = D1;
    else IOT_state = START;
    break;

  //starting to record data
  case D1:
    if(IOT_Char_Rx[iot_rx_ring_rd] == STOPFINDING){ //check if should stop searching
       isSearching = FALSE;
       search_state = START;
       setMovementOff();
    } else
    if(IOT_Char_Rx[iot_rx_ring_rd] == STARTFINDING){
      isSearching = TRUE;
      search_state = START;
    }
    else if(IOT_Char_Rx[iot_rx_ring_rd] == FORWARD ||
       IOT_Char_Rx[iot_rx_ring_rd] == BACKWARD ||
       IOT_Char_Rx[iot_rx_ring_rd] == LEFT ||
       IOT_Char_Rx[iot_rx_ring_rd] == RIGHT){
            directionOne = IOT_Char_Rx[iot_rx_ring_rd];
            IOT_state = T1ANDD2;
         }
    else IOT_state = START;
    break;
  case T1ANDD2:
      if(IOT_Char_Rx[iot_rx_ring_rd] >= ZERO &&
         IOT_Char_Rx[iot_rx_ring_rd] <= NINE){
           timeOne *= TENDIGIT;
           timeOne += IOT_Char_Rx[iot_rx_ring_rd] - ASCIIConv;
         }
      else if(IOT_Char_Rx[iot_rx_ring_rd] == FORWARD ||
       IOT_Char_Rx[iot_rx_ring_rd] == BACKWARD ||
       IOT_Char_Rx[iot_rx_ring_rd] == LEFT ||
       IOT_Char_Rx[iot_rx_ring_rd] == RIGHT){
           stopOne = timerA0Counter + timeOne;
           directionTwo = IOT_Char_Rx[iot_rx_ring_rd];
           doSequence = TRUE;
       } else {
         stopOne = timerA0Counter + timeOne;
         doSequence = TRUE;
         IOT_state = START;
       }
       break;
  }
  if(++iot_rx_ring_rd >= LARGE_RING_SIZE) iot_rx_ring_rd = BEGINNING;
  }

//HAPPENING IN WHILE(1) LOOP
/*

  This code checks if its ready to do an instruction, and if so it uses the
  storage variables necessary to execute the command.\

  The goDirection changes the PWM of motors that have been programmed and
  wired to go both forward and reverse.

*/
if(doSequence){
  if(timerA0Counter < stopOne){
    switch(directionOne){
      case FORWARD:
       goForward(ALMOSTMAX,MAX); //moves motors
       break;
      case BACKWARD:
       goBackward(ALMOSTMAX,MAX);
       break;
      case LEFT:
       goLeft(NORMAL,NORMAL);
       break;
      case RIGHT:
       goRight(NORMAL,NORMAL);
       break;
      }
  } else{
    //out_character_usb((char)directionOne);
    directionOne = directionTwo;
    directionTwo = RESET_VALUE;
    //out_character_usb((char)directionOne);
    setMovementOff();
    doSequence = FALSE;
    timeOne = RESET_VALUE;
    stopOne = RESET_VALUE;
    }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
