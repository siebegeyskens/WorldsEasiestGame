const int buttonPin = 4;   

int inByte = 0; // inbyte = de byte die het eerst in de buffer komt
int buttonState;             
int lastButtonState = LOW; 
int buttonValue;  

unsigned long lastDebounceTime = 0;  // unsigned longs want worden grote getallen 
unsigned long debounceDelay = 50;

void setup() {
Serial.begin(9600);
pinMode(buttonPin, INPUT);
establishContact(); // handshake/functie
}
 
void loop() {
buttonValue = 0;
int reading = digitalRead(buttonPin);
if (reading != lastButtonState){ // als de buttonstate veranderd sinds verander sinds vorige loop
lastDebounceTime= millis(); // millis() is de tijd in ms sinds de schets gestart is
}

if (Serial.available() > 0){ // als er iets in de buffer zit: nadat A (zie establishcontact()) gelezen is door sketch.js print js een a terug en is de buffer gevuld
inByte = Serial.read(); 

if ((millis() - lastDebounceTime)>debounceDelay){ // als het verschil van millis() en millis sinds buttonstatechange groter is als 50ms
if(reading != buttonState){
  buttonState = reading; // update de buttonstate
  if (buttonState == HIGH){
    buttonValue = 1;
  }
}
}

int photoresistor = analogRead(A5);
int potentiometer = analogRead(A0);                 
int mappedPot = map(potentiometer, 0, 1023, 0, 255); 

Serial.write(photoresistor);                            
Serial.write(mappedPot); 
Serial.write(buttonValue); 

}
lastButtonState = reading;
}

// stuurt een A naar p5-code, als p5-code deze leest maakt die de buffer leeg en stuurt die een A terug zodat er terug iets in de buffer zit
void establishContact() {
  while (Serial.available() <= 0) {
    Serial.print('A');  
    delay(300);
  }
}