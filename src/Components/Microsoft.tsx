import React from 'react'
import MicrosoftLogin from 'react-microsoft-login'
import { emptyUser, Roles, User } from '../Interfaces/User';

interface Props{
    setUser:React.Dispatch<React.SetStateAction<User>>,
}

function Microsoft({setUser}:Props) {

    if(process.env.REACT_APP_WEBBISTE === "http://localhost:3000"){
        setUser({
            active:true,
            class:"",
            displayName:"Sebastian Ahlman",
            email:"hawaiilive@outlook.com",
            givenName:"Sebastian",
            id:"00123123",
            surName:"Ahlman",
            accountID:"00123123",
            role:Roles.student,
            number:"0705453110"
        });
    }

    const authHandler = (err:any, data:any)=>{
        if(err == null){
            var user:User = {
                active:true,
                class:"",
                displayName:data.displayName,
                email:data.mail,
                givenName:data.givenName,
                id:data.id,
                surName:data.surname,
                accountID:data.id,
                role:Roles.student,
                number:""
            }

            setUser(user);
            return;
        }

        setUser(emptyUser);
    }

    let key = process.env.REACT_APP_MICROSOFT_KEY === undefined ? "" : process.env.REACT_APP_MICROSOFT_KEY;

    return (
        <div>
            <MicrosoftLogin clientId={key} withUserData={true} authCallback={authHandler}/>
        </div>
    )
}

export default Microsoft
