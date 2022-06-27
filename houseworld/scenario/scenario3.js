const Beliefset =  require('../../bdi/Beliefset')
const Clock =  require('../../utils/Clock')
const Agent = require('../../bdi/Agent')
const {SenseAlarmGoal, SenseAlarmIntention} = require('../agents/AlarmSensor')
const {SenseRoomGoal, SenseRoomIntention} = require('../agents/RoomSensor')
const {SenseCoffeeGoal, SenseCoffeeIntention} = require ('../agents/CoffeeSensor')
const {SenseNightGoal, SenseNightIntention} = require ('../agents/NightSensor')
const {SenseExternalGoal, SenseExternalIntention} = require ('../agents/ExternalSensor')
const {SenseCurtainsGoal, SenseCurtainsIntention} = require ('../agents/CurtainSensor')
const {SenseTemperatureGoal, SenseTemperatureIntention} = require ('../agents/TemperatureSensor')
const {SenseSolarPanelGoal, SenseSolarPanelIntention} = require ('../agents/SolarPanelSensor')
const {SenseStorageColumnGoal, SenseStorageColumnIntention} = require ('../agents/StorageColumnSensor')



const House = require('../house/House')



// House, which includes rooms and devices
var myHouse = new House()

// Agents
var myAgent = new Agent('myAgent')

//INTENSIONS
myAgent.intentions.push(SenseAlarmIntention)
myAgent.intentions.push(SenseRoomIntention)
myAgent.intentions.push(SenseCoffeeIntention)
myAgent.intentions.push(SenseNightIntention)
myAgent.intentions.push(SenseExternalIntention)
myAgent.intentions.push(SenseCurtainsIntention)
myAgent.intentions.push(SenseTemperatureIntention)
myAgent.intentions.push(SenseSolarPanelIntention)
myAgent.intentions.push(SenseStorageColumnIntention)


myHouse.people.luca.setAlarm(6, 30)
myHouse.people.anna.setAlarm(6, 45)
myHouse.people.luca.setTemperature(22)

//SUBGOALS
myAgent.postSubGoal(new SenseAlarmGoal( myHouse.devices['alarm_luca'] ))
myAgent.postSubGoal(new SenseAlarmGoal( myHouse.devices['alarm_anna'] ))

myAgent.postSubGoal(new SenseRoomGoal( [myHouse.people.luca, myHouse.people.anna] ))
myAgent.postSubGoal(new SenseCoffeeGoal(myHouse.devices['coffee_machine']))
myAgent.postSubGoal(new SenseNightGoal(myHouse))
myAgent.postSubGoal(new SenseExternalGoal(myHouse))
myAgent.postSubGoal(new SenseCurtainsGoal(myHouse))
myAgent.postSubGoal(new SenseTemperatureGoal(myHouse.devices['thermostat']))
myAgent.postSubGoal(new SenseSolarPanelGoal(myHouse.devices['solar_panel']))
myAgent.postSubGoal(new SenseStorageColumnGoal(myHouse.devices['storage_column']))




// myAgent.intentions.push(SenseLightsIntention)
// // myAgent.intentions.push(SenseOneLightIntention)
// myAgent.postSubGoal( new SenseLightsGoal( [myHouse.devices.kitchen_light, myHouse.devices.bedroom_parents_light] ) )

// Simulated Daily/Weekly schedule
Clock.global.observe('mm', (mm) => {
    var time = Clock.global
    
    if(time.hh==6 && time.mm==45){    
        myHouse.people.luca.setPrivacyMode('on') 
        myHouse.people.luca.moveTo('corridor')

    }
    if(time.hh==7 && time.mm==00){        
        myHouse.people.luca.moveTo('entrance_hall')

        // increase the internal temperature by 2°C
        myHouse.people.luca.increaseTemperature(2)

        myHouse.people.anna.moveTo('corridor')        
    }
    if(time.hh==7 && time.mm==15){
        myHouse.people.luca.moveTo('kitchen')
        myHouse.people.anna.moveTo('entrance_hall')
    }
    if(time.hh==7 && time.mm==30){
        myHouse.people.anna.moveTo('kitchen')
    }
    if(time.hh==7 && time.mm==45){
        myHouse.people.luca.moveTo('entrance_hall')
    }
    if(time.hh==8 && time.mm==00){
        myHouse.people.luca.moveTo('outside')
        myHouse.people.anna.moveTo('entrance_hall')

        // decrease the internal temperature by 4°C
        myHouse.people.anna.decreaseTemperature(4)

    }
    if(time.hh==8 && time.mm==15){
        myHouse.people.anna.moveTo('outside')
    }
    if(time.hh==14 && time.mm==00){
        myHouse.people.luca.moveTo('entrance_hall')
        myHouse.people.anna.moveTo('entrance_hall')
    }
    if(time.hh==14 && time.mm==15){
        myHouse.people.luca.moveTo('kitchen')
        myHouse.people.anna.moveTo('kitchen')

    }
    if(time.hh==15 && time.mm==15){
        myHouse.people.luca.moveTo('entrance_hall')
        myHouse.people.anna.moveTo('entrance_hall')

        // decrease the internal temperature by 4°C
        myHouse.people.luca.decreaseTemperature(1)

    }
    if(time.hh==15 && time.mm==30){
        myHouse.people.luca.moveTo('living_room')
        myHouse.people.anna.moveTo('living_room')
    }
    if(time.hh==19 && time.mm==00){
        myHouse.people.luca.moveTo('entrance_hall')
        myHouse.people.anna.moveTo('entrance_hall')
    }
    if(time.hh==19 && time.mm==15){
        myHouse.people.luca.moveTo('kitchen')
        myHouse.people.anna.moveTo('kitchen')
    }
    if(time.hh==20 && time.mm==30){
        myHouse.people.luca.moveTo('entrance_hall')
        myHouse.people.anna.moveTo('entrance_hall')
    }
    if(time.hh==20 && time.mm==45){
        myHouse.people.luca.moveTo('living_room')
        myHouse.people.anna.moveTo('living_room')
    }
    if(time.hh==21 && time.mm==45){
        myHouse.people.luca.moveTo('entrance_hall')
        myHouse.people.anna.moveTo('entrance_hall')

        // increase the internal temperature by 3°C
        myHouse.people.anna.increaseTemperature(3)

    }
    if(time.hh==22 && time.mm==00){
        myHouse.people.luca.moveTo('corridor')
        myHouse.people.anna.moveTo('corridor')
    }
    if(time.hh==22 && time.mm==15){
        myHouse.people.luca.moveTo('bathroom')
        myHouse.people.anna.moveTo('bathroom')
    }
    if(time.hh==22 && time.mm==30){
        myHouse.people.luca.moveTo('corridor')
        myHouse.people.anna.moveTo('corridor')
    }
    if(time.hh==22 && time.mm==45){
        myHouse.people.luca.moveTo('bedroom')
        myHouse.people.anna.moveTo('bedroom')
    }
    if(time.hh==23 && time.mm==00){
        myHouse.people.luca.turnOffLight('bedroom')
    }
})

// Start clock
Clock.startTimer()
