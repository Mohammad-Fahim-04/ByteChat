import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../Auth.css';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        try {
            register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-shell">
            <div className="auth-card">
                <h1>Register</h1>
                <p>Create your account to get started.</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <label>
                        Name
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </label>
                    <label>
                        Email
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </label>
                    <label>
                        Password
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </label>
                    {error && <p className="auth-error">{error}</p>}
                    <button type="submit" className="auth-submit">Create account</button>
                </form>
                <div className="auth-links">
                    <Link to="/login">Already have an account?</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;