
import React, { useState, useEffect } from 'react';
import { useAuth, UserRole } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Microscope, Lock, Mail, ArrowRight, AlertCircle, Loader2, User, CheckCircle2, Upload, FileText, Camera } from 'lucide-react';
import SEO from '../components/SEO';

const Signup: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = (queryParams.get('role') as UserRole) || 'CLIENT';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [role, setRole] = useState<UserRole>(initialRole === 'EAL' ? 'CLIENT' : initialRole);
  const [agreeLGPD, setAgreeLGPD] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Guepardo specific fields
  const [diploma, setDiploma] = useState<File | null>(null);
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [bio, setBio] = useState('');

  const { signup, signInWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeLGPD) {
      setError('Você precisa aceitar os termos de privacidade (LGPD) para continuar.');
      return;
    }

    if (!name.trim()) {
      setError('O nome é obrigatório.');
      return;
    }

    if (!email.trim()) {
      setError('O e-mail é obrigatório.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um formato de e-mail válido.');
      return;
    }

    if (pass !== confirmPass) {
      setError('As senhas não coincidem.');
      return;
    }

    if (pass.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (role === 'GUEPARDO' && (!diploma || !idPhoto)) {
      setError('Guepardos precisam enviar diploma e foto de identificação.');
      return;
    }

    if (!recoveryEmail.trim()) {
      setError('O e-mail de recuperação é obrigatório.');
      return;
    }

    if (!emailRegex.test(recoveryEmail)) {
      setError('O e-mail de recuperação inserido é inválido.');
      return;
    }

    const cleanRecDigits = recoveryPhone.replace(/\D/g, '');
    if (!recoveryPhone.trim() || cleanRecDigits.length < 8) {
      setError('O WhatsApp de recuperação é obrigatório (mínimo de 8 dígitos).');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // In a real app, we would upload files to Firebase Storage first
      // For this demo, we'll simulate it by passing placeholder URLs
      const extraData = {
        recoveryEmail: recoveryEmail.trim().toLowerCase(),
        recoveryPhone: recoveryPhone.trim(),
        ...(role === 'GUEPARDO' ? {
          profile: {
            bio,
            diplomaUrl: 'https://placeholder.com/diploma.pdf',
            idPhotoUrl: 'https://placeholder.com/photo.jpg'
          }
        } : {})
      };

      await signup(email, pass, name, role, extraData);
      
      if (role !== 'CLIENT') {
        navigate('/login?status=pending');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else if (err.code === 'auth/invalid-email') {
        setError('O e-mail inserido é inválido.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha é muito fraca.');
      } else {
        setError('Ocorreu um erro ao criar sua conta. Tente novamente.');
      }
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!agreeLGPD) {
      setError('Você precisa aceitar os termos de privacidade (LGPD) para continuar.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await signInWithGoogle(role);
      if (role !== 'CLIENT') {
        navigate('/login?status=pending');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      console.error("Google signup error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('A janela de login foi fechada antes da conclusão.');
      } else {
        setError('Falha ao cadastrar com Google. Tente novamente.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <SEO title="Cadastro - Portal do Cliente" description="Crie sua conta na Coleta Já para agendar exames e acessar resultados com facilidade." />
      
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[48px] p-10 md:p-12 shadow-2xl shadow-teal-900/5 border border-teal-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-teal-600"></div>
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Microscope size={32} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
              {role === 'CLIENT' ? 'Criar Conta' : `Cadastro ${role}`}
            </h1>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">
              {role === 'GUEPARDO' ? 'Junte-se à elite da coleta laboratorial' : 'Acesso rápido e seguro'}
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Tipo de Conta</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all outline-none font-bold text-sm appearance-none"
              >
                <option value="CLIENT">Paciente / Cliente</option>
                <option value="GUEPARDO">Guepardo (Coletor)</option>
                <option value="PARTNER">Empresa Parceira</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input 
                  type="text" required 
                  placeholder="Seu nome"
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all outline-none font-bold text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input 
                  type="email" required 
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all outline-none font-bold text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="password" required 
                    placeholder="••••••"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all outline-none font-bold text-sm"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Confirmar</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="password" required 
                    placeholder="••••••"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all outline-none font-bold text-sm"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-gray-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-teal-600">Recuperação de Acesso Obrigatória</p>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">E-mail de Recuperação</label>
                <input 
                  type="email" required 
                  placeholder="email-recuperacao@exemplo.com"
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all outline-none font-bold text-sm"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">WhatsApp de Recuperação</label>
                <input 
                  type="tel" required 
                  placeholder="WhatsApp de Recuperação"
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all outline-none font-bold text-sm"
                  value={recoveryPhone}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length > 11) val = val.slice(0, 11);
                    setRecoveryPhone(val);
                  }}
                />
              </div>
            </div>
            {role === 'GUEPARDO' && (
              <div className="space-y-5 pt-4 border-t border-gray-50">
                <p className="text-[10px] font-black uppercase tracking-widest text-teal-600">Dados Profissionais</p>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Bio / Especialidades</label>
                  <textarea 
                    placeholder="Conte um pouco sobre sua experiência..."
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 transition-all outline-none font-bold text-sm min-h-[100px]"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Diploma (PDF/JPG)</label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileText className="w-8 h-8 text-gray-300 mb-2" />
                        <p className="text-[9px] font-bold text-gray-400 uppercase">{diploma ? diploma.name : 'Selecionar Arquivo'}</p>
                      </div>
                      <input type="file" className="hidden" onChange={(e) => setDiploma(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Foto de Perfil (ID)</label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera className="w-8 h-8 text-gray-300 mb-2" />
                        <p className="text-[9px] font-bold text-gray-400 uppercase">{idPhoto ? idPhoto.name : 'Tirar ou Selecionar'}</p>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setIdPhoto(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <input 
                type="checkbox" 
                id="lgpd"
                className="mt-1 w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                checked={agreeLGPD}
                onChange={(e) => setAgreeLGPD(e.target.checked)}
              />
              <label htmlFor="lgpd" className="text-[10px] font-bold text-gray-500 leading-relaxed">
                Eu aceito os <Link to="/compliance" className="text-teal-600 underline">Termos de Uso</Link> e a <Link to="/compliance" className="text-teal-600 underline">Política de Privacidade</Link> (LGPD) para o tratamento dos meus dados de saúde.
              </label>
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
              {loading ? <Loader2 className="animate-spin" /> : <>Criar Minha Conta <ArrowRight size={16}/></>}
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
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full bg-white text-gray-700 py-5 rounded-2xl font-black uppercase tracking-widest text-xs border-2 border-gray-100 hover:bg-gray-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Cadastrar com Google
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Já tem uma conta?</p>
            <Link to="/login" className="text-teal-600 font-black text-[10px] uppercase tracking-widest hover:text-orange-500 mt-2 block underline underline-offset-4">Fazer Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
