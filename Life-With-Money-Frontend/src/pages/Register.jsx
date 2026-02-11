import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'
import '../App.css'
import mail from '../assets/Group Message.png'
import instagram from '../assets/Instagram Circle.png'
import facebook from '../assets/Facebook.png'
import linkedin from '../assets/LinkedIn Circled.png'
export default function Register(){
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
                        <Link to="/Login"><button className='Register-button'>Login</button></Link>
                    </div>
                </div>
            </header>
            <div className='loginbody'>
                    <div className='card'>
                        <h2>REGISTER</h2>
                        <form action="">
                        <div className='inputbox'>
                            <label>EMAIL :</label>
                            <input type="email" placeholder='xxxx@gmail.com'/>
                        </div>
                        <div className='inputbox'>
                            <label>PASSWORD :</label>
                            <input type="password" placeholder='12345'/>
                        </div>
                        <div className='inputbox'>
                            <label>CONFIRM PASSWORD :</label>
                            <input type="password" placeholder='12345' />
                        </div>
                        <button className='login-bttn'>REGISTER</button>
                        </form>
                    </div>
                    <p className='or'>OR</p>
                    <button className='googlecard'>USING GOOGLE ACCOUNT</button>
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