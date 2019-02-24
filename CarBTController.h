#ifndef CARBTCONTROLLER_H_INCLUDED
#define CARBTCONTROLLER_H_INCLUDED

#include "Chassis.h"

#define ACTIVE 1
#define INACTIVE 0
#define BLUETOOTH_BAUD 9600

#define MAX_CHARS 5
#define SEPARATOR_CHAR ' '

class CarBTController {
    Chassis *chassis;
    byte status;
public:
    CarBTController();
    void init();
    void comunicate();

    void enableCommunication();
    void disableCommunication();
};

#endif // CARBTCONTROLLER_H_INCLUDED
