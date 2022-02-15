import React from 'react'

export default function PageNotFound() {
    function submitHandler(e) {
        e.preventDefault();
        var request = new XMLHttpRequest();
        request.open('POST', '/api/login', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.withCredentials = true;
        request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                const data = JSON.parse(this.response)
                if (!data.ok) {
                    alert("fetch token failed");
                    console.log(this.response);
                    return;
                }
                window.localStorage.setItem("Server-Agent-Token", data.token)
                window.location.href = "/"
            } else {
                // FIXME: catch ajax error
            }
        };

        request.onerror = function (e) {
            console.log(e);
            alert("Login request error, please try again later!")
        };

        request.send(JSON.stringify(Object.fromEntries(new FormData(e.target))));
    }
    return (
        <form id="login-form" onSubmit={submitHandler}>
            <label for="form-user">User: </label>
            <input type="text" id="form-user" name="user" value="admin" />
            <label for="form-pass">Password: </label>
            <input type="password" id="form-pass" name="pass" />
            <button type="submit">Login</button>
        </form>
    )
}