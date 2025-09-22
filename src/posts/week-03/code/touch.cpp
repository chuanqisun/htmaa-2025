#define THRESHOLD 10
const unsigned long RISE_COUNT = 50; // max count for touch read

void detect_touch() {
  int t;
  int p;

  for (int i = 0; i < N_TOUCH; i++) {
    p = touch_pins[i];

    // set to low
    pinMode(p, OUTPUT);
    digitalWriteFast(p, LOW);

    // settle
    delayMicroseconds(25);

    // make sure nothing else interrupts this
    noInterrupts();

    pinMode(p, INPUT_PULLUP);

    // measure ticks to rise
    // touching will slow the rise time, increase the count
    t = 0;
    while (!digitalReadFast(p) && t < RISE_COUNT) {
      t++;
    }
    touch_values[i] = t;

    // re-enable interrups
    interrupts();

    pin_touched_past[i] = pin_touched_now[i];
    pin_touched_now[i] = touch_values[i] > THRESHOLD;
  }
}

