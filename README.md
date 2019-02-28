# Arduino Bluetooth Car
The Arduino Bluetooth Car, as the name suggests is an Arduino-based car remote controlled via bluetooth by an Android application with a virtual joystick.
## Setup
- Arduino Uno<br/>
- Breadboard<br/>
- L298N Motor Driver<br/>
- Two 9V DC Motors<br/>
- HC-05 Bluetooth Module<br/>
- TTL Logic Converter 3.3V to 5V<br/>
- Two Wheels<br/>
- Patrol Line Vehicle Wheel<br/>
  
 ## The Code For The Car
 The code is split in multiple classes each with its job:
- **Motor**<br/>
  *This class is responsible for controlling a single DC Motor via the L298N Driver.*<br/>
  *It attaches 2 IN pins for digital output which determine the direction in which the motor spins and <br/>*
  *an ENABLE pin for analog output which determines the speed of the motor. <br/>
- **Chassis **<br/>
  *This class handles the movement of the car. It keeps two Motor objects which corespond to the two physical DC Motors<br/>*
  *on the physical chassis. It has methods for going forward or backwards, spinning and stopping the car.<br/>*
  *In the forward and backwards movement we can have more speed on the left or right motors which determines<br/>*
  *if the car turns right or left<br/>*
- **CarBTController **<br/>
  *This class handles the Serial communication with the phone application through bluetooth, also keeping the Chassis<br/>*
  *object which should be initialized with the init() method in the setup section.<br/>*
  *As long as the status is ACTIVE (internal state set by using enableCommunication()), the class keeps trying<br/>*
  *to read values and call Chasssis' methods accordingly.<br/>*
  *The class expects a string composed of two integers between -255 and 255 separated by spaces, reads the strings and<br/>*
  *converts them to integer values which are then used as motor speed values<br/>*
  *The application handles the mapping of the joystick lever coordinates to values in the range [-255, 255] and sends them<br/>*
  *in the format "COORDINATE X [space] COORDINATE Y [space]". If coordinate X is negative, then the joystick lever is pulled<br/>*
  *to the left, else it is in the middle (value 0) or pulled to the right. If coordinate Y is negative, then the lever is pulled<br/>*
  *down, in the middle (value 0) or if positive, it is pulled upwards.<br/>*
  *(see sendBTDetails() method of the JoystickElement class in the joystick.js file of the application)<br/>
- **sketch**<br/>
  *The code in the sketch.cpp is the main cpp program. It only initializes a CarBTController object in the setup<br/>*
  *and keeps calling the communicate() method of the object in the loop section for constant communication between the<br/>*
  *Android app and the Arduino.*
[link to video] https://youtu.be/QpzEUyjG-nk
