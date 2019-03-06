import axios from 'axios'
import {urlApi} from './../support/urlApi'

export const onLogin = (paramUsername,password) => { 
    return(dispatch)=>{
        // INI UNTUK MENGUBAH LOADING MENJADI TRUE
        dispatch({
            type: 'LOADING',
        })

        // GET DATA DARI FAKE API JSON SERVER
        axios.get(urlApi + '/users',{
            params:{username :paramUsername,
                    password}})
        
        // KALO BERHASIL NGE GET, DIA MASUK THEN
        .then((res) => {
            console.log(res)

        // IF USERNAME DAN PASSWORD SESUAI MAKA RES.DATA ADA ISINYA
            if(res.data.length > 0){
                dispatch(
                    {
                        type : 'LOGIN_SUCCESS',
                        payload : res.data[0].username
                    }
                )
            }else{
                dispatch({
                    type : 'USER_NOT_FOUND',
                })
            }
            
        })
        .catch((err) => {
            dispatch({
                type : 'SYSTEM_ERROR'
            })
        })
    }
   
}


export const keepLogin = (cookie) => {
    return(dispatch) => {
        axios.get(urlApi + '/users',{params : {username : cookie}})
        .then((res) => {
            if(res.data.length > 0){
                dispatch({
                    type : 'LOGIN_SUCCESS',
                    payload : res.data[0].username
                })
            }
        })
        .catch((err) => console.log(err))
    }
} 


export const resetUser = () => {
    return {
        type : 'RESET_USER'
    }
}

export const userRegister = (a,b,c,d) => { // userRegister('fikri')
    return(dispatch)=>{
        dispatch({
            type : 'LOADING'
        })
        var newData = {username : a, password : b, email : c, phone : d}
        axios.get(urlApi +'/users?username=' + newData.username)
        .then((res) => {
            if(res.data.length > 0){
                dispatch({
                    type : 'USERNAME_NOT_AVAILABLE'
                })
            }
            else{
                axios.post(urlApi +'/users',newData)
                .then((res) => dispatch({
                    type : 'LOGIN_SUCCESS',
                    payload : a
                }))
                .catch((err) => console.log(err))
            }
        })
        .catch((err) => {
            dispatch({
                type : 'SYSTEM_ERROR'
            })
        })
    }
}




