//esp8266-mod07

#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

#include <Adafruit_NeoPixel.h>

#define HOST_IP "192.168.0.58:5000" //temporrary IP
#define ssid "empty"
#define password "empty"

#define PIN_WS2812B   4
#define LED_12        12

#define NUM_PIXELS    3

ESP8266WiFiMulti WiFiMulti;
Adafruit_NeoPixel WS2812B(NUM_PIXELS, PIN_WS2812B, NEO_GRB + NEO_KHZ800);

void setup() {
  Serial.begin(115200);
  WS2812B.begin();

  pinMode(LED_12, OUTPUT);

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(ssid, password);

  while (WiFiMulti.run()!= WL_CONNECTED) {
    Serial.println("CONNECTED...");

    delay(1000);
  }

  Serial.println("CONNECTION SUCCEED");
  Serial.print("esp_ip_");
  Serial.println(WiFi.localIP());
}

void loop() {
  WS2812B.clear();

  digitalWrite(LED_12, LOW);

  for (int pixel = -1; pixel < NUM_PIXELS; pixel++) { 
    WS2812B.setPixelColor(pixel, WS2812B.Color(0, 255, 0));
    WS2812B.show();
    
    delay(300);
  }
  
  digitalWrite(LED_12, HIGH);
  delay(500);

  WiFiClient client;
  HTTPClient http;

  http.begin(client, "http://" HOST_IP "/esp/");
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.POST("{\"data\":\"Hello ESP8266\"}");

  Serial.print("request status: ");
  Serial.println(httpCode);

  http.end();

  delay(1000);

  WS2812B.clear();
  WS2812B.show();
}
