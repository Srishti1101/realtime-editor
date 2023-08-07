import React,{useState,useRef, useEffect} from 'react'
import toast from 'react-hot-toast';
import Client from '../Page/Client';
import Editor from '../Page/Editor';
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import { useLocation,useNavigate,Navigate,useParams } from 'react-router-dom';

const Editorpage = () => {
    const socketRef=useRef(null);
    const codeRef=useRef(null);
    const location=useLocation(); 
    const reactNavigator=useNavigate();
    const {roomId}=useParams();
    const [clients,setClients]=useState([]);

    useEffect(()=>{
    const init=async()=>{
        socketRef.current=await initSocket();
        socketRef.current.on('connect_error',(err)=>handleErrors(err));
        socketRef.current.on('connect_failed',(err)=>handleErrors(err));

        function handleErrors(e){
            console.log('socket error',e);
            toast.error('Socket connection failed, try again later.');
            reactNavigator('/');
        }

        socketRef.current.emit(ACTIONS.JOIN,{
            roomId,
            userName:location.state?.userName,
        }); 

        socketRef.current.on(ACTIONS.JOINED,({clients,userName,socketId})=>{
            if(userName!==location.state?.userName){
                toast.success(`${userName} joined the room.`);
                console.log(`${userName} joined`);
            }
            setClients(clients);
            socketRef.current.emit(ACTIONS.SYNC_CODE,{code:codeRef.current,socketId});
        });

        socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,userName})=>{
            toast.success(`${userName} left the room.`);
            setClients((prev)=>{
                return prev.filter(client=>client.socketId!==socketId )
            });
        });
    };
        init();

        return()=>{
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    
    },[]);

    async function copyRoomId(){
        try{
           await navigator.clipboard.writeText(roomId);
           toast.success('Copied ROOM ID!')
        }
        catch(err){
           toast.error("Can't copy");
           console.error(err);
        }
    }

    function leaveRoom(){
        reactNavigator('/');
        // toast.success(`${userName} left the room.`);
    }
  
    if(!location.state){
        return <Navigate to="/"/>
    }
    return (
        <div className='mainWrap'>
            <div className='aside'>
                <div className='asideInner'>
                    <div className='logo'>
                    <img src="/codelogo.jpeg" alt="code logo" class="logoImage"/>
                    </div>
                    <h2>Connected</h2>
                <div className='clientList'>
                    {clients.map((client)=>(
                        <Client key={client.socketId}userName={client.userName}/>
                        ))}
                        </div>
                </div>
                <button className='btn copyBtn' onClick={copyRoomId}>Copy ROOM ID</button>
                <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
            </div>
            <div className='editorWrap'>
                <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{codeRef.current=code}}/>
            </div>
        </div>
    )
}

export default Editorpage
