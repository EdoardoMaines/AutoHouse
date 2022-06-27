const Observable = require('../../utils/Observable');



class Temperature extends Observable {
    constructor (house) {
        super()
        this.house = house;         // reference to the house
        this.set('intensity', 0)   // observable
    }
    increaseTemp (q) {
        this.intensity += q        
    }
    
    decreaseTemp (q) {
        this.intensity -= q        
    }
}



module.exports = Temperature