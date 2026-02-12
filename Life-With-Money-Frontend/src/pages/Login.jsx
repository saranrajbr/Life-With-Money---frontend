import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import '../App.css'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom';
import mail from '../assets/Group Message.png'
import instagram from '../assets/Instagram Circle.png'
import facebook from '../assets/Facebook.png'
import linkedin from '../assets/LinkedIn Circled.png'
export default function Login(){
    const [email,setemail]=useState('');
    const [password,setpassword]=useState('');
    const navigate=useNavigate();

    const handleSubmit=async (e)=>{
        e.preventDefault();
        try{
            const response= await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`,{email,password});
            localStorage.setItem('token',response.data.token);
            navigate('/Dashboard');
        }catch(error){
            alert('login failed. Please check your credentials.')
        }
    
    };

    const handleGoogle=async (tokenResponse)=>{
        try{
            console.log("Google Response:", tokenResponse);

        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/google`,
            {
                token: tokenResponse.access_token   
            }
        );

        localStorage.setItem('token', response.data.token);

        navigate('/Dashboard');
        }catch(error){
            console.error('google login error:',error);
            alert('google login failed. Please try again');
        }
    };


    const handleGoogleError=()=>{
        console.error('google login failed');
        alert('google login failed.please try again');
    };

    const login=useGoogleLogin({
        onSuccess:handleGoogle,
        onError:handleGoogleError,
    })

    return (
        <>
        <header>
                    <div className='header'>
                        <div className='logo'>
                            <img src={logo} alt="logo" />
                        </div>
                        <div className='title'>
                            <h1 className='main-title'>Life With Money</h1>
                            <h2 className='sub-title'>Track daily expenses. Build better financial habits.</h2>
                        </div>
                        <div className='buttons'>
                            <Link to="/"><button className='login-button'>Home</button></Link>
                            <Link to="/Register"><button className='Register-button'>Register</button></Link>
                        </div>
                    </div>
                </header>
                <div className='loginbody'>
                    <div className='card'>
                        <h2>LOGIN</h2>
                        <form onSubmit={handleSubmit}>
                        <div className='inputbox'>
                            <label>EMAIL :</label>
                            <input type="email" placeholder='XXXX@gmail.com' value={email} onChange={(e)=>setemail(e.target.value)} required/>
                        </div>
                        <div className='inputbox'>
                            <label>PASSWORD :</label>
                            <input type="password" placeholder='12345' value={password} onChange={(e)=>setpassword(e.target.value)} required/>
                        </div>
                        <button type='submit' className='login-bttn'>LOGIN</button>
                        </form>
                    </div>
                    <p className='or'>OR</p>
                    <button className='googlecard' onClick={login}><img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />USING GOOGLE ACCOUNT</button>
                </div>
            <footer>
                    <div className='contact'>
                            <p>contact</p>
                            <a href="mailto:saranrajbr@gmail.com" target="_blank" rel="noopener noreferrer"><img src={mail} alt="mail" className="mail" /></a>
                            <a href="https://www.instagram.com/saranrajbr?igsh=MWlyZGUxY3J6NHJldg==" target="_blank" rel="noopener noreferrer"><img src={instagram} alt="instagram" className="instagram"/></a>
                            <a href="https://www.facebook.com/share/18HBNTqcH3/" target="_blank" rel="noopener noreferrer"><img src={facebook} alt="facebook" className="facebook"/></a>
                            <a href="https://www.linkedin.com/in/saran-raj-b-r-04913932b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer"><img src={linkedin} alt="linkedin" className="linkedin" /></a>
                                
                    </div>
            </footer>    
        </>
    );
}