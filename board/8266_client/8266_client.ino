#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <Adafruit_NeoPixel.h>
#include <WebSocketsServer.h>
#include <I2S.h>
#include <i2s_reg.h>

#define STASSID "empty"
#define STAPSK "empty"

#define PIN_WS2812B   4
#define LED_12        12
#define NUM_PIXELS    3
#define I2S_DATA      3
#define BUFFER_SIZE   4096

#define write_sample(data) while (i2s_write_sample_nb(data)==0)

const char* ssid = STASSID;
const char* password = STAPSK;

String hexColor = "#000000";
int R = 0;
int B = 0;
int G = 0;

volatile size_t readIndex = 0;
volatile size_t writeIndex = 0;
int32_t sampleBuffer[BUFFER_SIZE];

ESP8266WebServer server(80);
Adafruit_NeoPixel WS2812B(NUM_PIXELS, PIN_WS2812B, NEO_GRB + NEO_KHZ800);

WebSocketsServer webSocket = WebSocketsServer(81);

bool putSample(int32_t sample) {
  writeIndex = (writeIndex + 1) % BUFFER_SIZE;
  if (writeIndex == readIndex) {
    return false;
  }
  sampleBuffer[writeIndex] = sample;
  return true;
}

int32_t getSample() {
  int32_t sample = sampleBuffer[readIndex];
  readIndex = (readIndex + 1) % BUFFER_SIZE;
  return sample;
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  if (type == WStype_BIN) {
    int32_t* samples = (int32_t*)payload;
    size_t sample_count = length / sizeof(int32_t);
    
    for (size_t i = 0; i < sample_count; i++) {
      putSample(samples[i]);
    }
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
  pinMode(I2S_DATA, OUTPUT);
  digitalWrite(I2S_DATA, 0);
    
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

  i2s_begin();
  i2s_set_rate(10000);
//  i2s_set_rate(12000);
//  i2s_set_rate(16000);
//  i2s_set_rate(44000);
//  i2s_set_rate(48000);
}

void loop(void) {
  server.handleClient();
  webSocket.loop();

  while (readIndex != writeIndex) {
    int32_t sample = getSample();
    while (i2s_write_sample_nb(sample) == 0) {
      yield();
    }
  }
  
  for (int pixel = 0; pixel < NUM_PIXELS; pixel++) {
    WS2812B.setPixelColor(pixel, WS2812B.Color(R, G, B));
    WS2812B.show();
  }

  WS2812B.show();
}