const Beliefset =  require('../../bdi/Beliefset')
const Observable =  require('../../utils/Observable')
const Clock =  require('../../utils/Clock')
const Agent = require('../../bdi/Agent')
const Goal = require('../../bdi/Goal')
const Intention = require('../../bdi/Intention')
const Person = require('../person/Person')
const Light = require('../devices/Light')
const {AlarmGoal, AlarmIntention} = require('../agents/AlarmSensor')
const {SenseLightsGoal, SenseLightsIntention, SenseOneLightGoal, SenseOneLightIntention} = require('../agents/LightSensor')
const Alarm = require('../devices/Alarm')
const CoffeeMachine = require('../devices/CoffeeMachine')
const Curtain = require('../devices/Curtain')
const SunLight = require('../environment/SunLight')
const Temperature = require('../environment/Temperature')
const Thermostat = require('../devices/Thermostat')
const SolarPanel = require('../devices/SolarPanel')
const StorageColumn = require('../devices/StorageColumn')



class House {
    constructor () {
        this.people = {
            luca: new Person(this, 'luca', 'bedroom'),
            anna: new Person(this, 'anna', 'bedroom')
        }
        this.rooms = {
            entrance_hall: {name: 'entrance_hall', doors_to: ['kitchen', 'living_room', 'corridor', 'outside'], nr_ppl: 0},
            kitchen: { name: 'kitchen', doors_to: ['entrance_hall'], nr_ppl: 0},
            living_room: { name: 'living_room', doors_to: ['entrance_hall'], nr_ppl: 0},
            corridor: {name: 'corridor', doors_to: ['bathroom', 'bedroom', 'entrance_hall'], nr_ppl: 0},
            bedroom: { name: 'bedroom', doors_to: ['corridor'], nr_ppl: 2},
            bathroom: { name: 'bathroom', doors_to: ['corridor'], nr_ppl: 0, privacy_mode: 'off'},
            outside: { name: 'outside', doors_to: ['entrance_hall'], nr_ppl: 0}
        }
        this.devices = {
            //LIGHTS
            kitchen_light: new Light(this, 'kitchen'),
            living_room_light: new Light(this, 'living_room'),
            bedroom_light: new Light(this, 'bedroom'),
            corridor_light: new Light(this, 'corridor'),
            bathroom_light: new Light(this, 'bathroom'),
            entrance_hall_light: new Light(this, 'entrance_hall'),
            //CURTAINS
            kitchen_curtain: new Curtain(this, 'kitchen'),
            living_room_curtain: new Curtain(this, 'living_room'),
            entrance_hall_curtain: new Curtain(this, 'entrance_hall'),
            bathroom_curtain: new Curtain(this, 'bathroom'),
            bedroom_curtain: new Curtain(this, 'bedroom'),

            //ALARMS
            alarm_luca: new Alarm(this, 'alarm_luca'),
            alarm_anna: new Alarm(this, 'alarm_anna'),

            //COFFEE MACHINE
            coffee_machine: new CoffeeMachine(this, 'coffee_machine'),
            
            //THERMOSTAT
            thermostat: new Thermostat(this, 'thermostat'),

            //SOLAR PANEL
            solar_panel: new SolarPanel(this, 'solar_panel'),

            //STORAGE COLUMN
            storage_column: new StorageColumn(this, 'storage_column')
        }
        this.utilities = {
            electricity: new Observable( { consumption: 0 } ),
            water: new Observable({consumption: 0})
        }
        this.level_sun_light = new SunLight(this)

        this.external_temperature = new Temperature(this)
    }
}
module.exports = House