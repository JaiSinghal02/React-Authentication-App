import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PopUp from '../UI/PopUp/PopUp';
import { useState, useEffect } from 'react';
import axios from 'axios';



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '95%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(2, 0, 2),
  },
}));

function AuthForm(props) {
  const classes = useStyles();
  const [formobj, changeForm] = useState({ title: "Sign up", info: "Already have an account? Sign in" });
  const [popup, changePopUp] = useState({ message: "", severity: "" })
  const [signuperr, changeSignUpError] = useState([false, false, false, false, false]);
  const [siginerr, changeSignInError] = useState([false, false]);
  const [authErr, changeAuthErr] = useState("");
  useEffect(() => {
    let arr1 = Array(5).fill(false)
    changeSignUpError(arr1)
    let arr2 = Array(2).fill(false)
    changeSignInError(arr2)
    changeAuthErr("")
  }, [formobj["title"]])
  const changeFormValues = () => {
    if (formobj["title"] === "Sign in") { changeForm(prev => ({ ...prev, title: "Sign up", info: "Already have an account? Sign in" })) }
    else { changeForm(prev => ({ ...prev, title: "Sign in", info: "New User? Sign up" })) }

  }
  const validateEmail = (email) => {
    let check = true;
    const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    check &= re.test(email)
    return check
  }
  const afterAuth = (user, mode = "Signup") => {
    localStorage.setItem('token', user["token"])
    localStorage.setItem('first_name', user["first_name"])
    localStorage.setItem('last_name', user["last_name"])
    localStorage.setItem('email', user["email"])
    changePopUp(prev => ({ ...prev, message: "Authentication Successful", severity: "success" }))
    let redirect = '/account/timer'
    localStorage.clear()
    localStorage.setItem('token',user["token"])
    setTimeout(() => {
      props.history.push(redirect)
    }, 2000)
  }
  const validateForm = (mode, user, p1, p2 = "") => {
    let check = false;
    if (mode === "Signup") {
      let arr = Array(6).fill(false)
      if (user["first_name"].trim().length < 3) { arr[0] = true }
      if (user["last_name"].trim().length < 3) { arr[1] = true }
      if (!validateEmail(user["email"])) { arr[2] = true }
      if (p1.trim().length < 5) { arr[3] = true }
      if ((p1 !== p2) || arr[4]) { arr[4] = true }
      for (let i = 0; i < 5; ++i) { if (arr[i]) { check = arr[i] } }
      changeSignUpError(arr);
    }
    else {
      let arr = Array(2).fill(false)
      if (!validateEmail(user["email"])) { arr[0] = true }
      if (p1.trim().length < 5) { arr[1] = true }
      for (let i = 0; i < 2; ++i) { if (arr[i]) { check = arr[i] } }
      changeSignInError(arr);
    }
    if (check) {
      changePopUp(prev => ({ ...prev, message: "Please check your entries", severity: "error" }))
    }
    return check
  }
  const catchError =(err)=>{
    if (err.response) {
      changePopUp(prev => ({ ...prev, message: `${err.response.data.message}`, severity: "error" }))
      changeAuthErr(err.response.data.message);
    }
    else {
      changePopUp(prev => ({ ...prev, message: `Some Error Occured`, severity: "error" }))
      changeAuthErr("Some Error Occured");
    }
  }
  const submitAuthForm = (e) => {
    e.preventDefault()
    if (formobj["title"] === "Sign up") {
      const first_name = e.target[0].value
      const last_name = e.target[2].value
      const email = e.target[4].value
      const password1 = e.target[6].value
      const password2 = e.target[8].value
      const user = { password: password1, email: email, first_name: first_name, last_name: last_name };
      if(!validateForm("Signup", user, password1, password2)) {
        axios.post("/api/user/signup", user)
          .then(res => { afterAuth(res.data) })
          .catch(err => { catchError(err)})
      }
    }

    else {
      const email = e.target[0].value
      const password = e.target[2].value
      const user = { email: email, password: password };
      if(!validateForm("Signin", user, password)) {
        axios.post("/api/user/signin", user)
          .then(res => { afterAuth(res.data, "Signin");})
          .catch(err => {
            catchError(err)
      })


    }
    }
  }

  let password2 = null;
  let first_name = null;
  let last_name = null;
  if (formobj["title"] === "Sign up") {
    first_name = <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      name="first_name"
      label="First Name"
      id="first_name"
      autoFocus
      error={signuperr[0]}
    />
    last_name = <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      name="last_name"
      label="Last Name"
      id="last_name"
      error={signuperr[1]}
    />
    password2 = <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      name="password2"
      label="Re-enter Password"
      type="password"
      id="password2"
      autoComplete="password2"
      error={signuperr[4]}
      helperText={signuperr[4] ? "Passwords (Case-Sensitive) must match" : ""}
    />
  }
  
  let showErr = authErr
  let showPopUp = null;
  if (popup["message"] !== "") {
    showPopUp = <PopUp severity={popup["severity"]} open={true} message={popup["message"]} timer="2000" />
    setTimeout(() => {
      changePopUp(prev => ({ ...prev, message: "", severity: "" }))
    }, 2000)
  }
  return (
    <Container component="main" maxWidth="xs" style={{backgroundColor: 'white',boxShadow: '5px 5px 8px black',maxHeight: '750px'}}>
     
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5" style={{ paddingTop: "10px", paddingLeft: "18px" }}>
          User {formobj["title"]==="Sign up"?"Registration":"Log in"}
        </Typography>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {formobj["title"]}
        </Typography>
        <form className={classes.form} noValidate onSubmit={(e) => submitAuthForm(e)}>
          {first_name}
          {last_name}
          <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      name="email"
      label="Email Address"
      id="email"
      autoComplete="email"
      error={signuperr[2] || siginerr[0]}
    />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="password"
            error={signuperr[3] || siginerr[1]}
            helperText={(signuperr[3] || siginerr[1]) ? "Password must be 6 or more characters long" : ""}
          />
          {password2}
          <div>

            {showErr}
          </div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}

          >
            {formobj["title"]}
          </Button>
          <Grid container>
            <Grid item style={{paddingBottom: '10px'}}>
              <Link href="#" variant="body2" onClick={changeFormValues}>
                {formobj["info"]}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
      </Box>
      {showPopUp}
    </Container>
  );
}

export default AuthForm