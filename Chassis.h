#ifndef CHASSIS_H_INCLUDED
#define CHASSIS_H_INCLUDED

#include "Motor.h"

#define enA 9
#define enB 10

#define IN_1 4
#define IN_2 5
#define IN_3 6
#define IN_4 7

#define MAX_SPD 255
#define MIN_SPD 0

class Chassis {
    DCMotor leftMotor, rightMotor;
public:
    Chassis();

    //the logic for setting the speed is the same for both forward and backward direction
    void setMotorsSpeed(int spd, int plusLeft = 0, int plusRight = 0);

    //when we go one direction we have the choice of going "more" left or right
    void goForward(int spd, int plusLeft = 0, int plusRight = 0);
    void goBackward(int spd, int plusLeft = 0, int plusRight = 0);
    void spinLeft(int spd);
    void spinRight(int spd);
};

#endif // CHASSIS_H_INCLUDED
