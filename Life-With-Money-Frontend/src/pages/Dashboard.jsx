import React,{useState} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';
import logo from '../assets/logo.png'
import dashboard from '../assets/dashboard.png'
import budgets from '../assets/budgets.png'
import profile from '../assets/Profile.png'
import arrow from '../assets/arrow.png'
import { Link } from 'react-router-dom';




export default function Dashboard() {
  const today=new Date().toISOString().split('T')[0];

  const [selecteddate,setselecteddate]=useState(today);

  const [expenses,setexpenses]=useState([
    {name:'',amount:''},
    {name:'',amount:''}
  ]);

  const handleDateClick = (info) => {
    const date=info.dateStr;
    setselecteddate(date);
    if (allexpenses[date]){
      setexpenses(allexpenses[date]);
    }else{
       setexpenses([
        { name: '', amount: '' },
        { name: '', amount: '' }
       ]
       );
    }
  };

  const [allexpenses,setallexpenses]=useState({});

  const saveexpenses = () => {
    setallexpenses({
      ...allexpenses,
      [selecteddate]: expenses
    });
    alert('Expenses saved for ' + selecteddate);
  };

  const updateexpense=(index,feild,value)=>{
    const update=[...expenses];
    update[index][feild]=value;
    setexpenses(update);
  };

const addexpense=()=>{
  setexpenses([...expenses,{name:'',amount:''}]);
};

const totalamount=expenses.reduce((sum,item)=>{
  const amount=parseFloat(item.amount);
  return sum+(isNaN(amount)?0:amount);
},0);

const removeexpense =()=>{
  if(expenses.length<=1) return;
  setexpenses(expenses.slice(0,-1));
}
  return (
    <div className="dashboard-container">
      <div className='side-navigation'>
        <div className='side-heading'>
          <img src={logo} alt="logo" />
          <h1>Life With Money</h1>
        </div>
        <div className='side-options'>
          <div className='dashboard'>
            <img src={dashboard} alt="dashboard logo" />
            <p>Dashboard</p>
          </div>
          <div className='budgets'>
            <img src={budgets} alt="budgets logo" />
            <p>Budgets</p>
          </div>
          <div className='profiles'>
            <img src={profile} alt="profile logo" />
            <p>Profiles</p>
          </div>
        </div>
        <Link to="/"><button className='log-out'>
          Logout
          <img src={arrow} alt="arrow symbol" />
        </button></Link>
        
      </div>
      <div className='calender-container'>
          <div className='calender-title'>
            <h1>Financial Calendar</h1>
            <h2>Track daily expenses</h2>
          </div>
          <div className='calender'>
            <FullCalendar
                plugins={[dayGridPlugin,interactionPlugin]}
                initialView="dayGridMonth"
                dateClick={handleDateClick}
                dayCellClassNames={(arg) => arg.dateStr === selecteddate ? ['selected-day'] : []}
            />
            
          </div>
          <div className='calender-descrition'>
            <p>Track Your Money. Control Your Life.</p>
          </div>
      </div>
      <div className='log-savings'>
        <div className='log-title'>
          <h1>Expense Entry</h1>
          <p>Date: <strong>{selecteddate}</strong></p>
        </div>
        <div className='log-entry'>
          {expenses.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Category name"
              value={item.name}
              onChange={(e) =>
                updateexpense(index, 'name', e.target.value)
              }
              className='category'
            />

            <input
              type="number"
              placeholder="Amount"
              value={item.amount}
              onChange={(e) =>
                updateexpense(index, 'amount', e.target.value)
              }
              className='amount'
            />
          </div>
        ))}
        </div>
        <div>
          <h3>Total :<b> {totalamount}</b></h3>
        </div>
        <div className='save-add-button'>
        <button onClick={addexpense}>+ Add Category</button>
        <button onClick={removeexpense}>- Remove Category</button>
        </div>
        <div className='save-btn'>
          <button onClick={saveexpenses}>Save Expenses</button>
        </div>
      </div>
    </div>
  );
}
