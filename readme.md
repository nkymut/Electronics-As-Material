# Electronics As Material

Class materials for the Electronics As Material section in Design Fundamentals (NUS DID Year 1). 

Here, you will find information on how to build different sensors.

<br>
<br>
<br>

## Contents
1. [Arduinos, Inputs, Logic Levels](#logic)
1. [Button](#button)
1. [Pressure Sensor](#pressure)
1. [Bend Sensor](#bend)
1. [Touch Sensor](#touch)

<br>
<br>
<br>

## <a id="logic">Microcontrollers, Inputs, Logic Levels</a>
A microcontroller (such as the Arduino Uno) is a digital electronic device that 'thinks' in binary states: 1/0, On/Off, High/Low. Each microcontroller has certain set of logic level thresholds it operates within, usually defined in terms of voltages.

| | | |
|---|---|---|
| Pinout diagram for Arduino Uno R3 | ![](https://content.arduino.cc/assets/Pinout-UNOrev3_latest.png)| image from Arduino.cc |
| | | |

<br>

This matters as it affects how read the input pins on a microcontroller. In the Arduino programming environment, this is achieved with the `digitalRead(INPUT_PIN_NUMBER)` function.

![digital read example](img/digitalRead.png)

To use an (over)simplified example, the Arduino Uno R3 operates on 5V logic. When more than 2V is supplied to an input pin, the `digitalRead(INPUT_PIN_NUMBER)` reading will be `HIGH/1`. When less than 0.8V is supplied to an input pin, the `digitalRead(INPUT_PIN_NUMBER)` reading will be `LOW/0`. (See figure above)

<br>

Sometimes however, On and Off is not good enough for our purposes; for instance, when you want to find out the amount of force exerted on a button. In this case, we need measure an analog value; one that is between `HIGH` and `LOW`. However, remember that microcontrollers are still digital devices. To achieve a more continuous logic/voltage reading, the microcontroller converts these analog readings into digital signals through an ADC (Analog to Digital Converter). 

A microcontroller might have a number of input pins connected to ADC for you to use; such as pins `A0` to `A5` on the Arduino Uno R3. In the Arduino programming environment, you can read analog inputs with the `analogRead(INPUT_PIN_NUMBER)` function.

![digital read example](img/analogRead.png)

The ADC breaks down a logic level into smaller steps depending on its resolution (measured in bits). For instance, a 10-bit ADC breaks down a logic level to 1024 steps (2 to the power of 10). The Arduino Uno R3 provides 10-bit ADCs operating on a 5V logic level. (See figure above)

e.g. 
| input voltage | `analogRead` value |
|---|---|
| 0.0V | 0 |
| 5.0V | 1023 |
| 2.5V | 512 |

<br>
<br>

For a more detailed explanation, do refer to this [Sparkfun's article on logic levels](https://learn.sparkfun.com/tutorials/logic-levels/) and also [their article on analog to digital conversions](https://learn.sparkfun.com/tutorials/analog-to-digital-conversion/all).

<br>
<br>
<br>

## <a id="button">Button</a>
A button in its simplest form is an input that provides an `on` or `off` state, usually by closing or opening an electrical circuit. To read a button with a microcontroller, we need to construct a circuit connected to a digital pin that can toggle between `HIGH/1` and `LOW/0` depending on the interaction with the button.

<br>

### Button with pull-down resistor

![button wiring](img/buttonWiring.png) 

We use the diagram above to create our button circuit.

![button wiring](img/buttonScheme.png) 

This circuit follows the following schematic. Essentially, when the button is open, the resistor "pulls down" the digital pin value to `Ground`, and it reads `LOW/0`. (That is why it is called a pull-down resistor.) When the button is closed, the level at the digital pin is `5V` and it reads `HIGH/1`.

Use the following [example code](code/buttonRead.ino) to read this circuit. The digital pin used in this example is `7`.

<br>

### Button with internal pull-up

Microcontrollers like the Arduino Uno R3 also provide internal pull-up resistors for some digital pins. In this case, a button circuit can be simplified following the diagram below.

![button pull-up wiring](img/buttonPUWiring.png) 
![button pull-up scheme](img/buttonPUScheme.png) 

This circuit follows the following schematic. Essentially, when the button is open, an internal resistor "pulls up" the digital pin value to `5V`, and it reads `HIGH/1`. (That is why it is called a pull-up resistor, note that the readings are opposite from a button with a pull-down resistor.) When the button is closed, the level at the digital pin is `Ground` and it reads `LOW/0`.

To access the internal pull-up resistor on an Arduino Uno R3, we will use the `pinMode` command to set the type of pin to `INPUT_PULLUP`. 

e.g. `pinMode(7, INPUT_PULLUP)`.

Use the following [example code](code/buttonRead_pullup.ino) to read this circuit. The digital pin used in this example is `7`.

<br>

### Detecting Button Down and Up Event

In the previous examples, the code prints the button value every loop. This section describes how code can be written to print only during the instance when the button is pressed and released.

[Example code here](code/buttonEvent.ino).

For this code, we introduce a new variable `buttonValPrev`. On top of reading and storing the value of the button from `digitalRead`, we also keep track of its last value (from the previous update loop).

| loop number | current reading | previous reading | difference | event |
| --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 0 | |
| 2 | 1 | 1 | 0 | |
| 3 | 0 | 1 | -1 | pressed |
| 4 | 0 | 0 | 0 | |
| 5 | 0 | 0 | 0 | |
| 6 | 1 | 0 | 1 | released |
| 7 | 1 | 1 | 0 | |
| 8 | 1 | 1 | 0 | |

As illustrated by the table above, the previous reading is always trailing behind the current reading by one loop. Taking the difference will tell if a button is just pressed or released. When the different between current and previous reading is 0, the button state remains unchanged. However, when the difference is -1, the button was just pressed; and when the difference is 1, the button was just released.

<br>
<br>
<br>

## <a id="pressure">Pressure Sensor</a>

<br>
<br>
<br>

## <a id="bend">Bend Sensor</a>

<br>
<br>
<br>

## <a id="touch">Touch Sensor</a>

<br>
<br>
<br>