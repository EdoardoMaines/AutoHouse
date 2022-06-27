const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');
const Clock = require('../../utils/Clock');
const House = require ('../house/House')



class SenseNightGoal extends Goal {
    constructor (house) {
        super()

        /** @type {House} house */
        this.house = house

    }
}

class SenseNightIntention extends Intention {

    constructor (agent, goal) {
        super(agent, goal)

        /** @type {House} house */
        this.house = this.goal.house
    }

    static applicable(goal) {
        return goal instanceof SenseNightGoal
    }

    *exec(){
        while(true) {
            Clock.global.notifyChange('mm')
            yield

            if (Clock.global.hh == 19) {

                this.log('sense: It\'s 19:00, time to turn on the lights in the rooms where there is someone and close all the curtains')

                // turn on all the light in rooms with someone
                for(let room in this.house.rooms) {
                    if (room != 'outside') {
                        if (this.house.rooms[room].nr_ppl > 0 && this.house.devices[room + '_light'].status == 'off') {
                            this.house.devices[room + '_light'].switchOnLight()
                        }
                    }
                    
                }

                // close all the curtains
                for(let room in this.house.rooms) {                    
                    if (room != 'corridor' && room != 'outside') {
                        if (this.house.devices[room + '_curtain'].status == 'opened') {
                            this.house.devices[room + '_curtain'].close()
                        }
                    }
                }
                break;
            }
        }
    }
}



module.exports = {SenseNightGoal, SenseNightIntention}