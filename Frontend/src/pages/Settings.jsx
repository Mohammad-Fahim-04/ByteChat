import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v1 as uuidv1 } from 'uuid';
import { MyContext } from '../MyContext.jsx';
import '../Settings.css';

function Settings() {
    const navigate = useNavigate();
    const { theme, setTheme, setAllThreads, setPrevChats, setReply, setPrompt, setCurrThreadId, setNewChat } = useContext(MyContext);
    const [isClearing, setIsClearing] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const handleThemeChange = (value) => {
        setTheme(value);
    };

    const resetChatState = () => {
        setAllThreads([]);
        setPrevChats([]);
        setReply(null);
        setPrompt('');
        setCurrThreadId(uuidv1());
        setNewChat(true);
    };

    const handleClearAllChats = async () => {
        const confirmed = window.confirm('Are you sure you want to delete all chats?');
        if (!confirmed) return;

        setIsClearing(true);
        setStatusMessage('');

        try {
            const response = await fetch('http://localhost:8080/api/thread', { method: 'DELETE' });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || 'Unable to clear chats right now.');
            }

            resetChatState();
            setStatusMessage(data?.message || 'All chats deleted successfully.');
        } catch (error) {
            console.log(error);
            setStatusMessage(error.message || 'Unable to clear chats right now.');
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <div className="settings-shell">
            <div className="settings-card">
                <div className="settings-header">
                    <button className="settings-back" onClick={() => navigate('/')}>
                        <i className="fa-solid fa-arrow-left"></i> Back
                    </button>
                    <h1>Settings</h1>
                </div>

                <div className="settings-section">
                    <h2>Theme</h2>
                    <div className="settings-options">
                        <label className={`settings-option ${theme === 'dark' ? 'active' : ''}`}>
                            <input
                                type="radio"
                                name="theme"
                                value="dark"
                                checked={theme === 'dark'}
                                onChange={() => handleThemeChange('dark')}
                            />
                            <span>Dark</span>
                        </label>
                        <label className={`settings-option ${theme === 'light' ? 'active' : ''}`}>
                            <input
                                type="radio"
                                name="theme"
                                value="light"
                                checked={theme === 'light'}
                                onChange={() => handleThemeChange('light')}
                            />
                            <span>Light</span>
                        </label>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Chats</h2>
                    <button className="settings-danger" onClick={handleClearAllChats} disabled={isClearing}>
                        {isClearing ? 'Clearing...' : 'Clear All Chats'}
                    </button>
                    {statusMessage ? (
                        <p className={`settings-status ${statusMessage.includes('success') ? 'success' : 'error'}`}>
                            {statusMessage}
                        </p>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default Settings;
