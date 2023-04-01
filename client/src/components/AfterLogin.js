import React from "react";


const AfterLogin = () => {

    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.reload()
    }


    return (
        <div>
            <h1>Zalogowałeś się!</h1>
            <button onClick={handleLogout}>Wyloguj się</button>
        </div>
    )
}

export default AfterLogin