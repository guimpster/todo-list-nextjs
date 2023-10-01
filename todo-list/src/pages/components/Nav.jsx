import { useState, useEffect } from 'react';
import { useRouter } from "next/router";

import { MdPerson } from "react-icons/md";


import { NavLink } from '.';
import { loginService } from '../service/login';
import { getCookie } from "cookies-next";

export { Nav };

function Nav() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        loginService.getLoggedUser(getCookie('sessionToken'))
                .then(response => setUser(response.data.user));

        const handleStop = () => {
            loginService.getLoggedUser(getCookie('sessionToken'))
                .then(response => setUser(response.data.user));
        };

        router.events.on("routeChangeComplete", handleStop);
        router.events.on("routeChangeError", handleStop);
        return () => {
            router.events.off("routeChangeComplete", handleStop);
            router.events.off("routeChangeError", handleStop);
        }
    }, [router.events]);

    function logout() {
        loginService.logout();
    }
    
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className='navbar-brand'>TODO List</div>
            {user && <div className="navbar-nav mr-auto">
                <NavLink href="/" exact className="nav-item nav-link">Home</NavLink>
                <NavLink href="/projects" exact className="nav-item nav-link">Projects</NavLink>
                <a onClick={logout} className="nav-item nav-link">Logout</a>
            </div>}
            {user && <div className="navbar navbar-brand navbar-expand-sm">
                <div style={{display: "flex", justifyContent: "center"}}>
                    <MdPerson size={30}/><span>  {user?.name}</span>
                </div>
            </div>}
        </nav>
    );
}