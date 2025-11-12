'use client';

import { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleMode = () => setIsLogin(!isLogin);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isLogin ? 'Login' : 'Register', formData);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* 🎬 Video Background */}
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/dark.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* 🏠 Back Button */}
      <Link href="/" className="absolute top-6 left-6 flex items-center text-[#25abc2] hover:underline z-10">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
      </Link>

      {/* 🌸 Form Box */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className="flex flex-col items-center text-center p-8 rounded-2xl shadow-2xl backdrop-blur-lg"
          style={{
            backgroundColor: '#f6f5f1',
            border: '2px solid #264143',
            boxShadow: '3px 4px 0px 1px #eec78e',
            borderRadius: '20px',
          }}
        >
          <p className="text-[#264143] font-extrabold text-2xl mb-6">
            {isLogin ? 'SIGN IN' : 'SIGN UP'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-5">
            {!isLogin && (
              <div className="flex flex-col text-left">
                <label className="font-semibold text-[#264143] mb-1">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-[#264143]" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="outline-none border-2 border-[#264143] shadow-[3px_4px_0px_1px_#eec78e] w-[290px] p-3 pl-10 rounded-md focus:translate-y-[4px] focus:shadow-[1px_2px_0px_0px_#eec78e] transition-all"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col text-left">
              <label className="font-semibold text-[#264143] mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-[#264143]" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="outline-none border-2 border-[#264143] shadow-[3px_4px_0px_1px_#eec78e] w-[290px] p-3 pl-10 rounded-md focus:translate-y-[4px] focus:shadow-[1px_2px_0px_0px_#eec78e] transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col text-left">
              <label className="font-semibold text-[#264143] mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-[#264143]" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="outline-none border-2 border-[#264143] shadow-[3px_4px_0px_1px_#eec78e] w-[290px] p-3 pl-10 pr-10 rounded-md focus:translate-y-[4px] focus:shadow-[1px_2px_0px_0px_#eec78e] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#264143] hover:text-[#eb6239]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="flex flex-col text-left">
                <label className="font-semibold text-[#264143] mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-[#264143]" size={18} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="outline-none border-2 border-[#264143] shadow-[3px_4px_0px_1px_#eec78e] w-[290px] p-3 pl-10 pr-10 rounded-md focus:translate-y-[4px] focus:shadow-[1px_2px_0px_0px_#eec78e] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-[#264143] hover:text-[#eb6239]"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="bg-[#eb6239] text-white font-extrabold py-3 w-[290px] rounded-lg shadow-[3px_3px_0px_0px_#eec78e] hover:opacity-90 transition-all active:translate-y-[3px]"
            >
              {isLogin ? 'SIGN IN' : 'SIGN UP'}
            </button>

            <p className="text-sm mt-3 text-[#264143] font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button onClick={toggleMode} className="text-[#25abc2] font-bold hover:underline">
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
