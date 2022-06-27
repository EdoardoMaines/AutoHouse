const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');
const Clock = require('../../utils/Clock');
const House = require ('../house/House')
const Curtain = require('../devices/Curtain')


class SenseExternalGoal extends Goal {
    constructor (house) {
        super()

        /** @type {House} house */
        this.house = house

    }

    // constructor (curtains = []) {
    //     super()

    //     /** @type {Array<Curtain>} curtains */
    //     this.curtains = curtains

    // }
}

class SenseExternalIntention extends Intention {

    constructor (agent, goal) {
        super(agent, goal)

        /** @type {House} house */
        this.house = this.goal.house
    }

    // constructor (agent, goal) {
    //     super(agent, goal)

    //     /** @type {Array<Curtain>} curtains */
    //     this.curtains = this.goal.curtains
    // }

    static applicable(goal) {
        return goal instanceof SenseExternalGoal
    }

    *exec(){
        while(true) {
            
            let hour = yield Clock.global.notifyChange('hh')
             
            if (hour == 0 && Clock.global.mm == 15) {
                this.house.level_sun_light.increaseLight(0)

                this.log('sense: It\'s 6:00, the light intensity is ', this.house.level_sun_light.intensity), 'LM'
            }
            if (hour == 6) {
                this.house.level_sun_light.increaseLight(25)
                this.house.external_temperature.increaseTemp(18) //temp 18

                this.log('sense: It\'s 6:00, the light intensity is ', this.house.level_sun_light.intensity, 'LM', ' and the external temperature is ', this.house.external_temperature.intensity, '°C')
            }
            if (hour == 9 ) {
                this.house.level_sun_light.increaseLight(25)
                this.log('sense: It\'s 9:00, the intensity of the sun is ', this.house.level_sun_light.intensity), 'LM'
            }
            if (hour == 12) {
                this.house.level_sun_light.increaseLight(50)
                this.house.external_temperature.increaseTemp(7) //temp 25
                this.log('sense: It\'s 12:00, the light intensity is ', this.house.level_sun_light.intensity, 'LM', ' and the external temperature is ', this.house.external_temperature.intensity, '°C')
            }
            if (hour == 15 ) {
                this.house.level_sun_light.decreaseLight(25)
                this.house.external_temperature.decreaseTemp(7) //temp 32
                this.log('sense: It\'s 15:00, the light intensity is ', this.house.level_sun_light.intensity, 'LM', ' and the external temperature is ', this.house.external_temperature.intensity, '°C')
            }
            if (hour == 18) {
                this.house.level_sun_light.decreaseLight(50)
                this.house.external_temperature.decreaseTemp(10) //temp 22
                this.log('sense: It\'s 18:00, the light intensity is ', this.house.level_sun_light.intensity, 'LM', ' and the external temperature is ', this.house.external_temperature.intensity, '°C')
            }
            if (hour == 20 ) {
                this.house.level_sun_light.decreaseLight(25)
                this.house.external_temperature.decreaseTemp(3) //temp 19
                this.log('sense: It\'s 20:00, the light intensity is ', this.house.level_sun_light.intensity, 'LM', ' and the external temperature is ', this.house.external_temperature.intensity, '°C')
            }
            if (hour == 23 ) {
                this.house.external_temperature.decreaseTemp(5) //temp 14
                this.log('sense: It\'s 23:00, the external temperature is ', this.house.external_temperature.intensity, '°C')
            }

        }
    }
}



module.exports = {SenseExternalGoal, SenseExternalIntention}