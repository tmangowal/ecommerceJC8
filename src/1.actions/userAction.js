import axios from 'axios'

export const onLogin = (paramUsername,password) => { 
    return(dispatch)=>{
        axios.get('http://localhost:2000/users',{
            params:{username :paramUsername,
                    password}})
        .then((res) => {
            console.log(res)
            if(res.data.length > 0){
                dispatch(
                    {
                        type : 'LOGIN_SUCCESS',
                        payload : res.data[0].username
                    }
                )
            }
            
        })
        .catch((err) => console.log(err))
    }
   
}