import React,{useState} from 'react'
import {v4} from "uuid";
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';

const Home = (props) => {
    const navigate=useNavigate();
    const [roomId,setRoomId]=useState('');
    const [userName,setUserName]=useState('');
    const createNewRoom=(e)=>{
            e.preventDefault();
            const id=v4();
            setRoomId(id);
            toast.success("Created a new room");
    }
    const joinRoom=()=>{
        if(!roomId || !userName){
            toast.error("ROOM ID and USERNAME is required!");
            return;
        }
        navigate(`/editor/${roomId}`,{
        state:{
        userName,
        },
        });
    };
    const handleInputEnter=(e)=>{
         if(e.code==='Enter'){
            joinRoom(); 
         }
    }
    return (
        <div className="homePageWrapper">
           <div className="formWrapper">
            <h1>Welcome to real time coding</h1>
            <img src="/codelogo.jpeg" alt="code logo" class="img"/>
            <h4 className='mainLabel'>Invitation Room ID</h4>
            <div className='inputGroup'>
                <input 
                type="text"
                placeholder='ROOM ID'
                className='inputBox'
                onChange={(e)=>setRoomId(e.target.value)}
                value={roomId}
                onKeyUp={handleInputEnter}
                />
                <input 
                type="text" 
                placeholder='USERNAME' 
                className='inputBox'
                onChange={(e)=>setUserName(e.target.value)}
                value={userName}
                onKeyUp={handleInputEnter}
                />
                <button className='btn joinBtn' onClick={joinRoom}>Join</button>
                <span className='createInfo'>
                    If you don't have an invite create your own &nbsp;
                    <button onClick={createNewRoom} className='btn2'>Create</button>
                </span>
            </div>
           </div>
           <footer>
           <h4>Build by Srishti &nbsp;
            <a href="https://www.linkedin.com/in/srishti-bansal-a22946233" className='connectDec'>Connect here</a>
           </h4>
           </footer>
        </div>
    )
}

export default Home
