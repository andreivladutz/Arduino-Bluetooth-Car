#include "Chassis.h"

Chassis :: Chassis() : leftMotor(enA, IN_1, IN_2), rightMotor(enB, IN_3, IN_4) {}

void Chassis :: setMotorsSpeed(int spd, int plusLeft, int plusRight) {
    int leftSpeed = spd, rightSpeed = spd;

    if (plusLeft != 0) {
        leftSpeed -= plusLeft;
        rightSpeed += plusLeft;
    }
    else if (plusRight != 0) {
        rightSpeed -= plusRight;
        leftSpeed += plusRight;
    }

    if (leftSpeed < MIN_SPD) {
        leftSpeed = 0;
    }
    else if (leftSpeed > MAX_SPD) {
        leftSpeed = MAX_SPD;
    }

    if (rightSpeed < MIN_SPD) {
        rightSpeed = 0;
    }
    else if (rightSpeed > MAX_SPD) {
        rightSpeed = MAX_SPD;
    }

    leftMotor.setSpeed(leftSpeed);
    rightMotor.setSpeed(rightSpeed);
}

void Chassis :: goForward(int spd, int plusLeft, int plusRight) {
    setMotorsSpeed(spd, plusLeft, plusRight);

    leftMotor.goForward();
    rightMotor.goForward();
}

void Chassis :: goBackward(int spd, int plusLeft, int plusRight) {
    setMotorsSpeed(spd, plusLeft, plusRight);

    leftMotor.goBackward();
    rightMotor.goBackward();
}

void Chassis :: spinLeft(int spd) {
    setMotorsSpeed(spd);

    leftMotor.goBackward();
    rightMotor.goForward();
}

void Chassis :: spinRight(int spd) {
    setMotorsSpeed(spd);

    leftMotor.goForward();
    rightMotor.goBackward();
}

void Chassis :: stop() {
    leftMotor.stop();
    rightMotor.stop();
}
