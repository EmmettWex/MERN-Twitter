import jwtFect from './jwt';

const RECEIVE_CURRENT_USER = "session/RECEIVE_CURRENT_USER";
const RECEIVE_SESSION_ERRORS = "session/RECEIVE_SESSION_ERRORS";
const CLEAR_SESSION_ERRORS = "session/CLEAR_SESSION_ERRORS";
export const RECEIVE_USER_LOGOUT = "session/RECEIVE_USER_LOGOUT";

const receiveCurrentUser = currentUser => {
    return {
        type: RECEIVE_CURRENT_USER,
        currentUser
    }
}

const receiveErrors = errors => {
    return {
        type: RECEIVE_SESSION_ERRORS,
        errors
    }
}

const logoutUser = () => {
    return {
        type: RECEIVE_USER_LOGOUT
    }
}

export const clearSessionErrors = () => {
    return {
        type: CLEAR_SESSION_ERRORS
    }
}

export const signup = user => startSession(user, 'api/users/register');
export const login = user => startSession(user, 'api/users/login');

const startSession = (userInfo, route) => async dispatch => {
    try {
        const res = await jwtFetch(route, {
            method: "POST",
            body: JSON.stringify(userInfo)
        });

        const { user, token } = await res.json();
        localStorage.setItem('jwtToken', token);
        return dispatch(recieveCurrentUser(user));
    } catch(err) {
        const res = await err.json();
        if (res.statusCode === 400) {
            return dispatch(receiveErrors(res.errors));
        }
    }
};

export const logout = () => dispatch => {
    localStorage.removeItem('jwtToken');
    dispatch(logoutUser());
}

const initialState = {
    user: undefined
};

export const sessionErrorsReducer = (state = nullErrors, action) => {
    switch(action.type) {
        case RECEIVE_SESSION_ERRORS:
            return action.errors;
        case RECEIVE_CURRENT_USER:
        case CLEAR_SESSION_ERRORS:
            return nullErrors;
        default:
            return state;
    }
};

const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_CURRENT_USER:
            return { user: action.currentUser };
        case RECEIVE_USER_LOGOUT:
            return initialState;
        default:
            return state;
    }
};

export default sessionReducer;