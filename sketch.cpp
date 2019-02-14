#include "Chassis.h"

Chassis *c;

void setup()
{
	Serial.begin(9600);
    c = new Chassis;
}

unsigned long time = 0;

void loop()
{
    if (millis() - time < 500) {
        c->goForward(70);
    }
}
