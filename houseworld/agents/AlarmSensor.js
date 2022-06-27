const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');
const Clock = require('../../utils/Clock');
const Alarm = require ('../devices/Alarm')



class SenseAlarmGoal extends Goal {
    constructor (alarm) {
        super()

        /** @type {Alarm} alarm */
        this.alarm = alarm

    }
}

class SenseAlarmIntention extends Intention {

    constructor (agent, goal) {
        super(agent, goal)

        /** @type {Alarm} alarm */
        this.alarm = this.goal.alarm
    }

    static applicable(goal) {
        return goal instanceof SenseAlarmGoal
    }

    *exec(){
        while(true) {
            Clock.global.notifyChange('mm')
            //if (Clock.global.hh == this.alarm.hh) this.log('ALARM' + Clock.global.mm)
            yield
            if (Clock.global.hh == this.alarm.hh && Clock.global.mm == this.alarm.mm) {
                // Log a message!
                console.log ('ALARM! Wake up, it\'s ', Clock.global.hh, ':', Clock.global.mm,'!')
                this.log('sense: ' + this.alarm.name + ' has rung')
                if (this.alarm.name == 'alarm_luca' || this.alarm.name == 'alarm_anna') {
                    this.alarm.house.devices['coffee_machine'].turnOn()
                    // if (this.alarm.house.rooms['bedroom'].nr_ppl == 0){
                    //     this.alarm.house.devices['bedroom_curtain'].open()
                    // }
                }
                    
                break;
            }
        }
    }
}



module.exports = {SenseAlarmGoal, SenseAlarmIntention}