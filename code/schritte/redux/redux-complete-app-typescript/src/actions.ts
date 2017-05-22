import { AppState, Greetings, Greeting, NewGreeting, GreetingId } from './types';
import { loadGreetingsFromServer, saveGreetingToServer } from './greeting-backend';

import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

export const SET_GREETINGS = 'SET_GREETINGS';
export const ADD_GREETING = 'ADD_GREETING';
export const SET_FILTER = 'SET_FILTER';
export const SET_MODE = 'SET_MODE';

export const MODE_MASTER = 'MODE_MASTER';
export const MODE_DETAIL = 'MODE_DETAIL';

export type Mode = typeof MODE_DETAIL | typeof MODE_MASTER;


export type SetGreetingsAction = {
	type: typeof SET_GREETINGS,
	greetings: Greetings
}

export type SaveGreetingAction = {
	type: typeof ADD_GREETING,
	greeting: Greeting
}

export type SetFilterAction = {
	type: typeof SET_FILTER,
	filter: string
}

export type SetModeAction = {
	type: typeof SET_MODE,
	mode: Mode
}

// Thunk actions: https://github.com/gaearon/redux-thunk/issues/103#issuecomment-298533925
export const loadGreetings: ThunkAction<Promise<SetGreetingsAction>, AppState, null> = dispatch => {
	return loadGreetingsFromServer()
		.then(greetings => dispatch({
			type: SET_GREETINGS,
			greetings
		}))
		.catch(err => console.error('LOADING GREETINGS FAILED:', err))
};

export const saveGreeting = (newGreeting: NewGreeting): ThunkAction<Promise<SaveGreetingAction>, AppState, null> =>
	(dispatch) => saveGreetingToServer(newGreeting)
		.then(id => {
			const newGreetingWithId: SaveGreetingAction = {
				type: ADD_GREETING,
				greeting: {
					id,
					...newGreeting
				}
			};
			dispatch(newGreetingWithId);
			dispatch(setMode(MODE_MASTER));
			return newGreetingWithId;
		})
		.catch(err => console.error('SAVING OF GREETING FAILED:', err))
;

export const setFilter = (filter: string): SetFilterAction => ({
	type: SET_FILTER,
	filter
});

export const setMode = (mode: Mode): SetModeAction => ({
	type: SET_MODE,
	mode
});
