import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png'
import dashboard from '../assets/dashboard.png'
import budgetsImg from '../assets/budgets.png'
import profile from '../assets/Profile.png'
import arrow from '../assets/arrow.png'
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

export default function Budgets() {
    const navigate = useNavigate();
    const [salary, setSalary] = useState(0);
    const [expenses, setExpenses] = useState([]);
    const [isYearly, setIsYearly] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
            try {

                const userRes = await API.get('/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSalary(userRes.data.salary || 0);

                // Fetch All Expenses
                const expenseRes = await API.get('/expense/all/overview'); // Wait, I added GET / to expense.js, need to check route path
                // Actually I added it as router.get('/', ...) in expense.js
                // So path is /api/expense/
                const expRes = await API.get('/expense');
                setExpenses(expRes.data);

                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch data", err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSalaryUpdate = async () => {
        try {
            await API.put('/auth/salary', { salary });
            // Feedback?
        } catch (err) {
            console.error("Failed to update salary", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    }

    // Calculations
    const now = new Date();
    const currentMonthStr = String(now.getMonth() + 1).padStart(2, '0');
    const currentYearStr = String(now.getFullYear());
    // Format YYYY-MM
    const currentYM = `${currentYearStr}-${currentMonthStr}`;

    const filteredExpenses = expenses.filter(exp => {
        // exp.date is "YYYY-MM-DD" string from backend
        if (!exp.date) return false;

        if (isYearly) {
            return exp.date.startsWith(currentYearStr);
        }
        // Check if date starts with YYYY-MM
        return exp.date.startsWith(currentYM);
    });

    const totalSpent = filteredExpenses.reduce((acc, day) => {
        const dayTotal = day.expenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        return acc + dayTotal;
    }, 0);

    const displayedSalary = isYearly ? salary * 12 : salary;
    const remaining = displayedSalary - totalSpent;

    // Insights logic (Basic)
    let highestExpenseDay = "N/A";
    let maxDayAmount = 0;

    // Flatten expenses for category analysis
    // Flatten expenses for category analysis
    const allItems = [];
    filteredExpenses.forEach(day => {
        // day.expenses is the array of items
        if (day.expenses && Array.isArray(day.expenses)) {
            const dayTotal = day.expenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
            if (dayTotal > maxDayAmount) {
                maxDayAmount = dayTotal;
                // Parse date for display only
                // "YYYY-MM-DD" -> Date object is okay for formatting if we trust browser, or just parse string
                const [y, m, d] = day.date.split('-');
                const dateObj = new Date(y, m - 1, d);
                highestExpenseDay = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            }
            day.expenses.forEach(item => allItems.push({ ...item, date: day.date }));
        }
    });

    // Top Category
    const categoryTotals = {};
    allItems.forEach(item => {
        const cat = item.name || "Uncategorized";
        categoryTotals[cat] = (categoryTotals[cat] || 0) + (parseFloat(item.amount) || 0);
    });
    let topCategory = "N/A";
    let maxCatAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, amount]) => {
        if (amount > maxCatAmount) {
            maxCatAmount = amount;
            topCategory = cat;
        }
    });

    // Recent Transactions
    // Sort allItems by date desc
    const recentTransactions = allItems.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
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
                    <div className='budgets nav-item-active'>
                        <img src={budgetsImg} alt="budgets logo" />
                        <p>Budgets</p>
                    </div>
                    <Link to="/Profiles" className='profiles nav-link'>
                        <img src={profile} alt="profile logo" />
                        <p>Profiles</p>
                    </Link>
                </div>
                <button className='log-out' onClick={handleLogout}>
                    Logout
                    <img src={arrow} alt="arrow symbol" />
                </button>
            </div>

            {/* Main Content */}
            <div className='calender-container main-content' style={{ alignItems: 'flex-start', overflowY: 'auto' }}>
                <div style={{ paddingLeft: '20px' }}>
                    <h1 className='section-title'>Financial Overview</h1>
                    <p className='section-subtitle'>Track Your Money. Control Your Life.</p>
                </div>

                <div className='financial-container'>
                    <div className='financial-left-col'>
                        {/* Salary Input */}
                        <div className='salary-card'>
                            <div className='salary-header'>
                                <div className='salary-title'>
                                    <span>💵</span> Salary Input
                                </div>
                                <div className='toggle-container'>
                                    <button
                                        className={`toggle-btn ${!isYearly ? 'active' : ''}`}
                                        onClick={() => setIsYearly(false)}
                                    >Monthly</button>
                                    <button
                                        className={`toggle-btn ${isYearly ? 'active' : ''}`}
                                        onClick={() => setIsYearly(true)}
                                    >Yearly</button>
                                </div>
                            </div>
                            <div className='salary-input-container'>
                                <span className='currency-symbol'>$</span>
                                <input
                                    type="number"
                                    className='salary-main-input'
                                    placeholder="Enter your monthly salary"
                                    value={salary || ''}
                                    onChange={(e) => setSalary(parseFloat(e.target.value) || 0)}
                                    onBlur={handleSalaryUpdate}
                                />
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className='summary-cards-row'>
                            <div className='summary-card'>
                                <span className='summary-label'>Total Salary</span>
                                <span className='summary-value' style={{ color: '#ffffff' }}>${displayedSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                <div className='progress-bar-bg'>
                                    <div className='progress-bar-fill' style={{ width: '100%', backgroundColor: '#D4AF37' }}></div>
                                </div>
                            </div>
                            <div className='summary-card'>
                                <span className='summary-label'>Total Spent</span>
                                <span className='summary-value' style={{ color: '#FF6B6B' }}>${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                <div className='progress-bar-bg'>
                                    <div className='progress-bar-fill' style={{ width: `${Math.min((totalSpent / displayedSalary) * 100, 100)}%`, backgroundColor: '#FF6B6B' }}></div>
                                </div>
                            </div>
                            <div className='summary-card'>
                                <span className='summary-label'>Remaining</span>
                                <span className='summary-value' style={{ color: '#4ECDC4' }}>${remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                <div className='progress-bar-bg'>
                                    <div className='progress-bar-fill' style={{ width: `${Math.min((remaining / displayedSalary) * 100, 100)}%`, backgroundColor: '#4ECDC4' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Spending Insights */}
                        <div className='insights-card'>
                            <div className='insights-header'>
                                <span>📉</span> Spending Insights
                            </div>
                            {/* Placeholder for Chart */}
                            <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 20px' }}>
                                <span style={{ fontSize: '10px', color: '#666' }}>Chart Placeholder</span>
                            </div>

                            <div className='insights-stats-row'>
                                <div className='insight-stat-box'>
                                    <div className='insight-icon'>📅</div>
                                    <div className='insight-text'>
                                        <span className='insight-label'>HIGHEST EXPENSE DAY</span>
                                        <span className='insight-value'>{highestExpenseDay}</span>
                                    </div>
                                </div>
                                <div className='insight-stat-box'>
                                    <div className='insight-icon'>🔼</div>
                                    <div className='insight-text'>
                                        <span className='insight-label'>TOP CATEGORY</span>
                                        <span className='insight-value'>{topCategory}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='financial-right-col'>
                        <div className='transactions-panel'>
                            <div className='transactions-header'>
                                <span>🕒</span> Recent Transactions
                            </div>
                            <div className='transaction-list'>
                                {recentTransactions.map((tx, idx) => (
                                    <div key={idx} className='transaction-item'>
                                        <div className='trans-info'>
                                            <div className='trans-icon-bg'>🛍️</div>
                                            <div className='trans-details'>
                                                <span className='trans-name'>{tx.name || "Expense"}</span>
                                                <span className='trans-date'>{tx.date}</span>
                                            </div>
                                        </div>
                                        <span className='trans-amount' style={{ color: '#FF6B6B' }}>-${tx.amount}</span>
                                    </div>
                                ))}
                                {recentTransactions.length === 0 && <p style={{ color: '#aaa', textAlign: 'center' }}>No transactions yet.</p>}
                            </div>

                            <button className='manage-btn' onClick={() => navigate('/Dashboard')}>
                                Manage Daily Expenses &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
