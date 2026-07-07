import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { ScaleLoader } from "react-spinners";
import profileImg from "./assets/profile.png";
import { API_URL } from "./config.js";
import { useAuth } from "./context/AuthContext.jsx";

function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat, theme, setTheme, autoCopyCode, setAutoCopyCode, responseSpeed, setResponseSpeed } = useContext(MyContext);
    const { logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const settingsPanelRef = useRef(null);

    const getReply = async () => {
        setLoading(true);
        setNewChat(false);

        console.log("message ", prompt, " threadId ", currThreadId);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch(`${API_URL}/api/chat`, options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }

    //Append new chat to prevChats
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                }, {
                    role: "assistant",
                    content: reply
                }]
            ));
        }

        setPrompt("");
    }, [reply]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            const clickedInsideDropdown = dropdownRef.current?.contains(event.target);
            const clickedInsideSettings = settingsPanelRef.current?.contains(event.target);
            const clickedProfile = event.target.closest('.userIconDiv');

            if (!clickedInsideDropdown && !clickedInsideSettings && !clickedProfile) {
                setIsOpen(false);
                setIsSettingsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleProfileClick = (event) => {
        event.stopPropagation();
        setIsOpen((prev) => !prev);
        setIsSettingsOpen(false);
    };

    const handleSettingsClick = (event) => {
        event.stopPropagation();
        setIsOpen(false);
        setIsSettingsOpen(true);
    };

    const handleThemeChange = (value) => {
        setTheme(value);
    };

    const handleAutoCopyToggle = () => {
        setAutoCopyCode((prev) => !prev);
    };

    const handleResponseSpeedChange = (value) => {
        setResponseSpeed(value);
    };

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>ByteChat <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <div className="userIcon">
                        <img src={profileImg} alt="Profile" className="profileImage" />
                    </div>
                </div>
            </div>
            {
                isOpen &&
                <div ref={dropdownRef} className="dropDown">
                    <div className="dropDownItem" onClick={handleSettingsClick}><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem" onClick={logout}><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
            {
                isSettingsOpen &&
                <div ref={settingsPanelRef} className="settingsPanel">
                    <div className="settingsPanelHeader">Theme</div>
                    <div className={`themeOption ${theme === 'dark' ? 'active' : ''}`} onClick={() => handleThemeChange('dark')}>
                        <span>Dark Mode</span>
                        <input type="radio" checked={theme === 'dark'} readOnly />
                    </div>
                    <div className={`themeOption ${theme === 'light' ? 'active' : ''}`} onClick={() => handleThemeChange('light')}>
                        <span>Light Mode</span>
                        <input type="radio" checked={theme === 'light'} readOnly />
                    </div>
                    <div className="settingsDivider"></div>
                    <div className="settingsPanelHeader">AI Response Speed</div>
                    <div className={`themeOption ${responseSpeed === 'fast' ? 'active' : ''}`} onClick={() => handleResponseSpeedChange('fast')}>
                        <span>Fast</span>
                        <input type="radio" checked={responseSpeed === 'fast'} readOnly />
                    </div>
                    <div className={`themeOption ${responseSpeed === 'normal' ? 'active' : ''}`} onClick={() => handleResponseSpeedChange('normal')}>
                        <span>Normal</span>
                        <input type="radio" checked={responseSpeed === 'normal'} readOnly />
                    </div>
                    <div className={`themeOption ${responseSpeed === 'slow' ? 'active' : ''}`} onClick={() => handleResponseSpeedChange('slow')}>
                        <span>Slow</span>
                        <input type="radio" checked={responseSpeed === 'slow'} readOnly />
                    </div>
                    <div className="settingsDivider"></div>
                    <label className="toggleOption">
                        <span>Auto Copy Code Button</span>
                        <input type="checkbox" checked={autoCopyCode} onChange={handleAutoCopyToggle} />
                    </label>
                </div>
            }
            <Chat></Chat>

            <ScaleLoader color="#fff" loading={loading}>
            </ScaleLoader>

            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                    >

                    </input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-arrow-up"></i></div>
                </div>
                <p className="info">
                    ByteChat can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;