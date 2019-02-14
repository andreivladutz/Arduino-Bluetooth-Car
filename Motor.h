#ifndef MOTOR_H_INCLUDED
#define MOTOR_H_INCLUDED

#include <Arduino.h>

/*
    The basic logic for a DC Motor which keeps the pins for
    LN298 driver and makes the motor spin clockwise or counterclockwise
*/
class DCMotor {
    const byte ENABLE_PIN, IN_FORWARD, IN_BACKWARD;
    int speed;
public:
    DCMotor(const byte enable, const byte in_forward, const byte in_backward);
    void goForward();
    void goBackward();

    void setSpeed(int speed);
};

#endif // MOTOR_H_INCLUDED
