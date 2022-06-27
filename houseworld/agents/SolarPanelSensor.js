const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');
const Clock = require('../../utils/Clock');
const House = require ('../house/House')
const SolarPanel = require('../devices/SolarPanel')

class SenseSolarPanelGoal extends Goal {
    constructor (panel) {
        super()

        /** @type {SolarPanel} panel */
        this.panel = panel

    }
}

class SenseSolarPanelIntention extends Intention {

    constructor (agent, goal) {
        super(agent, goal)

        /** @type {SolarPanel} panel */
        this.panel = this.goal.panel
    }

    static applicable(goal) {
        return goal instanceof SenseSolarPanelGoal
    }

    *exec(){
        while(true) {
            
            let intensity_light = yield this.panel.house.level_sun_light.notifyChange('intensity')

            // If it night (: level of external light = 0)
            if(intensity_light == 0) {
                if (this.panel.status == 'in_function') {
                    this.panel.stop()
                }                
            }

            // If it cloudy (: level of external light = 25)
            if(intensity_light == 25) {
                if (this.panel.status == 'stand-by') {
                    this.panel.start()                
                }

                this.panel.energy_pool += 10

                if (this.panel.energy_pool < this.panel.max_energy) {                    
                    console.log(this.panel.name ,' are productiong 10W (TOT: ',this.panel.energy_pool,')')
                } else {
                    console.log(this.panel.name ,'\'s energy pool is full!')
                    this.panel.status_charge = 'full'
                }
            }

            // If too cloudy (: level of external light = 50)
            if(intensity_light == 50) {
                if (this.panel.status == 'stand-by') {
                    this.panel.start()
                }

                this.panel.energy_pool += 15

                if (this.panel.energy_pool < this.panel.max_energy) {                    
                    console.log(this.panel.name ,' are productiong 15W (TOT: ',this.panel.energy_pool,')')
                } else {
                    console.log(this.panel.name ,'\'s energy pool is full!')
                    this.panel.status_charge = 'full'
                }
            }

            // If quite sunny (: level of external light = 75)
            if(intensity_light == 75) {
                if (this.panel.status == 'stand-by') {
                    this.panel.start()
                }

                this.panel.energy_pool += 20

                if (this.panel.energy_pool < this.panel.max_energy) {                    
                    console.log(this.panel.name ,' are productiong 20W (TOT: ',this.panel.energy_pool,')')
                } else {
                    console.log(this.panel.name ,'\'s energy pool is full!')
                    this.panel.status_charge = 'full'
                }
            }

            // If it sunny (: level of external light = 100)
            if(intensity_light == 100) {
                if (this.panel.status == 'stand-by') {
                    this.panel.start()
                }

                this.panel.energy_pool += 30

                if (this.panel.energy_pool < this.panel.max_energy) {
                    console.log(this.panel.name ,' are productiong 30W (TOT: ',this.panel.energy_pool,')')
                } else {
                    console.log(this.panel.name ,'\'s energy pool is full!')
                    this.panel.status_charge = 'full'
                }
            }

        }
    }
}



module.exports = {SenseSolarPanelGoal, SenseSolarPanelIntention}