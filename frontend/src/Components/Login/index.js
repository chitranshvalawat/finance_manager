import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { backurl, isauth, userData } from '../../constants';
import { reactLocalStorage } from 'reactjs-localstorage';

function Login() {
    const history = useHistory();

    const [credentials, setCredentials] = useState({
        userName: '',
        password: '',
    });

    const [message, setMessage] = useState('');

    useEffect(() => {
        if (reactLocalStorage.get('loggedIn') === 'true') {
            history.push('/dashboard');
        }
    }, []);

    const submitLogin = async (e) => {
        e.preventDefault();
        const { userName, password } = credentials;
        if (userName && password) {
            let authString = `${userName}:${password}`
            let headers = new Headers();
            headers.set('Authorization', 'Basic ' + btoa(authString))
            await fetch(`${backurl}/auth/`, { method: 'GET', headers: headers })
                .then(data => data.json())
                .then(data => (data && data['user']))
           
                .then(data => {
                    if (data) {
                        console.log('isauth')
                        reactLocalStorage.set('loggedIn', true);
                        reactLocalStorage.set('credentials',authString);
                        history.push('/dashboard');
                    } else {
                        console.log(data)
                        showMessage('Invalid credentials!');
                    }
                })

        } else {
            showMessage('Please enter all credentials!');
        }
    }

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage('');
        }, 3000);
    }
    const routeChange = () =>{ 
        window.location.href =`${backurl}/accounts/register`      }

    return (
        <div>
            <div className="global-container">
                <div className="card login-form">
                    {message &&
                        <div className="alert alert-danger m-4">
                            {message}
                        </div>
                    }

                    <div className="card-body">

                        <h3 className="card-title display-3 text-center">LOG IN</h3>
                        <div className="card-text">
                            <form onSubmit={submitLogin}>
                                <div className="form-group">
                                    <label >Username</label>
                                    <input name="userName" onChange={(e) => setCredentials(
                                        { ...credentials, userName: e.target.value }
                                    )}
                                        className="form-control form-control-sm" />
                                </div>
                                <div className="form-group mt-4">
                                    <label >Password</label>
                                    <input name="password" onChange={(e) => setCredentials(
                                        { ...credentials, password: e.target.value }
                                    )} type="password"
                                        className="form-control form-control-sm" id="exampleInputPassword1" />
                                </div>
                                <button type="submit" className="btn btn-primary">Sign in</button>
                                <button onClick={routeChange} className="btn btn-outline-secondary">Register</button>
                               
                            </form>
                            
                            
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Login;
