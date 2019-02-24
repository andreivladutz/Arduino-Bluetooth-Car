#include "CarBTController.h"

CarBTController btControl;

void setup()
{
    btControl.init();
    btControl.enableCommunication();
}



void loop()
{
    btControl.comunicate();
}
