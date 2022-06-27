const Goal = require('../../bdi/Goal');
const Intention = require('../../bdi/Intention');
const Clock = require('../../utils/Clock');
const House = require ('../house/House')
const SolarPanel = require('../devices/SolarPanel')
const StorageColumn = require('../devices/StorageColumn')

class SenseStorageColumnGoal extends Goal {
    constructor (column) {
        super()

        /** @type {StorageColumn} column */
        this.column = column

    }
}

class SenseStorageColumnIntention extends Intention {

    constructor (agent, goal) {
        super(agent, goal)

        /** @type {StorageColumn} column */
        this.column = this.goal.column
    }

    static applicable(goal) {
        return goal instanceof SenseStorageColumnGoal
    }

    *exec(){
        while(true) {
            
            let status = yield this.column.house.devices['solar_panel'].notifyChange('status_charge')
            
            if (status == 'full') {
                let energy = this.column.house.devices['solar_panel'].energy_pool
                this.column.catchEnergy(energy)
                this.column.house.devices['solar_panel'].energy_pool = 0
            }            
        }
    }
}



module.exports = {SenseStorageColumnGoal, SenseStorageColumnIntention}