import React, { ErrorInfo, ReactNode } from 'react';
import { auth } from '../firebase';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    (this as any).state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 1. Tentar ler usuário logado de forma ultra segura sem lançar novas exceções
    let currentUserData = null;
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        currentUserData = {
          uid: currentUser.uid,
          email: currentUser.email || "Sem e-mail",
          displayName: currentUser.displayName || "Sem nome cadastrado",
          emailVerified: currentUser.emailVerified,
          isAnonymous: currentUser.isAnonymous
        };
      }
    } catch (e) {
      // Ignorar erros ao ler o firebase/auth
    }

    // 2. Coletar metadados do ambiente de execução
    const metadata = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      pathname: window.location.pathname,
      hash: window.location.hash,
      viewport: `${window.innerWidth}x${window.innerHeight}px`,
      devicePixelRatio: window.devicePixelRatio,
      userAgent: navigator.userAgent,
      fontSize: localStorage.getItem('jaja-font-size') || 'medium',
    };

    // 3. Verificar se é um erro de chamada de hook inválido
    const errorMessage = error.message || "";
    const errorStack = error.stack || "";
    const componentStack = errorInfo.componentStack || "";

    const isHookViolation = 
      /invalid hook call/i.test(errorMessage) ||
      /rules of hooks/i.test(errorMessage) ||
      /rules of hooks/i.test(errorStack) ||
      (/useState/i.test(errorMessage) && /null/i.test(errorMessage)) ||
      (/useContext/i.test(errorMessage) && /null/i.test(errorMessage)) ||
      (/useEffect/i.test(errorMessage) && /null/i.test(errorMessage)) ||
      (/useRef/i.test(errorMessage) && /null/i.test(errorMessage));

    // 4. Montar log estilizado no console
    console.group('%c🚨 ALERTA DE CRITICAL ERROR - DETECTADO NO SITE 🚨', 'background: #fee2e2; color: #b91c1c; padding: 6px 12px; font-weight: bold; font-family: system-ui; border-radius: 4px; font-size: 13px;');
    
    if (isHookViolation) {
      console.warn(
        '%c⚠️ DETECTOR DE ERROS DE HOOK INTERCEPTOU UMA VIOLAÇÃO DE REGRAS DE HOOK ⚠️\n' +
        'O React detectou uma chamada inválida de Hooks. Lembre-se:\n' +
        '1. Hooks só podem ser chamados no corpo de componentes funcionais.\n' +
        '2. Hooks não podem ser chamados condicionalmente ou em loops ou em blocos try/catch.\n' +
        '3. Hooks não podem ser chamados em classes ou funções utilitárias.',
        'background: #fffbeb; color: #b45309; font-weight: bold; border-left: 4px solid #f59e0b; padding: 6px; font-family: monospace; font-size: 11px;'
      );
    }

    console.log('%c[Informações do Erro]', 'font-weight: bold; color: #475569;');
    console.log('Mensagem:', error.message);
    console.log('Erro Stack Trace:', errorStack);
    console.log('Component Stack Traced by React:', componentStack);

    console.log('%c[Contexto de Autenticação do Usuário]', 'font-weight: bold; color: #0d9488;');
    if (currentUserData) {
      console.table(currentUserData);
    } else {
      console.log('Nenhum usuário logado no Firebase Auth.');
    }

    console.log('%c[Metadados do Ambiente]', 'font-weight: bold; color: #2563eb;');
    console.table(metadata);

    console.groupEnd();
  }

  public render() {
    const state = (this as any).state;
    if (state.hasError) {
      let errorMessage = "Ocorreu um erro inesperado.";
      
      try {
        if (state.error?.message) {
          const parsed = JSON.parse(state.error.message);
          if (parsed.error && parsed.operationType) {
            errorMessage = `Erro no Firestore (${parsed.operationType}): ${parsed.error}`;
          }
        }
      } catch (e) {
        // Not a JSON error
        errorMessage = state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full bg-white p-8 rounded-[40px] shadow-2xl border border-red-100 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4">Ops! Algo deu errado</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              {errorMessage}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-teal-500/20 hover:bg-teal-700 transition-all"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

export default ErrorBoundary;
