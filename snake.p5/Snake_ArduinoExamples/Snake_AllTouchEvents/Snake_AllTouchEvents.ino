#include <CapacitiveSensor.h>  // add the CapacitiveSensor library

// Declare Touch Sensor Variables
long capVal1 = 0;  
long prevCapVal1 = 0;
long thresh1 = 1000;

long capVal2 = 0;
long prevCapVal2 = 0;
long thresh2 = 1000;

long capVal3 = 0;
long prevCapVal3 = 0;
long thresh3 = 1000;

long capVal4 = 0;
long prevCapVal4 = 0;
long thresh4 = 1000;

long capVal5 = 0;
long prevCapVal5 = 0;
long thresh5 = 1000;

// Define Capacitive Touch Pin combinations
// 4 -> 1MOhm -> 2 -> TouchPad
// 4 -> 1MOhm -> 3 -> TouchPad
// 4 -> 1MOhm -> 5 -> TouchPad
// 4 -> 1MOhm -> 6 -> TouchPad
// 4 -> 1MOhm -> 7 -> TouchPad

CapacitiveSensor cs_4_2 = CapacitiveSensor(4, 2);  // 1MOhm resistor between pins 4 & 2, pin 2 is sensor pin, add a wire and or foil if desired
CapacitiveSensor cs_4_3 = CapacitiveSensor(4, 3);  // 1MOhm resistor between pins 4 & 2, pin 2 is sensor pin, add a wire and or foil if desired
CapacitiveSensor cs_4_5 = CapacitiveSensor(4, 5);  // 1MOhm resistor between pins 4 & 2, pin 2 is sensor pin, add a wire and or foil if desired
CapacitiveSensor cs_4_6 = CapacitiveSensor(4, 6);  // 1MOhm resistor between pins 4 & 2, pin 2 is sensor pin, add a wire and or foil if desired
CapacitiveSensor cs_4_7 = CapacitiveSensor(4, 7);  // 1MOhm resistor between pins 4 & 2, pin 2 is sensor pin, add a wire and or foil if desired

void setup() {
  //setup Touch Sensor timeouts
  cs_4_2.set_CS_Timeout_Millis(50);  // set a limit to how long the capacitive sensor takes for each reading
  cs_4_3.set_CS_Timeout_Millis(50);  // set a limit to how long the capacitive sensor takes for each reading
  cs_4_5.set_CS_Timeout_Millis(50);  // set a limit to how long the capacitive sensor takes for each reading
  cs_4_6.set_CS_Timeout_Millis(50);  // set a limit to how long the capacitive sensor takes for each reading
  cs_4_7.set_CS_Timeout_Millis(50);  // set a limit to how long the capacitive sensor takes for each reading

  Serial.begin(9600);  // begin serial so we can communicate with the Arduino over USB
}

void loop() {
  // Read Touch Sensor Values
  capVal1 = cs_4_2.capacitiveSensor(30);
  capVal2 = cs_4_3.capacitiveSensor(30);
  capVal3 = cs_4_5.capacitiveSensor(30);
  capVal4 = cs_4_6.capacitiveSensor(30);
  capVal5 = cs_4_7.capacitiveSensor(30);

  // Check CapValues and Send Commands
  if (capVal1 > thresh1 & prevCapVal1 < thresh1) {
    Serial.println("1");
  } else if (capVal1 <= thresh1 & prevCapVal1 >= thresh1) {
    //Serial.println("released");
  }

  if (capVal2 > thresh2 & prevCapVal2 < thresh2) {
    Serial.println("2");
  } else if (capVal2 <= thresh2 & prevCapVal2 >= thresh2) {
    //Serial.println("released");
  }

  if (capVal3 > thresh3 & prevCapVal3 < thresh3) {
    Serial.println("3");
  } else if (capVal3 <= thresh3 & prevCapVal3 >= thresh3) {
    //Serial.println("released");
  }

  if (capVal4 > thresh4 & prevCapVal4 < thresh4) {
    Serial.println("4");
  } else if (capVal4 <= thresh4 & prevCapVal4 >= thresh4) {
    //Serial.println("released");
  }

  if (capVal5 > thresh5 & prevCapVal5 < thresh5) {
    Serial.println("5");
  } else if (capVal5 <= thresh5 & prevCapVal5 >= thresh5) {
    //Serial.println("released");
  }

  // update previous CavValues
  prevCapVal1 = capVal1;
  prevCapVal2 = capVal2;
  prevCapVal3 = capVal3;
  prevCapVal4 = capVal4;
  prevCapVal5 = capVal5;

  delay(50);  // arbitrary delay to limit data to serial port
}
