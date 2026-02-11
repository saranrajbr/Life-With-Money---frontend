import React from "react";
import {Routes,Route,Link } from "react-router-dom"
import '../App.css'
import '../index.css'
import pigmoney from '../assets/pigmoney.png';
import moneyhand from '../assets/moneyhand.png';
import logo from '../assets/logo.png'
import mail from '../assets/Group Message.png'
import instagram from '../assets/Instagram Circle.png'
import facebook from '../assets/Facebook.png'
import linkedin from '../assets/LinkedIn Circled.png'

export default function Home(){
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
                    <Link to="/Login"><button className='login-button'>login</button></Link>
                    <Link to="/Register"><button className='Register-button'>Register</button></Link>
                </div>
            </div>
        </header>
        <div className="content1">
                <div className="text1">
                    <p>Track Your Money. Control Your Life.</p>
                    <p>A smart, calendar-based expense manager designed to give you complete visibility
into your finances. Track every expense effortlessly, understand your spending
patterns day by day and month by month, and make informed decisions that help
you save more, spend smarter, and stay financially confident.</p>
                </div>
                <div className='handimage'>
                <img src={moneyhand} alt="handmoney" />
                </div>
            </div>
            <div className='content2'>
                <div className='pigimage'>
                    <img src={pigmoney} alt="pigmoney" />
                </div>
                <div className='text2'>
                    <p>Managing money shouldn't be confusing. Our app helps you log daily expenses, analyze spending patterns, and make better financial decisions all in one simple dashboard.</p>
                </div>
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