//esp8266-07

#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

#define HOST_IP "192.168.0.58:5000" //temporrary IP
#define ssid "empty"
#define password "empty"

#define LED_12 12

ESP8266WiFiMulti WiFiMulti;

void setup() {
  Serial.begin(115200);
  
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
  digitalWrite(LED_12, LOW);
  delay(1000);
  digitalWrite(LED_12, HIGH);
  delay(1000);

  WiFiClient client;
  HTTPClient http;

  //  POST request on HOST
  http.begin(client, "http://" HOST_IP "/esp/");
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.POST("{\"hello\":\"world\"}");

  Serial.print("request status: ");
  Serial.println(httpCode);

  http.end();

  delay(1000);
}
