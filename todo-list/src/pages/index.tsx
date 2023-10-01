import { useState, useEffect } from 'react';
import { getCookie } from "cookies-next";

import { loginService } from './service/login';

export default Home;

function Home() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        loginService.getLoggedUser(getCookie('sessionToken'))
            .then(response => setUser(response.data.user));
    }, []);

    return (
        <div className="card mt-4">
            {user && 
                <div className="card-body">
                    <h6>Hello {user.name}!</h6>
                    <br/>
                    <div className="">
                        <div>Welcome to TODO List.</div>
                        <br/>
                        <div>Please, select go to the Project menu and start to track tasks of all your projects :)</div>
                    </div>
                </div>
            } {!user && <div className=""></div>}
        </div>
    );
}
