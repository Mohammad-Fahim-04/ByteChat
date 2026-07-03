import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../Auth.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        try {
            login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-shell">
            <div className="auth-card">
                <h1>Login</h1>
                <p>Sign in to continue to ByteChat.</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <label>
                        Email
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </label>
                    <label>
                        Password
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </label>
                    {error && <p className="auth-error">{error}</p>}
                    <button type="submit" className="auth-submit">Log in</button>
                </form>
                <div className="auth-links">
                    <Link to="/register">Create an account</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;