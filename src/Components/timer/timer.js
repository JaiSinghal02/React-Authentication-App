import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AccessAlarmsIcon from '@material-ui/icons/AccessAlarms';


function CircularProgressWithLabel(props) {
    
    
    
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props}  size={280}/>
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant={props.val%2===0?'h2':'h3'} fontSize="20px" component="div" color="secondary">{`${Math.round(
          Math.abs(props.val),
        )}s`}</Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default function CircularStatic(props) {
  const [progress, setProgress] = React.useState(0);
  const [val, setVal] = React.useState(300);
  let token=localStorage.getItem('token')
  if(!token){
    localStorage.setItem('userAuth',false)
    props.history.push({
      pathname: '/',
    })
  }
  React.useEffect(() => {
    
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 300 ? 0 : prevProgress +1));
    }, 3000);
        const valtimer=setInterval(()=>{
            setVal((val)=>(val-1))
        },1000)
    setTimeout(()=>{
      localStorage.clear()
      props.history.push('/')
    },1000*300)
    return () => {
      clearInterval(timer);
      clearInterval(valtimer);
      
    };
  }, []);

  return (
    <div style={{display: 'flex',flexDirection: 'column', justifyContent: 'center',alignItems: 'center',fontSize: '60px'}}>
                <AccessAlarmsIcon style={{paddingBottom: "40px"}} fontSize="inherit"/>
                <Typography variant='h5' fontSize="20px" component="div" color="secondary" style={{paddingBottom: "60px"}}>JWT TOKEN EXPIRES IN</Typography>
                <CircularProgressWithLabel value={Math.round(progress-300)} val={val} />
              </div>
  )
}
