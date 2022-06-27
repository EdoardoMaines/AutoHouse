const Observable = require('../../utils/Observable');



class SolarPanel extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.max_energy = 40;
        this.energy_pool = 0;
        this.set('status', 'stand-by')   // observable
        this.set('status_charge', 'empty')   // observable
    }

    // Start to catch sun light for energy
    start (p) {
        this.status = 'in_function'
        console.log(this.name ,' are in function')        
    }

    // Stop to catch sun light
    stop (p) {
        this.status = 'stand-by'
        console.log(this.name ,' are in stand-by')
    }

    // Drain the energy from the energy_pool to the storage_column
    // drain (p) {
    //     if (this.energy_pool != 0) {
    //         this.house.devices['storage_column'].catchEnergy(energy_pool)
    //     }
    // }

}



module.exports = SolarPanel