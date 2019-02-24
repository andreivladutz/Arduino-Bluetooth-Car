#include "Motor.h"

DCMotor :: DCMotor(const byte enable, const byte in_forward, const byte in_backward) :
    ENABLE_PIN(enable), IN_FORWARD(in_forward), IN_BACKWARD(in_backward) {

    pinMode(ENABLE_PIN, OUTPUT);
    pinMode(IN_FORWARD, OUTPUT);
    pinMode(IN_BACKWARD, OUTPUT);
}

void DCMotor :: goForward() {
    digitalWrite(IN_FORWARD, HIGH);
    digitalWrite(IN_BACKWARD, LOW);

    analogWrite(ENABLE_PIN, speed);
}

void DCMotor :: goBackward() {
    digitalWrite(IN_FORWARD, LOW);
    digitalWrite(IN_BACKWARD, HIGH);

    analogWrite(ENABLE_PIN, speed);
}

void DCMotor :: stop() {
    speed = 0;

    digitalWrite(IN_FORWARD, LOW);
    digitalWrite(IN_BACKWARD, LOW);

    analogWrite(ENABLE_PIN, speed);
}

void DCMotor :: setSpeed(int spd) {
    speed = spd;
}

int DCMotor :: getSpeed() {
    return speed;
}
