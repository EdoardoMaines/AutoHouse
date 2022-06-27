const Observable = require('../../utils/Observable');



class SunLight extends Observable {
    constructor (house) {
        super()
        this.house = house;         // reference to the house
        this.set('intensity', 0)   // observable
    }
    increaseLight (q) {
        this.intensity += q        
    }
    
    decreaseLight (q) {
        this.intensity -= q        
    }
}



module.exports = SunLight