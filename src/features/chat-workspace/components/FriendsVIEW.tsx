import { useState } from "react";
import { User, MessageSquare, Compass, HelpCircle, Inbox, Bell, Check, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { post } from "../../../shared/api/client";

// Utility for class merging
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const TABS = [
    { id: "online", label: "在线" },
    { id: "all", label: "全部" },
    { id: "pending", label: "待办" },
    { id: "blocked", label: "已屏蔽" },
];

export default function FriendsView() {
    const [activeTab, setActiveTab] = useState("add_friend");
    const [username, setUsername] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSendRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;

        try {
            // Send network request to Apifox Mock Server
            await post("/api/v1/friends/requests", { username });
            setStatus("success");
            setTimeout(() => setStatus("idle"), 3000);
            setUsername("");
        } catch {
            setStatus("error");
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-zinc-50 text-zinc-900 border-l border-zinc-200">
            {/* Top Navigation Bar */}
            <header className="h-12 w-full flex items-center justify-between px-4 border-b border-zinc-200 flex-shrink-0 bg-white">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 font-semibold pr-4 border-r border-zinc-200 text-zinc-900">
                        <User size={24} className="text-zinc-500" />
                        <span>Friends</span>
                    </div>

                    <nav className="flex items-center gap-4 text-sm font-medium text-zinc-500">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "hover:bg-zinc-100 hover:text-zinc-900 px-2 py-1 rounded transition-colors",
                                    activeTab === tab.id && "bg-zinc-200 text-zinc-900 cursor-default"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                        <button
                            onClick={() => setActiveTab("add_friend")}
                            className={cn(
                                "px-2 py-1 rounded transition-colors font-semibold",
                                activeTab === "add_friend"
                                    ? "bg-transparent text-purple-600"
                                    : "bg-purple-600 text-white hover:opacity-90"
                            )}
                        >
                            Add Friend
                        </button>
                    </nav>
                </div>

                <div className="flex items-center gap-4 text-zinc-500">
                    <button className="hover:text-zinc-900"><MessageSquare size={24} /></button>
                    <div className="w-[1px] h-6 bg-zinc-200" />
                    <button className="hover:text-zinc-900"><Inbox size={24} /></button>
                    <button className="hover:text-zinc-900"><HelpCircle size={24} /></button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {activeTab === "add_friend" ? (
                    <div className="flex-1 flex flex-col px-8 py-6 max-w-[800px] overflow-y-auto">
                        <h1 className="text-zinc-900 text-base font-bold uppercase tracking-wide mb-2">ADD FRIEND</h1>
                        <p className="text-zinc-500 text-sm mb-4">You can add friends with their Discord username.</p>

                        <form
                            onSubmit={handleSendRequest}
                            className={cn(
                                "w-full bg-zinc-100 rounded-lg p-3 flex items-center gap-4 border border-zinc-200 transition-colors focus-within:border-purple-600",
                                status === "success" && "border-green-500 focus-within:border-green-500"
                            )}
                        >
                            <input
                                type="text"
                                placeholder="You can add friends with their Discord username."
                                className="flex-1 bg-transparent border-none outline-none text-zinc-900 placeholder-zinc-400 text-base font-medium"
                                value={username}
                                onChange={e => {
                                    setUsername(e.target.value);
                                    setStatus("idle");
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!username.trim()}
                                className={cn(
                                    "px-4 py-2 rounded text-sm font-medium transition-colors text-white",
                                    username.trim()
                                        ? "bg-purple-600 hover:opacity-90"
                                        : "bg-purple-600 opacity-50 cursor-not-allowed",
                                    status === "success" && "bg-green-500"
                                )}
                            >
                                Send Friend Request
                            </button>
                        </form>

                        {status === "success" && (
                            <p className="text-green-500 text-sm mt-2">Success! Your friend request to {username} was sent.</p>
                        )}

                        <div className="w-full h-[1px] bg-zinc-200 my-6" />

                        <h2 className="text-zinc-900 text-base font-bold mb-4">Other places to make friends</h2>
                        <p className="text-zinc-500 text-sm mb-4 max-w-lg">
                            Check out public servers for games, cooking, music, anime, and more.
                        </p>

                        <button className="w-fit flex items-center gap-3 bg-white border border-zinc-200 hover:bg-zinc-50 p-4 rounded-lg transition-colors group">
                            <div className="w-12 h-12 bg-purple-600 rounded flex items-center justify-center text-white">
                                <Compass size={28} />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-zinc-900 font-medium group-hover:underline">Explore Discoverable Servers</span>
                            </div>
                            <Compass className="text-zinc-400 ml-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                ) : activeTab === "pending" ? (
                    <div className="flex-1 flex flex-col px-8 py-6 max-w-[800px] overflow-y-auto">
                        <h1 className="text-zinc-500 text-sm font-bold uppercase tracking-wide mb-4 border-b border-zinc-200 pb-2">Pending — 1</h1>

                        <div className="flex items-center justify-between p-3 hover:bg-zinc-100 rounded-lg transition-colors border-t border-zinc-200 mt-[-1px]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                                    A
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-zinc-900 font-semibold flex items-center gap-1">
                                        Alex Morgan
                                        <span className="text-xs text-zinc-500 font-normal">#1234</span>
                                    </span>
                                    <span className="text-xs text-zinc-500">Incoming Friend Request</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="w-9 h-9 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-green-600 hover:bg-green-50 transition-colors">
                                    <Check size={20} />
                                </button>
                                <button className="w-9 h-9 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-red-600 hover:bg-red-50 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center flex-col gap-4 text-zinc-400">
                        <img src="https://api.dicebear.com/7.x/identicon/svg?seed=wumpus&backgroundColor=transparent" className="w-48 h-48 opacity-50 grayscale" alt="Empty" />
                        <p className="text-center mt-4">Wumpus is waiting.</p>
                    </div>
                )}

                {/* Right Active Now Sidebar */}
                <div className="w-[360px] bg-white border-l border-zinc-200 flex-shrink-0 flex flex-col p-4 hidden lg:flex">
                    <h2 className="text-zinc-900 font-bold text-xl mb-4">Active Now</h2>
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 -mt-20">
                        <h3 className="text-zinc-900 font-bold text-base mb-2">It's quiet for now...</h3>
                        <p className="text-zinc-500 text-sm leading-tight">
                            When a friend starts an activity—like playing a game or hanging out on voice—we'll show it here!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
