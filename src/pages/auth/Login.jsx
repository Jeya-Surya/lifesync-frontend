import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authApi.login(form);
            const { token, name, email, role } = await res.data;
            login(token, { name, email, role });
            toast.success(`Welcome back, ${name}!`);
            navigate('/dashboard');
        } catch (err) {
            toast.error(
                err.response?.data?.message || 'Invalid email or password'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center
                    justify-center bg-surface-3 px-4">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-primary-light mb-1">
                        🔄 LifeSync
                    </h1>
                    <p className="text-text-muted text-sm">
                        Your personal life OS
                    </p>
                </div>

                {/* Card */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-text-primary mb-1">
                        Welcome back
                    </h2>
                    <p className="text-text-muted text-sm mb-6">
                        Sign in to your account
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium
                                text-text-secondary mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="example@lifesync.com"
                                required
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium
                                text-text-secondary mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="input-field"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full mt-2"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>

                    </form>

                    <p className="text-center text-sm text-text-muted mt-6">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-primary-light font-medium
                         hover:text-primary transition-colors"
                        >
                            Create one
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;