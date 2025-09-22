#include <Arduino.h>

// Configure pins
const uint8_t FIRST_PIN = 2;
const uint8_t LAST_PIN = 13;
const uint8_t LED_PIN = LED_BUILTIN; // On Arduino Mega 2560, LED_BUILTIN is D13

// Complaints for each pin
const char *complaints[] = {
    "Ouch!!!!!!!!!!!",     // Pin 2
    "Hey, that hurts!",    // Pin 3
    "Stop poking me!",     // Pin 4
    "That tickles!",       // Pin 5
    "Ow ow ow!",           // Pin 6
    "Not there!",          // Pin 7
    "I'm sensitive!",      // Pin 8
    "Gentle please!",      // Pin 9
    "That stings!",        // Pin 10
    "You're being rough!", // Pin 11
    "Easy does it!",       // Pin 12
    "My LED! Careful!"     // Pin 13
};

const char *thanks[] = {
    "Thank you <3!",     // Pin 2
    "Much better!",      // Pin 3
    "Ahh, relief!",      // Pin 4
    "That's nice!",      // Pin 5
    "Finally!",          // Pin 6
    "Sweet freedom!",    // Pin 7
    "I can breathe!",    // Pin 8
    "So gentle now!",    // Pin 9
    "The pain is gone!", // Pin 10
    "You're so kind!",   // Pin 11
    "Perfect!",          // Pin 12
    "My LED is safe!"    // Pin 13
};

// State tracking for each pin
int lastState[LAST_PIN - FIRST_PIN + 1];
unsigned long lastChange[LAST_PIN - FIRST_PIN + 1];
const unsigned long debounceMs = 20;

// Poke counter and death state
int pokeCount = 0;
bool isDead = false;

void setup()
{
  // Initialize all pins as inputs with pull-up
  for (uint8_t pin = FIRST_PIN; pin <= LAST_PIN; pin++)
  {
    if (pin != LED_PIN)
    { // Don't configure LED pin as input
      pinMode(pin, INPUT_PULLUP);
    }
    lastState[pin - FIRST_PIN] = HIGH; // Pull-up makes it HIGH by default
    lastChange[pin - FIRST_PIN] = 0;
  }

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  Serial.begin(115200);
  Serial.println("Touch any pin (2-13) to ground to hear my complaints!");
}

void loop()
{
  if (isDead)
  {
    return; // Stop all processing when dead
  }

  bool anyGrounded = false;

  // Check each pin
  for (uint8_t pin = FIRST_PIN; pin <= LAST_PIN; pin++)
  {
    if (pin == LED_PIN)
      continue; // Skip LED pin for input reading

    int reading = digitalRead(pin);
    bool grounded = (reading == LOW);

    if (grounded)
    {
      anyGrounded = true;
    }

    // Edge detection with debounce
    int index = pin - FIRST_PIN;

    if (reading != lastState[index])
    {
      if (millis() - lastChange[index] >= debounceMs)
      {
        lastChange[index] = millis();
        lastState[index] = reading;

        if (reading == LOW)
        {
          pokeCount++;

          if (pokeCount > 5)
          {
            Serial.println("Too many pokes. I'm dead.");
            isDead = true;
            digitalWrite(LED_PIN, LOW); // Turn off LED when dead
            return;
          }

          Serial.println(complaints[index]);
        }
        else
        {
          Serial.println(thanks[index]);
        }
      }
    }
  }

  // Light LED if any pin is grounded
  digitalWrite(LED_PIN, anyGrounded ? HIGH : LOW);

  delay(2);
}