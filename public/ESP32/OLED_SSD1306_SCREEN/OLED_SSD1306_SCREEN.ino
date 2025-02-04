#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_PN532.h>
#include <Keypad.h>
#include <ESPAsyncWebServer.h>

// Configuración de red WiFi
#define WIFI_SSID "your_ssid"
#define WIFI_PASSWORD "your_password"

// Configuración del servidor y endpoints
#define SERVER_URL "http://yourserver.com/api"

// Configuración del PN532 (NFC)
#define SDA_PIN 21
#define SCL_PIN 22
Adafruit_PN532 nfc(SDA_PIN, SCL_PIN);

// Configuración de la pantalla OLED
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

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
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("Error al inicializar OLED");
    while (true)
      ;
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  displayMessage("Conectandose a la wifi...");

  // Conectar a WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando a WiFi...");
  }
  Serial.println("Conectado a WiFi");



  // Inicializar PN532
  nfc.begin();
  nfc.SAMConfig();

  // Configurar endpoint para escaneo de NFC
  server.on("/scan", HTTP_GET, [](AsyncWebServerRequest *request) {
    String uuid = scanNFC();
    request->send(200, "text/plain", uuid);
  });
  server.begin();
}

void loop() {
  String uuid = scanNFC();
  if (!uuid.isEmpty()) {
    handleUserAuth(uuid, true);
  }

  char key = keypad.getKey();
  if (key) {
    handleKeypadInput(key);
  }
}

String scanNFC() {
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
  uint8_t uidLength;
  if (nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength)) {
    String uuid = "";
    for (uint8_t i = 0; i < uidLength; i++) {
      uuid += String(uid[i], HEX);
    }
    return uuid;
  }
  return "";
}

void handleKeypadInput(char key) {
  static String input = "";
  input += key;
  if (input.length() == 2) {
    handleUserAuth(input, false);
    input = "";
  }
}

void handleUserAuth(String identifier, bool isRFID) {
  HTTPClient http;
  String url = String(SERVER_URL) + (isRFID ? "/rfid/user" : "/code/user");
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  String requestBody = "{\"" + String(isRFID ? "UUID" : "user_code") + "\": \"" + identifier + "\"}";
  int httpCode = http.POST(requestBody);

  if (httpCode == 200) {
    displayMessage("Seleccionar producto");
    String productCode = getProductCode();
    sendProductRequest(identifier, productCode, isRFID);
  } else {
    displayMessage("Error de usuario");
  }
  http.end();
}

String getProductCode() {
  String code = "";
  while (code.length() < 2) {
    char key = keypad.getKey();
    if (key) {
      code += key;
    }
  }
  return code;
}

void sendProductRequest(String userId, String productId, bool isRFID) {
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
  display.clearDisplay();
  display.setCursor(0, 10);
  display.print(message);
  display.display();
}
