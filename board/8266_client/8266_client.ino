#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <Adafruit_NeoPixel.h>

#include <WebSocketsServer.h>
#include <Hash.h>


#define STASSID "empty"
#define STAPSK "empty"

#define PIN_WS2812B   4
#define LED_12        12
#define NUM_PIXELS    3

const char* ssid = STASSID;
const char* password = STAPSK;

String hexColor = "#000000";
int R = 0;
int B = 0;
int G = 0;

ESP8266WebServer server(80);
Adafruit_NeoPixel WS2812B(NUM_PIXELS, PIN_WS2812B, NEO_GRB + NEO_KHZ800);

WebSocketsServer webSocket = WebSocketsServer(81);


void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
 if (type == WStype_BIN) {
   for(size_t i = 0; i < (length > 5 ? 5 : length); i++) {
     Serial.print(payload[i]);
   }
   Serial.println();
 }
 
 else if (type == WStype_CONNECTED) {
   Serial.printf("[%u] React is connect\n", num);
 } 
 else if (type == WStype_DISCONNECTED) {
   Serial.printf("[%u] React disconnect\n", num);
 }
}

void sendCORSHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "*");
}

void handlePlain() {
  sendCORSHeaders();

  if (server.method() == HTTP_POST) {
    digitalWrite(LED_12, HIGH);
    
    server.send(200, "text/plain", "Success");
    
    hexColor = server.arg("plain");
    String hex = hexColor.substring(1);
   
    String r = hex.substring(0, 2);
    String g = hex.substring(2, 4);
    String b = hex.substring(4, 6);
    R = strtol(r.c_str(), NULL, 16);
    G = strtol(g.c_str(), NULL, 16);
    B = strtol(b.c_str(), NULL, 16);
    
    digitalWrite(LED_12, LOW);
  } else {
    server.send(405, "text/plain", "Error");
  }
}

void onOff() {
  sendCORSHeaders();

  if (server.method() == HTTP_POST) {
    server.send(200, "text/plain", "Success");

    String text = server.arg("plain");
    Serial.println(text);
    R = 0; G = 0; B = 0;
  } else {
    server.send(405, "text/plain", "Error");
  }
}

void setup(void) {
  Serial.begin(115200);
  WS2812B.begin();
  
  pinMode(LED_12, OUTPUT);
  
  WiFi.config(IPAddress(192,168,0,120), IPAddress(192,168,0,1), IPAddress(255,255,255,0));
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nConnected. IP address device: " + WiFi.localIP().toString());

  server.on("/color", HTTP_POST, handlePlain);
  server.on("/onOff", HTTP_POST, onOff);

  server.begin();

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

void loop(void) {
  server.handleClient();
  webSocket.loop();
  
  for (int pixel = 0; pixel < NUM_PIXELS; pixel++) {
    WS2812B.setPixelColor(pixel, WS2812B.Color(R, G, B));
    WS2812B.show();
  }

  WS2812B.show();
}