const INITIAL_STATE = {id : 0, username : "",error : "",loading:false}

export default (state=INITIAL_STATE,action) => {
    if(action.type === 'LOGIN_SUCCESS'){
        return {...INITIAL_STATE,username : action.payload}
    }else{
        return state
    }
}