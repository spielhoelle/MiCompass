import React, { useContext, useReducer } from 'react';

import { IGlobalStatus, IState } from '../types/global.types';

export const StateContext = React.createContext({});
let lang = 'en'
if (typeof window !== "undefined") {
	const url = new URL(window.location);
	lang = url.searchParams.get('lang')
}
const initialState: IState = { lang: lang };

enum ActionType {
	setLang = 'setLang',
}

interface IAction {
	type: ActionType;
	payload: IState;
}

const reducer: React.Reducer<{}, IAction> = (state, action) => {
	switch (action.type) {
		case ActionType.setLang:
			return {
				lang: action.payload.lang
			};
		// case ActionType.RemoveDetails:
		// 	return {
		// 		message: initialState.message
		// 	};
		default:
			throw new Error(`Unhandled action type: ${action.type}`);
	}
};

export const StateProvider = ({ children }: any) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	return (
		<StateContext.Provider value={[state, dispatch]}>
			{children}
		</StateContext.Provider>
	);
};

// useContext hook - export here to keep code for global auth state
// together in this file, allowing user info to be accessed and updated
// in any functional component using the hook
export const useGlobalState: any = () => useContext(StateContext);
