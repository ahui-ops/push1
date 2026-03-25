import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // React Router hook for navigation
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simulate Login / Signup authentication process
        if (isLogin) {
            console.log('Login successful:', { email, password });
        } else {
            console.log('Sign up successful:', { email, password, confirmPassword });
        }

        // Save a token to browser storage so our ProtectedRoute knows we are logged in!
        localStorage.setItem("access_token", "mock_user_token");

        // Redirect the user successfully into the app
        navigate("/chat-workspace");
    };

    return (
        <div className="flex items-center justify-center bg-zinc-50 p-4" style={{ height: "100vh" }}>
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg border border-zinc-200 p-8 shadow-lg">
                    <div className="mb-8 text-center">
                        <h1 className="mb-2 text-2xl font-bold text-zinc-900">Welcome</h1>
                        <p className="text-zinc-500">
                            {isLogin ? 'Sign in to your account' : 'Create a new account'}
                        </p>
                    </div>

                    <div className="mb-6 flex gap-2 rounded-md bg-zinc-100 p-1">
                        <button
                            type="button"
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 rounded px-4 py-2 transition-all font-medium ${isLogin
                                    ? 'bg-white shadow-sm text-zinc-900'
                                    : 'text-zinc-500 hover:text-zinc-900'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 rounded px-4 py-2 transition-all font-medium ${!isLogin
                                    ? 'bg-white shadow-sm text-zinc-900'
                                    : 'text-zinc-500 hover:text-zinc-900'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-zinc-900 font-medium text-sm">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-4 py-2.5 outline-none transition-colors focus:border-purple-600 focus:bg-white text-zinc-900"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-1.5 block text-zinc-900 font-medium text-sm">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-4 py-2.5 outline-none transition-colors focus:border-purple-600 focus:bg-white text-zinc-900"
                            />
                        </div>

                        {!isLogin && (
                            <div>
                                <label htmlFor="confirmPassword" className="mb-1.5 block text-zinc-900 font-medium text-sm">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    required
                                    className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-4 py-2.5 outline-none transition-colors focus:border-purple-600 focus:bg-white text-zinc-900"
                                />
                            </div>
                        )}

                        {isLogin && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="text-sm text-purple-600 hover:underline font-medium"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="mt-6 w-full rounded-md bg-purple-600 px-4 py-2.5 text-white font-medium transition-opacity hover:opacity-90"
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-zinc-500">
                            {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-purple-600 hover:underline font-medium"
                            >
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
