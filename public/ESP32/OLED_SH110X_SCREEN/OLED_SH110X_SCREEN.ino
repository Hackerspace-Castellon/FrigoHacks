#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include "nRF_SSD1306Wire.h"	// legacy: #include "nRF_SSD1306.h"
#include <Adafruit_PN532.h>
#include <Keypad.h>
#include <ESPAsyncWebServer.h>

// Configuración de red WiFi
#define WIFI_SSID "<SSID>"
#define WIFI_PASSWORD "<PASS>"

// Configuración del servidor y endpoints
#define SERVER_URL "<API_URL>"

// Configuración del PN532 (NFC)
#define SDA_PIN 21
#define SCL_PIN 22
Adafruit_PN532 nfc(SDA_PIN, SCL_PIN);

// Configuración de la pantalla OLED
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
SSD1306Wire display(0x3c, SDA, SCL);   // ADDRESS, SDA, SCL  -  SDA and SCL usually populate automatically based on your board's pins_arduino.h

String lastMSG ="";

// Configuración del Keypad
const byte ROWS = 4;  // Filas
const byte COLS = 4;  // Columnas
char keys[ROWS][COLS] = {
  { '1', '2', '3', 'A' },
  { '4', '5', '6', 'B' },
  { '7', '8', '9', 'C' },
  { '*', '0', '#', 'D' }
};
byte rowPins[ROWS] = { 32, 33, 25, 26 };
byte colPins[COLS] = { 27, 14, 12, 13 };
Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

// Configuración del servidor web interno
AsyncWebServer server(80);

void setup() {
  Serial.begin(115200);


  // Inicializar pantalla OLED
  // Initialising the UI will init the display too.
  display.init();

  display.flipScreenVertically();

  displayMessage("Conectandose a la wifi...");

  // Conectar a WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando a \nWiFi...");
  }
  Serial.println("Conectado a WiFi");

  displayMessage("Conectandose a la wifi... OK!");



  displayMessage("Iniciando RFID... ");

  // Inicializar PN532
  nfc.begin();
  nfc.SAMConfig();

  displayMessage("Iniciando RFID... OK!");


  displayMessage("Iniciando Servidor... ");

  // Configurar endpoint para escaneo de NFC
  server.on("/scan", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("Peticion de escaneo de tarjeta");
    String uuid = scanNFC();
    request->send(200, "text/plain", uuid);
  });

  server.on("/status", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("Peticion de estado");
    String uuid = scanNFC();
    request->send(200, "text/plain", "200");
  });

  server.begin();
  displayMessage("Iniciando Servidor... OK");

}

void loop() {
  displayMessage("Acerca la tarjeta al lector... ");

  String uuid = scanNFC();
  if (!uuid.isEmpty()) {
    handleUserAuth(uuid, true);
  }

  char key = keypad.getKey();
  if (key) {
    Serial.println(key);
    handleKeypadInput(key);
  }
}

String scanNFC() {
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
  uint8_t uidLength;
  if (nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength)) {
    displayMessage("Escaneando tarjeta... ");

    String uuid = "";
    for (uint8_t i = 0; i < uidLength; i++) {
      uuid += String(uid[i], HEX);
    }
    Serial.println(uuid);
    return uuid;
  }
  return "";
}

void handleKeypadInput(char key) {
  static String input = "";
  input += key;
  displayMessage("Usuario: "+input);

  if (input.length() == 2) {
    handleUserAuth(input, false);
    input = "";
  }
}

void handleUserAuth(String identifier, bool isRFID) {
  displayMessage("Autenticando..." );
  HTTPClient http;
  String url = String(SERVER_URL) + (isRFID ? "/rfid/user" : "/code/user");
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  String requestBody = "{\"" + String(isRFID ? "UUID" : "user_code") + "\": \"" + identifier + "\"}";
  int httpCode = http.POST(requestBody);

  if (httpCode == 200) {
    displayMessage("Seleccionar producto");
    sendProductRequest(identifier, isRFID);
  } else {
    displayMessage("Error de usuario");
    delay(2000);
  }
  http.end();
}

String getProductCode() {
  String code = "";
  while (code.length() < 2) {

    code.trim();  // Modifica code directamente

    displayMessage("Selecciona producto: \n"+code);

    char key = keypad.getKey();
    if (key) {
      code += key;
    }
  }
  return code;
}

void sendProductRequest(String userId, bool isRFID) {

  String productId = getProductCode();
  Serial.println("Producto selecionado: "+productId);

  HTTPClient http;
  String url = String(SERVER_URL) + (isRFID ? "/rfid/product" : "/code/product");
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  String requestBody = "{\"" + String(isRFID ? "UUID" : "user_code") + "\": \"" + userId + "\", \"product_id\": \"" + productId + "\"}";
  int httpCode = http.POST(requestBody);

  if (httpCode == 200) {
    displayMessage("Producto suministrado");
  } else {
    displayMessage("Error en producto");
  }
  http.end();
}

void displayMessage(String message) {
  if(lastMSG == message){
    return;
  }
  lastMSG = message;
  display.setTextAlignment(TEXT_ALIGN_LEFT);
  display.setFont(ArialMT_Plain_16);
  display.clear();
  display.drawStringMaxWidth(0, 0,128, message);
  display.display();
}
