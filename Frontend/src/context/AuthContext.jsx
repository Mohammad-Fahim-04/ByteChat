import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('bytechat_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                localStorage.removeItem('bytechat_user');
            }
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const storedUsers = JSON.parse(localStorage.getItem('bytechat_users') || '[]');
        const foundUser = storedUsers.find((u) => u.email === email && u.password === password);

        if (!foundUser) {
            throw new Error('Invalid email or password');
        }

        const userData = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
        setUser(userData);
        localStorage.setItem('bytechat_user', JSON.stringify(userData));
        return userData;
    };

    const register = (name, email, password) => {
        const storedUsers = JSON.parse(localStorage.getItem('bytechat_users') || '[]');

        if (storedUsers.some((u) => u.email === email)) {
            throw new Error('An account with this email already exists');
        }

        const newUser = { id: Date.now().toString(), name, email, password };
        const updatedUsers = [...storedUsers, newUser];
        localStorage.setItem('bytechat_users', JSON.stringify(updatedUsers));

        const userData = { id: newUser.id, name, email };
        setUser(userData);
        localStorage.setItem('bytechat_user', JSON.stringify(userData));
        return userData;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('bytechat_user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
