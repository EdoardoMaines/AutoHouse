const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');
const Clock = require('../../utils/Clock');
const House = require ('../house/House')
const Curtain = require('../devices/Curtain')
const Thermostat = require ('../devices/Thermostat')

class SenseTemperatureGoal extends Goal {
    constructor (thermostat) {
        super()

        /** @type {Thermostat} thermostat */
        this.thermostat = thermostat

    }
}

class SenseTemperatureIntention extends Intention {

    constructor (agent, goal) {
        super(agent, goal)

        /** @type {Thermostat} thermostat */
        this.thermostat = this.goal.thermostat
    }


    static applicable(goal) {
        return goal instanceof SenseTemperatureGoal
    }

    *exec(){
        while(true) {
            
            let external_temp = yield this.thermostat.house.external_temperature.notifyChange('intensity')

            let temp_max = this.thermostat.temp_set

            this.log('sense: The temperature is set at ', temp_max, ' °C but the temperature in the house is ',  this.thermostat.temperature, ' °C')

            if (external_temp > this.thermostat.temperature) {
                let increase_factor = Math.floor((external_temp-this.thermostat.temperature)/2)

                this.thermostat.increaseTemp(increase_factor)
                this.log('Due to the external temperature, inside the house there are ', this.thermostat.temperature, ' °C (+', increase_factor, ' °C )')

            } else if (external_temp < this.thermostat.temperature) {
                let decrease_factor = Math.floor((this.thermostat.temperature-external_temp)/2)

                
                this.thermostat.decreaseTemp(decrease_factor)
                this.log('Due to the external temperature, inside the house there are ', this.thermostat.temperature, ' °C (-', decrease_factor, ' °C )')
            }


            if (temp_max > this.thermostat.temperature) {
                let increase_factor = temp_max - this.thermostat.temperature

                this.thermostat.increaseTemp(increase_factor)
                this.log('The thermostat increases the temperature by ', increase_factor, '(', this.thermostat.temperature, ' °C )')

            } else if (temp_max < this.thermostat.temperature){
                let decrease_factor =  this.thermostat.temperature - temp_max

                this.thermostat.decreaseTemp(decrease_factor)
                this.log('The thermostat decreases the temperature by ', decrease_factor, '(', this.thermostat.temperature, ' °C )')
            }

        }
    } 

}



module.exports = {SenseTemperatureGoal, SenseTemperatureIntention}