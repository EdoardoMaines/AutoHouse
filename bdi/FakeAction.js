const pddlActionIntention = require("../pddl/actions/pddlActionIntention");

class FakeAction {

    constructor(agent, parameters) {
        this.agent = agent
        this.parameters = parameters
    }

    get precondition() {
        return pddlActionIntention.ground(this.constructor.precondition, this.parameters)
    }

    checkPrecondition() {
        return this.agent.beliefs.check(...this.precondition);
    }

    get effect() {
        return pddlActionIntention.ground(this.constructor.effect, this.parameters)
    }

    applyEffect() {
        for (let b of this.effect)
            this.agent.beliefs.apply(b)
    }

    async checkPreconditionAndApplyEffect() {
        if (this.checkPrecondition()) {
            this.applyEffect()
            await new Promise(res => setTimeout(res, 5000))
        }
        else
            throw new Error('pddl precondition not valid'); //Promise is rejected!
    }

}
module.exports = FakeAction