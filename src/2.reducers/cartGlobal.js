const INITIAL_STATE = {qty : 0}

export default (state=INITIAL_STATE,action) => {
    if(action.type === "QTY"){
        return {...INITIAL_STATE, qty : action.payload}
    }
    else{
        return state
    }
}
