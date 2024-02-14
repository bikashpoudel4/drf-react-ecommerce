import React, { useState, useEffect } from "react";
import { login } from "../../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    console.log(username);

    const navigate = useNavigate();
    return (
        <div>
            <h2>Welcome Back</h2>
            <p>Login To Continue</p>
        </div>
    );
}

export default Login;
