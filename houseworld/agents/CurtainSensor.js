const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');
const Clock = require('../../utils/Clock');
const Curtain = require('../devices/Curtain');
const House = require ('../house/House')



class SenseCurtainsGoal extends Goal {

    constructor (house) {
        super()

        /** @type {House} house */
        this.house = house

    }

}



class SenseCurtainsIntention extends Intention {
    
    constructor (agent, goal) {
        
        super(agent, goal)

        /** @type {House} house */
        this.house = this.goal.house
    }
    
    static applicable (goal) {
        return goal instanceof SenseCurtainsGoal
    }

    
    *exec () {
    
        while(true) {

            let intensity = yield this.house.level_sun_light.notifyChange('intensity')

            if (intensity >= 50 ) {
                for(let room in this.house.rooms) {                    
                    if (room != 'corridor' && room != 'bedroom' && room != 'outside') {
                        if (this.house.devices[room + '_curtain'].status == 'opened' ) {
                            this.house.devices[room + '_curtain'].close()
                            
                        }
                    }
                }
                

            } else if (intensity <= 25) {
                for(let room in this.house.rooms) {                    
                    if (room != 'corridor' && room != 'bedroom' && room != 'outside') {
                        if (this.house.devices[room + '_curtain'].status == 'closed') {
                            this.house.devices[room + '_curtain'].open()
                        }
                    }
                }
            }
        } 
    }

}




module.exports = {SenseCurtainsGoal, SenseCurtainsIntention}