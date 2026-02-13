import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png'
import dashboard from '../assets/dashboard.png'
import budgetsImg from '../assets/budgets.png'
import profileImg from '../assets/Profile.png'
import arrow from '../assets/arrow.png'
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
            try {
                const res = await API.get('/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
            } catch (err) {
                console.error("Failed to fetch user", err);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
        <div className="dashboard-container">
            {/* Sidebar - Duplicated from Dashboard */}
            <div className='side-navigation'>
                <div className='side-heading'>
                    <img src={logo} alt="logo" />
                    <h1>Life With Money</h1>
                </div>
                <div className='side-options'>
                    <Link to="/Dashboard" className='dashboard nav-link'>
                        <img src={dashboard} alt="dashboard logo" />
                        <p>Dashboard</p>
                    </Link>
                    <Link to="/Budgets" className='budgets nav-link'>
                        <img src={budgetsImg} alt="budgets logo" />
                        <p>Budgets</p>
                    </Link>
                    <div className='profiles nav-item-active'>
                        <img src={profileImg} alt="profile logo" />
                        <p>Profiles</p>
                    </div>
                </div>
                <button className='log-out' onClick={handleLogout}>
                    Logout
                    <img src={arrow} alt="arrow symbol" />
                </button>
            </div>

            {/* Main Content */}
            <div className='calender-container main-content'>
                <div className='calender-title'>
                    <h1>User Profile</h1>
                    <h2>Your Account Details</h2>
                </div>

                <div className='log-savings profile-card'>
                    {user ? (
                        <div className='profile-details'>
                            <div className='avatar-container'>
                                <div className='avatar'>
                                    {user.email ? user.email[0].toUpperCase() : 'U'}
                                </div>
                            </div>

                            <div className='inputbox vertical'>
                                <label>Email Address</label>
                                <div className='profile-value'>
                                    {user.email}
                                </div>
                            </div>

                            <div className='inputbox vertical'>
                                <label>User ID</label>
                                <div className='profile-value profile-value-dimmed'>
                                    {user._id}
                                </div>
                            </div>

                            {/* Placeholder for future fields */}
                            <div className='inputbox vertical'>
                                <label>Account Status</label>
                                <div className='profile-value'>
                                    Active
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>Loading profile...</p>
                    )}
                </div>
            </div>
        </div>
    );
}

