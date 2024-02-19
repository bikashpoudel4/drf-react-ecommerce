import React, { useState, useEffect } from "react";
import { login } from "../../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me" checkbox
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isLoggedIn()) {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        // Retrieve stored credentials and pre-fill the form if available
        const storedUsername = localStorage.getItem("rememberedUsername");
        const storedPassword = localStorage.getItem("rememberedPassword");
        if (storedUsername && storedPassword) {
            setUsername(storedUsername);
            setPassword(storedPassword);
        }
    }, []);

    const resetForm = () => {
        setUsername("");
        setPassword("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await login(username, password);
        if (error) {
            alert(error);
        } else {
            navigate("/");
            resetForm();
            // Store credentials if "Remember Me" is checked
            if (rememberMe) {
                localStorage.setItem("rememberedUsername", username);
                localStorage.setItem("rememberedPassword", password);
            } else {
                // Clear stored credentials if "Remember Me" is unchecked
                localStorage.removeItem("rememberedUsername");
                localStorage.removeItem("rememberedPassword");
            }
        }
        setIsLoading(false);
    };

    return (
        <section>
            <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
                <div className="container">
                    {/* Section: Login form */}
                    <section className="">
                        <div className="row d-flex justify-content-center">
                            <div className="col-xl-5 col-md-8">
                                <div className="card rounded-5">
                                    <div className="card-body p-4">
                                        <h3 className="text-center">Login</h3>
                                        <br />

                                        <div className="tab-content">
                                            <div
                                                className="tab-pane fade show active"
                                                id="pills-login"
                                                role="tabpanel"
                                                aria-labelledby="tab-login"
                                            >
                                                <form onSubmit={handleLogin}>
                                                    {/* Email input */}
                                                    <div className="form-outline mb-4">
                                                        <label
                                                            className="form-label"
                                                            htmlFor="Full Name"
                                                        >
                                                            Email Address
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="username"
                                                            name="username"
                                                            value={username}
                                                            onChange={(e) =>
                                                                setUsername(
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="form-control"
                                                        />
                                                    </div>

                                                    {/* Password input */}
                                                    <div className="form-outline mb-4">
                                                        <label
                                                            className="form-label"
                                                            htmlFor="loginPassword"
                                                        >
                                                            Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            id="password"
                                                            name="password"
                                                            value={password}
                                                            onChange={(e) =>
                                                                setPassword(
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="form-control"
                                                        />
                                                    </div>

                                                    {/* Remember Me checkbox */}
                                                    <div className="form-check mb-4">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="rememberMe"
                                                            checked={rememberMe}
                                                            onChange={(e) =>
                                                                setRememberMe(
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="rememberMe"
                                                        >
                                                            Remember Me
                                                        </label>
                                                    </div>

                                                    {/* Submit button */}
                                                    <button
                                                        className="btn btn-primary w-100"
                                                        type="submit"
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <span className="mr-2 ">
                                                                    Processing...
                                                                </span>
                                                                <i className="fas fa-spinner fa-spin" />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="mr-2">
                                                                    Sign In{" "}
                                                                </span>
                                                                <i className="fas fa-sign-in-alt" />
                                                            </>
                                                        )}
                                                    </button>

                                                    {/* Additional links */}
                                                    <div className="text-center">
                                                        <p className="mt-4">
                                                            Don't have an
                                                            account?{" "}
                                                            <Link to="/register">
                                                                Register
                                                            </Link>
                                                        </p>
                                                        <p className="mt-0">
                                                            <Link
                                                                to="/forgot-password"
                                                                className="text-danger"
                                                            >
                                                                Forgot Password?
                                                            </Link>
                                                        </p>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </section>
    );
};

export default Login;
