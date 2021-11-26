import React from 'react'
import MicrosoftLogin from 'react-microsoft-login';
import { emptyTeacher, Teacher } from '../Interfaces/User';
import CustomModal from './Utils/CustomModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CreateTeacher, GetTeacher } from '../ServerRoutes';

interface Props{
    setTeacher:React.Dispatch<React.SetStateAction<Teacher>>,
}

function Microsoft({setTeacher}:Props) {
    /*if(process.env.REACT_APP_WEBBISTE === "http://localhost:3000"){
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
    }*/

    const authHandler = (err:any, data:any)=>{
        if(err == null){
            var teacher:Teacher = {
                active:true,
                displayName:data.displayName,
                email:data.mail,
                givenName:data.givenName,
                surName:data.surname,
                accountID:data.id,
                classRoomIDs:[],
                groupIDs:[],
                number:""
            }

            fetch(GetTeacher + teacher.accountID,{
                method:"GET",
                headers:{
                    "content-type":"application/json"
                }
            }).then(res=>res.json().then(data=>{
                if(data === null || data.data === null){
                    const newTeacher = {
                        accountID:teacher.accountID,
                        displayName:teacher.displayName,
                        givenName:teacher.givenName,
                        surName:teacher.surName,
                        email:teacher.email
                    }

                    fetch(CreateTeacher,{
                        method:"POST",
                        body:JSON.stringify(newTeacher),
                        headers:{
                            "content-type":"application/json"
                        }
                    }).then(res=>res.json().then(newData=>{
                        setTeacher(newData.data);
                    }));
                }else{
                    setTeacher(data.data);
                }
            }));
            return;
        }

        setTeacher(emptyTeacher);
    }

    let key = process.env.REACT_APP_MICROSOFT_KEY === undefined ? "" : process.env.REACT_APP_MICROSOFT_KEY;

    return (
        <div>
            <CustomModal title="Logga in som lärare" show={true} buttonClicked={()=>{}} buttons={[]}>
                <MicrosoftLogin clientId={key} withUserData={true} authCallback={authHandler}/>
            </CustomModal>
        </div>
    )
}

export default Microsoft
