import React, { useEffect, useState } from 'react'
import axios from 'axios'
import server from '../server'

export default function Login({logState,setLoginstate}) {
    const[registerusername,setRegisterusername]=useState("")
    const[registeruserpass,setRegisteruserpass]=useState("")
    const[loginusername,setLoginusername]=useState("")
    const[loginpass,setLoginpass]=useState("")
     
    useEffect(()=>{async function fetch(){
        const{data:Archive}=await server.get("getarchive",{withCredentials:true})
        console.log("Archive:",Archive)
        setLoginstate(Archive)
      }
       fetch();
      },[])


    const register=async()=>{
      const { data}=await server.post('register',{
        name:registerusername,
        password:registeruserpass
       },{withCredentials:true})
       console.log(data)
    
    
      
       /* axios({
            method:'POST',
            data:{
            name:registerusername,
            password:registeruserpass
            },
            withCredentials:true,
            url:"https://localhost:3042/register"
        }).then(res=>console.log(res)) */
    }
    const login=async()=>{
       const {
        data
      } = await server.post(`login`, 
      {
            name:loginusername,
            password:loginpass
      },
      { 
        withCredentials:true,
      }
      );
      console.log("Message:",data)
       setLoginstate(data)
      
     /*  await axios({
            method:'POST',
            data:{
            name:loginusername,
            password:loginpass
            },
            withCredentials:true,
            url:"https://express-server-nc6y-asaidoguz.vercel.app/login"
        }).then(res=>{
          
          setLoginstate(res)},(error)=>{
            console.log("Reason:",error)
          }) */
    }
  return (
    <div className='center'>
        <h1><strong>Wellcome to Escrow Contract Maker</strong></h1>
        <p><strong>Please login with your user name and password</strong></p>
        <p><strong>You don't have password ? Please register</strong></p>
        <div>
        <div><h1><strong>Register</strong></h1></div>
        <div className='center'><strong>User Name :</strong><input placeholder='username' onChange={e=>setRegisterusername(e.target.value)}></input></div>
        <div className='center'><strong>User Pass :</strong>&nbsp;<input placeholder='password' onChange={e=>setRegisteruserpass(e.target.value)}></input></div>
        <button className='center'onClick={register}>Submit</button>
        </div>

        <div><h1><strong>Login</strong></h1></div>
        <div className='center'><strong>User Name :</strong><input placeholder='username' onChange={e=>setLoginusername(e.target.value)}></input></div>
        <div className='center'><strong>User Pass :</strong>&nbsp;<input placeholder='password' onChange={e=>setLoginpass(e.target.value)}></input></div>
        <button onClick={login}>Submit</button>
    </div>
  )
}
