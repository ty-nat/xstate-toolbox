import {createMachine, assign} from 'xstate';

type Action = (...x: any) => any;
type ThrottleEvent = {type: 'RUN'; action: Action};
type ThrottleContext = {
	action?: Action;
	isLocked: boolean;
	delay: number;
};
type ThrottleState = {
	value: 'idle';
	context: ThrottleContext & {action: undefined; isLocked: boolean};
} | {
	value: 'throttling';
	context: ThrottleContext;
};

const machine = createMachine<ThrottleContext, ThrottleEvent, ThrottleState>(
	{
		id: 'throttle',
		initial: 'idle',
		context: {
			isLocked: false,
			delay: 100
		},
		states: {
			idle: {
				on: {
					RUN: {
						cond: 'isNotLocked',
						actions: ['assignAction'],
						target: 'throttling'
					}
				}
			},
			throttling: {
				entry: ['lock', 'doAction'],
				after: {
					DELAY: {
						target: 'idle',
						actions: ['unlock']
					}
				}
			}
		}
	},
	{
		delays: {
			DELAY: context => {
				return context.delay;
			}
		},
		guards: {
			isNotLocked: ctx => !ctx.isLocked
		},
		actions: {
			assignAction: assign((_, event) => {
				return {
					action: event.action
				};
			}),
			lock: assign((_, __) => {
				return {
					isLocked: true
				};
			}),
			unlock: assign((_, __) => {
				return {
					isLocked: false
				};
			}),
			doAction: context => context?.action && context.action()
		}
	}
);

export {
	ThrottleEvent,
	ThrottleContext,
	ThrottleState
};
export default machine;

