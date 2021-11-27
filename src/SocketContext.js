import React, { useState, useEffect, useRef, createContext } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

// initial instance of SocketContext
const socket = io('https://videochatapp-21.herokuapp.com');  // passing server url

// function to run our video chat
const ContextProvider = ({children}) => {    // getting children from props 

    const [stream, setStream] = useState(null);
    const [me, setMe] = useState('');
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');

    const myVideo = useRef();  // here, useRef is used to populate the current video stream
    const userVideo = useRef();  // made it ref to connect with the iframe of that specific video
    const connectionRef = useRef(); 

    // useEffect is similar to componentdidmount
    useEffect(() => {  
        // what do we want as soon as our page loads => we want the camera and audio permissions that is in lock icon before url
        navigator.mediaDevices.getUserMedia({ video: true, audio: true})
            .then((currentStream) => {   // if the user press allow button , then his video loads on the page otherwise not
                setStream(currentStream); // setting the current steam as what is being displayed in video in our current state

                myVideo.current.srcObject = currentStream;  // populating our video iframe
            });

        // getting that specific socket id 
        socket.on('me', (id) => setMe(id)); 

        socket.on('calluser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivedCall: true, from, name: callerName, signal });
        });
    }, []);  // need this empty dependency array at the end otherwise this useEffect will always going to run 

    const answerCall = () => {
        setCallAccepted(true);

        // using peer that is capable of videocalling
        const peer = new Peer({ initiator: false, trickle: false, stream }); // here, initiator is kept false as we are answering the call and not calling the user
        // stream is passed which actually is the current stream as set by calling setStream method and passing currentStream to it

        // after receiving signal and its data
        peer.on('signal', (data) => {
            // establishing a video connection
            socket.emit('answercall', { signal: data, to: call.from });
        });

        // setting the current stream of other person
        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        peer.signal(call.signal); // this call consists all the details of the user who is calling

        connectionRef.current = peer; // current connection is equal to peer who is inside of this connection
    }

    // user to whom we are calling and passing his call id while function call
    const callUser = (id) => {

        // initiator set to true as we are the person who is calling
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on('signal', (data) => {
            // establishing a video connection
            socket.emit('calluser', { userToCall: id, signalData: data, from: me, name }); //here, me consists of our own call id as set in the state 
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream; // setting the user video
        });

        // if we accept the call 
        socket.on('callaccepted', (signal) => {
            setCallAccepted(true);

            peer.signal(signal);
        });

        connectionRef.current = peer;
    }

    const leaveCall = () => {

        setCallEnded(true);

        connectionRef.current.destroy(); // destroying the connection and therefore we will stop receiving inputs from user video and audio

        window.location.reload();  // reload the page after ending the call and this will also provide the user with a new caller id in useEffect
    }

    return (

        <SocketContext.Provider value = {{
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            me,
            callUser,
            leaveCall,
            answerCall
        }}>
            {children}     {/* Passing all the above variables and functions in all the components wrapped in children */}
        </SocketContext.Provider>
    );
}

export { ContextProvider, SocketContext };