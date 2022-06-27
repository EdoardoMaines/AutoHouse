const Observable = require('../../utils/Observable');



class StorageColumn extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.level_energy = 0;
        this.set('status', 'stand-by')   // observable
        this.set('storage', 'empty')   // observable
    }

    // Start to catch sun light for energy
    catchEnergy (energy) {
        if (this.level_energy < 100) {
            this.status = 'charging'
            console.log(this.name ,' is in charge. ', energy , ' W have arrived!' )

            //energy from the panel to the storage
            this.level_energy += energy
            console.log(this.name ,' has ', this.level_energy , ' W in TOT' )


        } else if (this.level_energy >= 100) {
            this.storage = 'full'
        }
        
    }

    // Stop to catch sun light
    chargeDevice (device) {
        this.status = 'stand-by'
        console.log(this.name ,' are in stand-by')
        this.house.utilities.electricity.consumption += 1;
        // Include some messages logged on the console!
        
    }
}



module.exports = StorageColumn