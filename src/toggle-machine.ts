import {createMachine} from 'xstate';

type ToggleEvent = {type: 'TOGGLE'};

const machine = createMachine({
	id: 'toggle',
	initial: 'inactive',
	states: {
		inactive: {on: {TOGGLE: 'active'}},
		active: {on: {TOGGLE: 'inactive'}}
	}
});

export {ToggleEvent};
export default machine;

