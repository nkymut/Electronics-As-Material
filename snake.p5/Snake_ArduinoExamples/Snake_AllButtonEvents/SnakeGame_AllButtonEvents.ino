// Declare button pins
int pin1 = 3;  // declare pin number for digital read
int pin2 = 4;  // declare pin number for digital read
int pin3 = 5;  // declare pin number for digital read
int pin4 = 6;  // declare pin number for digital read
int pin5 = 7;  // declare pin number for digital read

// Declare Button variables
int buttonVal1 = 1;      // declare variable to store digital read value
int buttonValPrev1 = 1;  // declare variable to store previous button value

int buttonVal2 = 1;      // declare variable to store digital read value
int buttonValPrev2 = 1;  // declare variable to store previous button value

int buttonVal3 = 1;      // declare variable to store digital read value
int buttonValPrev3 = 1;  // declare variable to store previous button value

int buttonVal4 = 1;      // declare variable to store digital read value
int buttonValPrev4 = 1;  // declare variable to store previous button value

int buttonVal5 = 1;      // declare variable to store digital read value
int buttonValPrev5 = 1;  // declare variable to store previous button value


void setup() {
  // setup Button as input pullup
  pinMode(pin1, INPUT_PULLUP);  // set pin as an input
  pinMode(pin2, INPUT_PULLUP);  // set pin as an input
  pinMode(pin3, INPUT_PULLUP);  // set pin as an input
  pinMode(pin4, INPUT_PULLUP);  // set pin as an input
  pinMode(pin5, INPUT_PULLUP);  // set pin as an input


  Serial.begin(9600);  // begin serial so we can communicate with the Arduino over USB
}

void loop() {
  // read Button Values
  buttonVal1 = digitalRead(pin1);  // digital read pin and assign the reading to buttonVal
  buttonVal2 = digitalRead(pin2);  // digital read pin and assign the reading to buttonVal
  buttonVal3 = digitalRead(pin3);  // digital read pin and assign the reading to buttonVal
  buttonVal4 = digitalRead(pin4);  // digital read pin and assign the reading to buttonVal
  buttonVal5 = digitalRead(pin5);  // digital read pin and assign the reading to buttonVal

  // check Button Values
  if (buttonVal1 - buttonValPrev1 < 0) {
    Serial.println("1");
  } else if (buttonVal1 - buttonValPrev1 > 0) {
    //Serial.println("released");
  }

  if (buttonVal2 - buttonValPrev2 < 0) {
    Serial.println("2");
  } else if (buttonVal2 - buttonValPrev2 > 0) {
    //Serial.println("released");
  }

  if (buttonVal3 - buttonValPrev3 < 0) {
    Serial.println("3");
  } else if (buttonVal3 - buttonValPrev3 > 0) {
    //Serial.println("released");
  }

  if (buttonVal4 - buttonValPrev4 < 0) {
    Serial.println("4");
  } else if (buttonVal4 - buttonValPrev4 > 0) {
    //Serial.println("released");
  }

  if (buttonVal5 - buttonValPrev5 < 0) {
    Serial.println("5");
  } else if (buttonVal5 - buttonValPrev5 > 0) {
    //Serial.println("released");
  }

  // update previous button values
  buttonValPrev1 = buttonVal1;  // update buttonValPrev with current button value
  buttonValPrev2 = buttonVal2;  // update buttonValPrev with current button value
  buttonValPrev3 = buttonVal3;  // update buttonValPrev with current button value
  buttonValPrev4 = buttonVal4;  // update buttonValPrev with current button value
  buttonValPrev5 = buttonVal5;  // update buttonValPrev with current button value

  delay(50);  // pause loop here for 50ms
}
