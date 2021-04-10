import React from 'react';
import Button from '../UI/Button/Button'
import PopUp from '../UI/PopUp/PopUp'


export default function Home(props){
    let showPopUp= null
  
  if(localStorage.getItem('userAuth')==='false'){
    showPopUp = <PopUp severity="error" open={true} message="Unauthenticated" timer="2000" />
    
  }
  setTimeout(()=>{
    localStorage.removeItem('userAuth')
  },2000)

  return(
      <>
    <Button link="/account" message="Proceed"/>
    {showPopUp}
    </>
  )
}