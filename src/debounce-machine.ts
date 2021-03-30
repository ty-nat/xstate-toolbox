import {createMachine, assign} from 'xstate';

type Action = (...x: any) => any;
type DebounceEvent = {type: 'RUN'; action: Action};
type DebounceContext = {
	action?: Action;
	delay: number;
};
type DebounceState = {
	value: 'idle';
	context: DebounceContext & {action: undefined};
} | {
	value: 'debouncing';
	context: DebounceContext;
};

const machine = createMachine<DebounceContext, DebounceEvent, DebounceState>(
	{
		id: 'debounce',
		initial: 'idle',
		context: {
			delay: 100
		},
		states: {
			idle: {},
			debouncing: {
				after: {
					DELAY: {
						actions: ['doAction'],
						target: 'idle'
					}
				}
			}
		},
		on: {
			RUN: {
				actions: ['assignAction'],
				target: 'debouncing'
			}
		}
	},
	{
		delays: {
			DELAY: context => {
				return context.delay;
			}
		},
		actions: {
			assignAction: assign((_, event) => {
				return {
					action: event.action
				};
			}),
			doAction: context => {
				if (context.action) {
					context.action();
				}
			}
		}
	}
);

export {
	DebounceEvent,
	DebounceContext,
	DebounceState
};
export default machine;

