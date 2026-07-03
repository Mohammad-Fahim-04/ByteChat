import "./Chat.css";
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function CodeBlock({ children, autoCopyCode, ...props }) {
    const [buttonLabel, setButtonLabel] = useState("Copy Code");

    const getTextContent = (node) => {
        if (typeof node === "string" || typeof node === "number") {
            return String(node);
        }

        if (Array.isArray(node)) {
            return node.map(getTextContent).join("");
        }

        if (node && typeof node === "object" && "props" in node) {
            return getTextContent(node.props.children);
        }

        return "";
    };

    const copyCode = async () => {
        const codeText = getTextContent(children);

        try {
            await navigator.clipboard.writeText(codeText);
            setButtonLabel("Copied!");
            window.setTimeout(() => setButtonLabel("Copy Code"), 2000);
        } catch (error) {
            console.log(error);
            setButtonLabel("Copy Failed");
            window.setTimeout(() => setButtonLabel("Copy Code"), 2000);
        }
    };

    return (
        <div className="codeBlockWrapper">
            {autoCopyCode ? (
                <button type="button" className="copyCodeButton" onClick={copyCode}>
                    {buttonLabel}
                </button>
            ) : null}
            <pre {...props}>{children}</pre>
        </div>
    );
}

function Chat() {
    const { newChat, prevChats, reply, autoCopyCode, responseSpeed } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    const speedMap = {
        fast: 10,
        normal: 30,
        slow: 60
    };

    const renderMarkdown = (content) => {
        return (
            <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                components={{
                    pre: ({ children, ...props }) => (
                        <CodeBlock autoCopyCode={autoCopyCode} {...props}>
                            {children}
                        </CodeBlock>
                    )
                }}
            >
                {content}
            </ReactMarkdown>
        );
    };

    useEffect(() => {
        if (reply === null) {
            setLatestReply(null); //prevchat load
            return;
        }

        if (!prevChats?.length) return;

        const content = reply.split(" "); //individual words
        const delay = speedMap[responseSpeed] ?? 30;

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" "));

            idx++;
            if (idx >= content.length) clearInterval(interval);
        }, delay);

        return () => clearInterval(interval);

    }, [prevChats, reply])

    return (
        <>
            {newChat && <h1>Start a New Chat!</h1>}
            <div className="chats">
                {
                    prevChats?.slice(0, -1).map((chat, idx) =>
                        <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
                            {
                                chat.role === "user" ?
                                    <p className="userMessage">{chat.content}</p> :
                                    <div className="gptMessage markdownContent">
                                        {renderMarkdown(chat.content)}
                                    </div>
                            }
                        </div>
                    )
                }

                {
                    prevChats.length > 0 && (
                        <>
                            {
                                latestReply === null ? (
                                    <div className="gptDiv" key={"non-typing"} >
                                        <div className="gptMessage markdownContent">
                                            {renderMarkdown(prevChats[prevChats.length - 1].content)}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="gptDiv" key={"typing"} >
                                        <div className="gptMessage markdownContent">
                                            {renderMarkdown(latestReply)}
                                        </div>
                                    </div>
                                )

                            }
                        </>
                    )
                }

            </div>
        </>
    )
}

export default Chat;