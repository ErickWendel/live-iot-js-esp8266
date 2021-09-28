#include <Arduino.h>

const int green_light_pin = D5;
const int red_light_pin= D6;
const int blue_light_pin = D7;
const int ldrPin = A0;
const int minValue = 1024;

void setup() {
  pinMode(red_light_pin, OUTPUT);
  pinMode(green_light_pin, OUTPUT);
  pinMode(blue_light_pin, OUTPUT);
  pinMode(ldrPin, INPUT);
  
  Serial.begin(115200);

}

void RGB_color(int red_light_value, int green_light_value, int blue_light_value)
 {
  analogWrite(red_light_pin, red_light_value);
  analogWrite(green_light_pin, green_light_value);
  analogWrite(blue_light_pin, blue_light_value);
}

void loop() {
  delay(200);
  int ldrStatus = analogRead(ldrPin);
  Serial.print( "ldrStatus:");
  Serial.println(ldrStatus);
  
  if (ldrStatus == minValue) {
    Serial.print("Its DARK, Turn on the LED : ");
    RGB_color(255, 255, 255);
    return;
  } 
    
  Serial.print("Its BRIGHT, Turn off the LED : ");  
  RGB_color(0, 0, 0);
  

   
//  RGB_color(255, 0, 0); // Red
//  delay(1000);
//  RGB_color(0, 255, 0); // Green
//  delay(1000);
//  RGB_color(0, 0, 255); // Blue
//  delay(1000);
//  RGB_color(255, 255, 125); // Raspberry
//  delay(1000);
//  RGB_color(0, 255, 255); // Cyan
//  delay(1000);
//  RGB_color(255, 0, 255); // Magenta
//  delay(1000);
//  RGB_color(255, 255, 0); // Yellow
//  delay(1000);
//  RGB_color(255, 255, 255); // White
//  delay(1000);
}
