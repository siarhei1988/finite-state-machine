class FSM {
	/**
     * Creates new FSM instance.
     * @param config
     */
	constructor(config) {
		if (!config) {
			throw new Error('The config is not passed.');
		}

		this.config = config;
		this.statesStack = [ config.initial ];
		this.currentStateIndex = 0;
	}

	/**
     * Returns active state.
     * @returns {String}
     */
	getState() {
		return this.statesStack[this.currentStateIndex];
	}

	get states() {
		return this.config.states;
	}

	get transitions() {
		return this.states[this.getState()].transitions;
	}

	/**
     * Goes to specified state.
     * @param state
     */
	changeState(state) {
		const states = this.states;

		if (!states[state]) {
			throw new Error('The passed state is not correct.');
		}

        this.statesStack.push(state);
        this.currentStateIndex++;
        this.statesStack = this.statesStack.slice(0, this.currentStateIndex + 1);		
	}

	/**
     * Changes state according to event transition rules.
     * @param event
     */
	trigger(event) {
		const transitions = this.transitions;
		const nextState = transitions[event];

		if (!nextState) {
			throw new Error('The passed event is not correct.');
		}

		this.changeState(nextState);
	}

	/**
     * Resets FSM state to initial.
     */
	reset() {
		this.statesStack = [ this.config.initial ];
		this.currentStateIndex = 0;
	}

	/**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
	getStates(event) {
		const states = this.states;

		if (!event) {
			return Object.keys(states);
		}

		let result = [];
		Object.keys(states).reduce((acc, val) => {
			const transitions = states[val].transitions;
			if (transitions[event]) {
				acc.push(val);
			}
			return acc;
		}, result);

		return result;
	}

	/**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
	undo() {
		if (this.currentStateIndex === 0) {
			return false;
		}

		this.currentStateIndex--;
		return true;
	}

	/**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
	redo() {
		if (this.statesStack.length === 1) {
			return false;
		}

		if (!this.statesStack[this.currentStateIndex + 1]) {
			return false;
		}

		this.currentStateIndex++;
		return true;
	}

	/**
     * Clears transition history
     */
	clearHistory() {
		this.reset();
	}
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
