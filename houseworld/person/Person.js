const Observable = require('../../utils/Observable');
const {SenseLightsGoal, SenseLightsIntention, SenseOneLightGoal, SenseOneLightIntention} = require('../agents/LightSensor')
const Agent = require('../../bdi/Agent');
const Light = require('../devices/Light');



class Person extends Observable {
    constructor (house, name, room) {
        super()
        this.house = house;             // reference to the house
        this.name = name;               // non-observable
        this.set('in_room', room)  // observable
        this.observe( 'in_room', v => console.log(this.name, 'moved to', v) )    // observe
    }
    
    // for move the person from a room to another
    moveTo (to) {
        if ( this.house.rooms[this.in_room].doors_to.includes(to) ) { 

            // there are two people in bedroom_parents and one in bedroom_child (they start the day there)
            // from
            this.house.rooms[this.in_room].nr_ppl = (this.house.rooms[this.in_room].nr_ppl) - 1
            // to
            this.house.rooms[to].nr_ppl = (this.house.rooms[to].nr_ppl) + 1
            
            this.in_room = to

            return true
        }
        else {
            console.log(this.name, '\t failed moving from', this.in_room, 'to', to, '. [These two rooms are not connected by a door]')
            return false
        }
    }

    turnOnLight (room) {
        if (this.house.devices[room + '_light'].status == 'off'){
            this.house.devices[room + '_light'].switchOnLight()
            console.log(this.name, ' has turn on the lights in ', room)

        }
    }

    turnOffLight (room) {
        if (this.house.devices[room + '_light'].status == 'on'){
            this.house.devices[room + '_light'].switchOffLight()
            console.log(this.name, ' has turn off the lights in ', room)

        }
    }

    // for the alarm setting (person's action)
    setAlarm (hh, mm) {
        this.house.devices['alarm_'+this.name].setAlarm(hh, mm)
        console.log(this.name, ' has set the ', this.house.devices['alarm_'+this.name].name, ': ', 'HH: ', hh, ' MM: ', mm)
    }

    // for the thermostat's temperature setting
    setTemperature (temp) {
        this.house.devices['thermostat'].setTemp(temp)
        console.log(this.name, ' has set the temperature of the ', this.house.devices['thermostat'].name, ' at ', temp, ' °C')
    }

    // for the manual increase of the temperature in the house
    increaseTemperature(temp) {
        this.house.devices['thermostat'].increaseTemp(temp)
        console.log(this.name, ' has incresed the internal temperature by ', temp, ' °C')    }

    // for the manual decrease of the temperature in the house
    decreaseTemperature(temp) {
        this.house.devices['thermostat'].decreaseTemp(temp)
        console.log(this.name, ' has decresed the internal temperature by ', temp, ' °C')
    }

    // two functions for the manual using of the curtains
    openCurtain(room) {   
        if (this.house.devices[room + '_curtain'].status == 'closed'){
            this.house.devices[room + '_curtain'].open()
        }
    }
    closeCurtain(room) {
        if (this.house.devices[room + '_curtain'].status == 'opened'){
            this.house.devices[room + '_curtain'].close()
        }
    }

    setPrivacyMode(status) {
        this.house.rooms['bathroom'].privacy_mode = status
    }
    
}



module.exports = Person