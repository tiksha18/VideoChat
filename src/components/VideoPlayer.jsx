import React, { useContext } from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SocketContext } from '../SocketContext';

const useStyles = makeStyles((theme) => ({
    video: {
      width: '550px',
      [theme.breakpoints.down('xs')]: {
        width: '300px',
      },
    },
    gridContainer: {
      justifyContent: 'center',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    paper: {
      padding: '10px',
      border: '2px solid black',
      margin: '10px',
    },
}));


// make video iframe and put the stream into it
const VideoPlayer = () => {

    // destructuring all variables simultaneously
    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);  // passing SocketContext so that we can use all the variables and funcs made/passed in there

    const classes = useStyles(); 

    return (  
        <Grid container className={classes.gridContainer}>
            {/* Our own Video */}
            {
                stream && (
                    // only if the user allows streaming then my own video will appear
                    <Paper className={classes.paper} >
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" gutterBottom>{name || 'Name'}</Typography>
                            <video playsInline muted ref={myVideo} autoPlay className={classes.video} />
                        </Grid>
                    </Paper>
                )
            }
            {/* Other User's Video */}
            {
                callAccepted && !callEnded && (
                    // if call is accepted and not ended then only the other person's video will appear
                    <Paper className={classes.paper} >
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" gutterBottom>{call.name || 'Name'}</Typography>
                            <video playsInline ref={userVideo} autoPlay className={classes.video} />
                        </Grid>
                    </Paper>
                )
            }
        </Grid>
    );
}
 
export default VideoPlayer; 