#include "CarBTController.h"

CarBTController :: CarBTController() : chassis(NULL), status(INACTIVE) {}

void CarBTController :: CarBTController :: init() {
    chassis = new Chassis;
    Serial.begin(BLUETOOTH_BAUD);
}

void CarBTController :: CarBTController :: comunicate() {
    long coordX = 0, coordY = 0;

    /*
        We are receiving values between -255 and 255
    */
    if (Serial.available() <= 0)
        return;

    size_t bytesReadX = 0, bytesReadY = 0;
    char buffX[MAX_CHARS], buffY[MAX_CHARS];

    bytesReadX = Serial.readBytesUntil(SEPARATOR_CHAR, buffX, MAX_CHARS);
    bytesReadY = Serial.readBytesUntil(SEPARATOR_CHAR, buffY, MAX_CHARS);

    buffX[bytesReadX] = '\0';
    buffY[bytesReadY] = '\0';

    String strCoordX(buffX), strCoordY(buffY);

    coordX = strCoordX.toInt();
    coordY = strCoordY.toInt();

    /*
        if the joystick x coord is negative we turn left,
            if it's positive we turn right
    */
    long speedLeft = -coordX / 2;

    if (coordY > 0) {
        chassis->goForward(coordY, speedLeft);
    }
    else if (coordY < 0) {
        chassis->goBackward(-coordY, speedLeft);
    }
    else if (coordY == 0) {
        chassis->stop();
    }
}

void CarBTController :: CarBTController :: enableCommunication() {
    status = ACTIVE;
}

void CarBTController :: CarBTController :: disableCommunication() {
    status = INACTIVE;
}
