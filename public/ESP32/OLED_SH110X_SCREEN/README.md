# Conexiones y Diagrama del Sistema ESP32 con NFC y Keypad

## 1. Componentes Utilizados
- ESP32
- Lector RFID PN532 (I2C)
- Teclado matricial 4x4
- Pantalla OLED 0.96'' SSD1306 (I2C)
- Buzzer activo

## 2. Conexiones

### **ESP32 - PN532 (I2C)**
| PN532 Pin | ESP32 Pin |
|-----------|----------|
| SDA       | GPIO 21  |
| SCL       | GPIO 22  |
| VCC       | 3.3V     |
| GND       | GND      |

### **ESP32 - Pantalla OLED (I2C)**
| OLED Pin  | ESP32 Pin |
|-----------|----------|
| SDA       | GPIO 21  |
| SCL       | GPIO 22  |
| VCC       | 3.3V     |
| GND       | GND      |

### **ESP32 - Teclado 4x4**
| Keypad Pin | ESP32 Pin |
|------------|----------|
| R1         | GPIO 32  |
| R2         | GPIO 33  |
| R3         | GPIO 25  |
| R4         | GPIO 26  |
| C1         | GPIO 27  |
| C2         | GPIO 14  |
| C3         | GPIO 12  |
| C4         | GPIO 13  |

### **ESP32 - Buzzer**
| Buzzer Pin | ESP32 Pin |
|------------|----------|
| VCC        | 3.3V     |
| GND        | GND      |
| Signal     | GPIO 15  |

## 3. Diagrama de Conexiones
_(Diagrama esquemático pendiente)_

## 4. Flujo de Operación
1. La ESP32 espera una tarjeta NFC o un código de dos dígitos.
2. Si se detecta una tarjeta NFC, se envía el UUID al servidor `/rfid/user`.
3. Si se introduce un código de usuario, se envía a `/code/user`.
4. El servidor responde con `200 OK` o un error.
   - Si es `200 OK`, se solicita el código del producto.
   - Si hay error, se muestra en la pantalla y se activa el buzzer.
5. Tras recibir el código del producto:
   - Se envía la solicitud a `/rfid/product` o `/code/product` según el método.
   - Si el servidor responde con `200 OK`, se autoriza el suministro del producto.
   - En caso de error, se muestra en pantalla y se activa el buzzer.
6. Si se recibe una petición en `/scan`, la ESP32 muestra un mensaje en la pantalla para acercar una tarjeta NFC y envía su UUID como respuesta.

## 5. Ilustraciones
_(Dibujos de conexión y diagrama de flujo pendientes)_

