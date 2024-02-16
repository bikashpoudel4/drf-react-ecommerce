import React, { useState, useEffect } from "react";
import { login } from "../../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    useEffect(() => {
        if (isLoggedIn()) {
            navigate("/");
        }
    });

    const resetForm = () => {
        setEmail("");
        setPassword("");
    };

    const handleLogin = (event) => {
        event.preventDefault();
        setIsLoading(true);

        const { error } = login(email, password);
        if (error) {
            alert(error);
        } else {
            navigate("/");
            resetForm();
        }
        setIsLoading(false);
    };

    return (
        <div>
            <h2>Welcome Back</h2>
            <p>Login To Continue</p>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <br />
                <br />
                <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <br />
                <br />

                <button type="submit">Login</button>
                <hr/>
                <Link to={'/forgot-password'}>Forgot Password</Link>
            </form>
        </div>
    );
}

export default Login;
