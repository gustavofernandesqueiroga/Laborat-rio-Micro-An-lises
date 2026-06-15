
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Microscope, Lock, Mail, ArrowRight, AlertCircle, Loader2, Key, LogIn } from 'lucide-react';
import SEO from '../components/SEO';
import { auth } from '../firebase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user, login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = new URLSearchParams(location.search).get('redirect') || '/';

  // Redirect if already authenticated based on role
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'EAL') {
        navigate('/portal-eal');
      } else if (user.role === 'GUEPARDO') {
        navigate('/portal-guepardo');
      } else if (user.role === 'PARTNER') {
        navigate('/portal-parceiro');
      } else if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(from === '/login' || from === '/cadastro' ? '/' : from);
      }
    }
  }, [isAuthenticated, user, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação client-side
    if (!email.trim()) {
      setError('O e-mail é obrigatório.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um formato de e-mail válido.');
      return;
    }

    if (!pass) {
      setError('A senha é obrigatória.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await login(email, pass);
      navigate(from);
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('E-mail ou senha incorretos.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Muitas tentativas falhas. Tente novamente mais tarde.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('O método de entrada por e-mail e senha não está habilitado no Firebase Console.');
      } else {
        setError('Ocorreu um erro ao tentar entrar. Tente novamente.');
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      navigate(from);
    } catch (err: any) {
      console.error("Google login error:", err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('O login com Google não está habilitado no Firebase Console.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('A janela de login foi fechada antes da conclusão.');
      } else {
        setError('Falha ao entrar com Google. Tente novamente.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <SEO title="Login - Portal Seguro" description="Acesse seu painel exclusivo na Coleta Já." />
      
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[48px] p-10 md:p-12 shadow-2xl shadow-teal-900/5 border border-teal-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-teal-600"></div>
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Microscope size={32} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Portal Coleta Já</h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Acesse sua conta</p>
          </div>

          <form onSubmit={handleLogin} noValidate className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input 
                  type="email" 
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all outline-none font-bold text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Senha</label>
                <Link to="/recuperar-acesso" className="text-[9px] font-black text-teal-600 uppercase tracking-widest hover:text-orange-500">Esqueci a senha</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all outline-none font-bold text-sm"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 border border-red-100">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-teal-500/20 hover:bg-teal-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Entrar no Portal <ArrowRight size={16}/></>}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                <span className="bg-white px-4 text-gray-400">Ou continue com</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white text-gray-700 py-5 rounded-2xl font-black uppercase tracking-widest text-xs border-2 border-gray-100 hover:bg-gray-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Entrar com Google
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center space-y-4">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Novo por aqui?</p>
              <Link to="/cadastro" className="text-teal-600 font-black text-[10px] uppercase tracking-widest hover:text-orange-500 mt-2 block underline underline-offset-4">Crie sua conta</Link>
            </div>
            <div className="pt-4 border-t border-gray-50">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Trabalhe conosco</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/cadastro?role=GUEPARDO" className="text-orange-600 font-black text-[9px] uppercase tracking-widest hover:text-teal-600">Seja um Guepardo</Link>
                <Link to="/cadastro?role=PARTNER" className="text-purple-600 font-black text-[9px] uppercase tracking-widest hover:text-teal-600">Empresa Parceira</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
