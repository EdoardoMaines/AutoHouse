# AutoHouse
•	src/houseworld/scenario/: scenarios that describes a day inside the house, in which we find the actions that are performed by people.
-	mainScenario.js
-	Scenario2.js
-	Scenario3.js
•	
•	src/houseworld/person/Person.js: the class Person with its method. They are instantiated in their respective bedrooms and for this reason 'luca move to bedroom' is printed at the beginning and (also for anna)
•	
•	src/houseworld/house/House.js: the class House with all the rooms, devices, and people. I added to every room the attribute nr_ppl (number of people present in that room in that instant of time). For the management of the privacy scenario, I added a privacy_mode parameter. In addition, I have added two new parameters (these parameters are monitored by various sensors, such as those of the panels or the thermostat):
-	level_sun_light: instance of the SunLight.js class and symbolizes the intensity level of the external light.
-	external_temperature: instance of the Temperature.js class and symbolizes the temperature outside the house.
•	
•	src/houseworld/devices: all devices' classes with their methods.
-	/Alarm.js: Alarm constructor and methods.The alarm clock can be set using an Alarm method but we also have a method in Person if the alarm is set manually by the person (in the scenario, in fact, it will be 'Luca' who sets the alarm)
-	/CoffeeMachine.js: coffeeMachine constructor and methods
-	/Light.js: Light constructor and methods (switchOnLight and switchOffLight)
-	/Courtains.js: Curtains constractor and methods (open and close). Also, the curtains can be opened and closed manually by people (see method in Person.js)
-	/SolarPanel.js: SolarPanel constractor and methods (start and stop)
-	/Thermostat.js: Thermostat constractor and methods (increaseTemp, decreaseTemp, setTemp). Furthermore, as for all interactive devices, their methods can be called from the Person.js class (e.g., to set the temperature or increase / decrease)
-	/StorageColumn.js: StorageColumn constractor and methods (catchEnergy (from SolarPanel) and chargeDevice)
•	
•	src/houseworld/agents: all sensors that monitor changes in device status (Goal and Intention)
-	/AlarmSensor.js: provides time control to manage alarms (allows automatic switching on of the coffee machine)
-	/CoffeeSensor.js: provides control of the coffeemachine status (on / off) to automate coffee preparation
-	/LightSensor.js: NOT MODIFIED AND NOT USED (no function has been implemented that is activated by switching the lights on / off)
-	/NightSensor.js: provides time control to turn off all lights in all unoccupied rooms and close all the curtains after 7pm
-	/RoomSensor.js: provides control of the movement of people inside the rooms by turning on the lights of the room you enter and the turning off of those in the room you leave (only if the room is free: if it were occupied by others the light will not be turned off. person). Furthermore, until 7 pm the lights of the rooms you enter are not switched on with the movement of a person)
-	/CurtainSensor.js: provides control of variations in external light intensity and based on that, opens or closes all the curtains in the house.
-	/ExternalSensor.js: provides time-based control of brightness and outdoor temperature.
-	/SolarPanelSensor.js: provides control of the variation in external brightness to calculate how much solar panels produce in those conditions.
-	/StorageColumnSensor.js: provides monitoring of the energy production of solar panels. Once the maximum threshold is exceeded, the energy produced is poured into the storage column.
-	/TemperatureSensor.js: provides external temperature control. When the temperature changes, it checks the internal temperature and increases / decreases according to the set temperature.
•	
•	src/houseworld/environment: we find all the classes related to the external environment
-	/SunLight.js: SunLight constractor and methods
-	/Temperature.js: Temperature constractor and methods
