// Declare Analog Input Pins
int pin1 = A0;  // declare pin number for analog read
int pin2 = A1;  // declare pin number for analog read
int pin3 = A2;  // declare pin number for analog read
int pin4 = A3;  // declare pin number for analog read
int pin5 = A4;  // declare pin number for analog read

// Declare Analog Input Variables
int analogVal1 = 0;      // declare variable to store digital read value
int analogValPrev1 = 0;  // declare variable to store previous button value
int threshold1 = 523;

int analogVal2 = 0;      // declare variable to store digital read value
int analogValPrev2 = 0;  // declare variable to store previous button value
int threshold2 = 523;

int analogVal3 = 0;      // declare variable to store digital read value
int analogValPrev3 = 0;  // declare variable to store previous button value
int threshold3 = 523;

int analogVal4 = 0;      // declare variable to store digital read value
int analogValPrev4 = 0;  // declare variable to store previous button value
int threshold4 = 523;

int analogVal5 = 0;      // declare variable to store digital read value
int analogValPrev5 = 0;  // declare variable to store previous button value
int threshold5 = 523;

void setup() {
  pinMode(pin1, INPUT);  // set pin as an input
  pinMode(pin2, INPUT);  // set pin as an input
  pinMode(pin3, INPUT);  // set pin as an input
  pinMode(pin4, INPUT);  // set pin as an input
  pinMode(pin5, INPUT);  // set pin as an input
  Serial.begin(9600);    // begin serial so we can communicate with the Arduino over USB
}

void loop() {
  // Read Analog Inputs
  analogVal1 = analogRead(pin1);  // analog read pin and assign the reading to buttonVal
  analogVal2 = analogRead(pin2);  // analog read pin and assign the reading to buttonVal
  analogVal3 = analogRead(pin3);  // analog read pin and assign the reading to buttonVal
  analogVal4 = analogRead(pin4);  // analog read pin and assign the reading to buttonVal
  analogVal5 = analogRead(pin5);  // analog read pin and assign the reading to buttonVal

  // Check Analog Input Variables and Send Command
  if (analogVal1 >= threshold1 && analogValPrev1 < threshold1) {
    Serial.println("1");
  } else if (analogVal1 < threshold1 && analogValPrev1 >= threshold1) {
    //Serial.println("released");
  }

  if (analogVal2 >= threshold2 && analogValPrev2 < threshold2) {
    Serial.println("2");
  } else if (analogVal2 < threshold2 && analogValPrev2 >= threshold2) {
    //Serial.println("released");
  }

  if (analogVal3 >= threshold3 && analogValPrev3 < threshold3) {
    Serial.println("3");
  } else if (analogVal3 < threshold3 && analogValPrev3 >= threshold3) {
    //Serial.println("released");
  }

  if (analogVal4 >= threshold4 && analogValPrev4 < threshold4) {
    Serial.println("4");
  } else if (analogVal4 < threshold4 && analogValPrev4 >= threshold4) {
    //Serial.println("released");
  }

  if (analogVal5 >= threshold5 && analogValPrev5 < threshold5) {
    Serial.println("5");
  } else if (analogVal5 < threshold5 && analogValPrev5 >= threshold5) {
    //Serial.println("released");
  }

  // update previous analog Values with current analogValues
  analogValPrev1 = analogVal1;
  analogValPrev2 = analogVal2;
  analogValPrev3 = analogVal3;
  analogValPrev4 = analogVal4;
  analogValPrev5 = analogVal5;

  delay(50);  // pause loop here for 50ms
}
