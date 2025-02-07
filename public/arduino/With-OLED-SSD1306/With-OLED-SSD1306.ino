#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include "nRF_SSD1306Wire.h"
#include <Adafruit_PN532.h>
#include <Keypad.h>
#include <WebServer.h>

// Configuración de red WiFi
#define WIFI_SSID "<SSID>"
#define WIFI_PASSWORD "<PASS>"

// Configuración del servidor y endpoints
#define SERVER_URL "http://<LOCAL-IP>:8000/api"

// Configuración del PN532 (NFC)
#define SDA_PIN 21
#define SCL_PIN 22
Adafruit_PN532 nfc(SDA_PIN, SCL_PIN);

// Configuración de la pantalla OLED
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
SSD1306Wire display(0x3c, SDA, SCL);

// Configuración del Keypad
const byte ROWS = 4;
const byte COLS = 4;
char keys[ROWS][COLS] = {
    {'1', '2', '3', 'A'},
    {'4', '5', '6', 'B'},
    {'7', '8', '9', 'C'},
    {'*', '0', '#', 'D'}};
byte rowPins[ROWS] = {32, 33, 25, 26};
byte colPins[COLS] = {27, 14, 12, 13};
Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

// Configuración del servidor HTTP síncrono
WebServer server(80);

String lastMSG = "";

void setup()
{
    Serial.begin(115200);

    // Inicializar pantalla OLED
    display.init();
    display.flipScreenVertically();
    displayMessage("Conectando a WiFi...");

    // Conectar a WiFi
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.println("Conectando a WiFi...");
    }
    Serial.println("Conectado a WiFi");

    Serial.print("IP address:\t");
    Serial.println(WiFi.localIP());

    displayMessage("WiFi OK!");

    // Inicializar NFC
    displayMessage("Iniciando RFID...");
    nfc.begin();
    nfc.SAMConfig();
    displayMessage("RFID OK!");

    // Configurar endpoints HTTP
    server.on("/scan", HTTP_GET, handleScan);
    server.on("/status", HTTP_GET, handleStatus);

    server.begin();
    displayMessage("Servidor OK");
}

void loop()
{
    server.handleClient(); // Manejo de peticiones HTTP

    displayMessage("Acerca la tarjeta...");

    String uuid = scanNFC();
    if (!uuid.isEmpty())
    {
        handleUserAuth(uuid, true);
    }

    char key = keypad.getKey();
    if (key)
    {
        Serial.println(key);
        handleKeypadInput(key);
    }
}

// Función para manejar la petición a /scan
void handleScan()
{
    displayMessage("Escaneo remoto...");
    Serial.println("Escaneo remoto de tarjeta solicitado");

    String uuid = scanNFC();
    if (!uuid.isEmpty())
    {
        server.send(200, "text/plain", uuid);
    }
    else
    {
        server.send(404, "text/plain", "No se detectó tarjeta");
    }
}

// Función para manejar la petición a /status
void handleStatus()
{
    Serial.println("Peticion de estado recibida");
    server.send(200, "text/plain", "OK");
}

// Función para escanear NFC
String scanNFC()
{
    uint8_t uid[7] = {0};
    uint8_t uidLength;

    if (nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength))
    {
        displayMessage("Escaneando tarjeta...");

        String uuid = "";
        for (uint8_t i = 0; i < uidLength; i++)
        {
            uuid += String(uid[i], HEX);
        }

        Serial.println("UUID: " + uuid);
        return uuid;
    }
    return "";
}

// Manejo de entrada del teclado numérico
void handleKeypadInput(char key)
{
    static String input = "";
    input += key;
    displayMessage("Usuario: " + input);

    if (input.length() == 2)
    {
        handleUserAuth(input, false);
        input = "";
    }
}

// Autenticación del usuario
void handleUserAuth(String identifier, bool isRFID)
{
    displayMessage("Autenticando...");
    HTTPClient http;
    String url = String(SERVER_URL) + (isRFID ? "/rfid/user" : "/code/user");
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    String requestBody = "{\"" + String(isRFID ? "UUID" : "user_code") + "\": \"" + identifier + "\"}";
    int httpCode = http.POST(requestBody);

    if (httpCode == 200)
    {
        displayMessage("Seleccionar producto");
        sendProductRequest(identifier, isRFID);
    }
    else
    {
        displayMessage("Error de usuario");
        delay(2000);
    }
    http.end();
}

// Obtener código de producto desde el teclado
String getProductCode()
{
    String code = "";
    displayMessage("Selecciona producto: " + code);

    while (code.length() < 2)
    {
        char key = keypad.getKey();
        if (key)
        {
            code += key;
            displayMessage("Selecciona producto: " + code);
        }
    }
    return code;
}

// Enviar solicitud del producto seleccionado
void sendProductRequest(String userId, bool isRFID)
{
    String productId = getProductCode();
    Serial.println("Producto seleccionado: " + productId);

    HTTPClient http;
    String url = String(SERVER_URL) + (isRFID ? "/rfid/product" : "/code/product");
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    String requestBody = "{\"" + String(isRFID ? "UUID" : "user_code") + "\": \"" + userId + "\", \"product_id\": \"" + productId + "\"}";
    int httpCode = http.POST(requestBody);

    if (httpCode == 200)
    {
        displayMessage("Puede suministrarse");
        delay(2000);
    }
    else
    {
        displayMessage("Error en producto");
    }
    http.end();
}

// Mostrar mensaje en la pantalla OLED
void displayMessage(String message)
{
    if (lastMSG == message)
    {
        return;
    }
    lastMSG = message;
    display.setTextAlignment(TEXT_ALIGN_LEFT);
    display.setFont(ArialMT_Plain_16);
    display.clear();
    display.drawStringMaxWidth(0, 0, 128, message);
    display.display();
}
