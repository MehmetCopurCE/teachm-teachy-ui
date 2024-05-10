import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

function Navbar() {
    let userId = 5;
    const navigate = useNavigate();
    const Logout = () => {
        window.localStorage.removeItem("tokenKey")
        window.localStorage.removeItem("refreshKey")
        window.localStorage.removeItem("userId")
        window.localStorage.removeItem("userName")
        navigate("/loginsignup");
    } 

    return (
        <div>
            <AppBar position="static" sx={{ backgroundColor: 'orange' }}>
                <Toolbar>
            
                   
                    <div>
                    
                    <button onClick={() => Logout()}>Logout</button>

                </div>
                </Toolbar>
               
            </AppBar>
        </div>
    );
}

export default Navbar;


/* /Typography>
                    <div>
                    
                    <button onClick={() => Logout()}>Logout</button>     

                </div>
                
                </Toolbar>          bu kısımda bir değişiklilik var 

    const navigate = useNavigate();
    const Logout = () => {
        window.localStorage.removeItem("tokenKey")
        window.localStorage.removeItem("refreshKey")
        window.localStorage.removeItem("userId")
        window.localStorage.removeItem("userName")
        navigate("/loginsignup");
    }                                               2. olarak bu kısım 


    import { Link, useNavigate } from "react-router-dom";
    3. olarakta bu kısımda 
    */

    // ayrıca login-signup kısmında da belirli değişiklilikler var ve assets kısmında da bir ekleme var 