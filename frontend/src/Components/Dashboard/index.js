import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {reactLocalStorage} from 'reactjs-localstorage';
import Budget from '../Budget';

function Dashboard() {
    const history = useHistory();
    useEffect(()=>{
        if(reactLocalStorage.get('loggedIn') === 'false'){
            console.log('asd')
            history.push('/');
        }
    },[])

    const logout = () => {
        reactLocalStorage.set('loggedIn', false);
        history.push('/');
    }

    return (
        <div>
            <div className="row text-white dashboard-toolbar">
                <div className="col">
                    <p className="title">Dashboard</p>
                </div>
                <div className="col">
                    <button onClick={logout} className="btn btn-primary logout">Logout</button>
                </div>
            </div>
            <div className="main-content">
                <Budget/>
            </div>

        </div>
    );
}

export default Dashboard;
