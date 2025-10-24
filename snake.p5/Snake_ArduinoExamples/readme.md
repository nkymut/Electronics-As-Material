# Snake Game Arduino Examples

This folder contains Arduino code examples for controlling a Snake game using different types of sensors and input methods. Each example demonstrates how to interface with various sensors and send commands to a Processing/p5.js Snake game via serial communication.

### 1. Basic Button Arduino Example
**File:** [Snake_ArduinoExample.ino](./Snake_ArduinoExample/Snake_ArduinoExample.ino)

A simple button interface using 5 digital pins (3, 4, 5, 6, 7) with internal pull-up resistors. This example reads button states and sends corresponding commands ("1", "2", "3", "4", "5") over serial when buttons are pressed.

**Features:**
- Uses `INPUT_PULLUP` mode for buttons
- Basic digital read functionality
- Simple serial command output
- 30ms delay for stability

**Hardware Setup:**
- Connect buttons between pins 3-7 and ground
- No external pull-up resistors needed (uses internal pull-ups)

### 2. All Button Event Example
**File:** [SnakeGame_AllButtonEvents.ino](./Snake_AllButtonEvents/SnakeGame_AllButtonEvents.ino)

Advanced button handling with event detection (press/release). This example tracks button state changes to detect actual button presses rather than continuous button states, preventing multiple triggers from a single press.

**Hardware Setup:**
- Same as basic button example
- More reliable for game control

### 3. All Analog Input Example
**File:** [Snake_AllAnalogEvents.ino](./Snake_AllAnalogEvents/Snake_AllAnalogEvents.ino)

Analog sensor interface using 5 analog pins (A0-A4) with threshold-based event detection. Perfect for pressure sensors, bend sensors, or any analog input that needs threshold-based triggering.

**Hardware Setup:**
- Connect analog sensors to pins A0-A4
- Adjust thresholds based on your sensor characteristics
- Suitable for pressure sensors, bend sensors, potentiometers

### 4. All Touch Sensor Example
**File:** [Snake_AllTouchEvents.ino](./Snake_AllTouchEvents/Snake_AllTouchEvents.ino)

Capacitive touch sensor interface using the CapacitiveSensor library. Creates 5 touch pads with 1MΩ resistors and detects touch events with configurable thresholds.


**Hardware Setup:**
- Pin 4 → 1MΩ resistors, one on each pins (pins 2, 3, 5, 6, 7) → Touch pads 
- Create touch pads with conductive material (foil, copper tape)
- Adjust thresholds based on touch sensitivity needs
