
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Shield, Zap, Eye, Sparkles, Award, Tablet, Gift, Bike } from 'lucide-react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const characters = [
  {
    name: 'Jajá',
    species: 'O Guepardo',
    role: 'Líder da Velocidade',
    description: 'Ele garante que a coleta seja tão rápida que a dor não consiga alcançar a criança. Representa a agilidade da Coleta Já.',
    icon: <Zap className="text-yellow-500" size={32} />,
    color: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700'
  },
  {
    name: 'Bibi',
    species: 'A Beija-flor',
    role: 'Especialista em Leveza',
    description: 'Ela ensina a técnica da "picadinha de beija-flor". Sua função é acalmar e garantir precisão cirúrgica sem trauma.',
    icon: <Heart className="text-pink-500" size={32} />,
    color: 'bg-pink-50',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-700'
  },
  {
    name: 'Tuca',
    species: 'O Tucano',
    role: 'Gênio da Visão',
    description: 'Com seus goggles tecnológicos, ele analisa as células e garante que o laudo seja perfeito. Representa a Tecnologia.',
    icon: <Eye className="text-blue-500" size={32} />,
    color: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700'
  },
  {
    name: 'Dudu',
    species: 'O Golfinho',
    role: 'Mestre da Alegria',
    description: 'Usa a "Brisa do Jajá" (cheirinho de Tutti-frutti) e itens sensoriais para distrair com brincadeiras e o Super App.',
    icon: <Sparkles className="text-cyan-500" size={32} />,
    color: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-700'
  },
  {
    name: 'Lica',
    species: 'A Lontra',
    role: 'Guardiã da Pureza',
    description: 'Cuida da esterilização, dos curativos coloridos e garante que tudo esteja impecável (padrão ANVISA).',
    icon: <Shield className="text-teal-500" size={32} />,
    color: 'bg-teal-50',
    borderColor: 'border-teal-200',
    textColor: 'text-teal-700'
  }
];

const Kids: React.FC = () => {
  return (
    <div className="pt-20 bg-white overflow-hidden">
      <SEO 
        title="Turma do Jajá - Coleta Infantil Divertida" 
        description="Transformamos o medo de exames em uma missão de saúde lúdica com os Guardiões da Saúde em João Pessoa."
      />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-black uppercase tracking-widest mb-6">
              Os Guardiões da Saúde
            </span>
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight mb-8">
              Bem-vindos ao <br/>
              <span className="text-teal-600">Parque da Saúde!</span>
            </h1>
            <p className="text-gray-600 text-xl mb-10 font-medium leading-relaxed">
              Aqui na Coleta Já, transformamos o medo em diversão. Conheça a Turma do Jajá e embarque em uma missão épica para cuidar do seu superpoder: a saúde!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/agendamento"
                className="bg-orange-accent text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-orange-500/20 hover:scale-105 transition-all"
              >
                Agendar Missão Kids
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-teal-200/30 rounded-[60px] blur-3xl -z-10 animate-pulse"></div>
            <img 
              src="https://ais-pre-axiimi34l7422z64ujbmfu-16137693517.us-east1.run.app/kids-hero.png" 
              alt="Turma do Jajá - Guardiões da Saúde"
              className="w-full h-auto rounded-[60px] shadow-2xl border-8 border-white"
              onError={(e) => {
                // Fallback if the provided image URL doesn't work in dev
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1200';
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Meet the Guardians */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-orange-500 font-black uppercase tracking-widest text-sm mb-4">Conheça os Heróis</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-gray-900">A Turma do Jajá</h3>
            <p className="text-gray-500 mt-4 text-lg">Cada guardião tem um superpoder especial para cuidar de você!</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {characters.map((char, idx) => (
              <motion.div
                key={char.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`${char.color} ${char.borderColor} border-2 rounded-[48px] p-10 hover:shadow-2xl transition-all group relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  {char.icon}
                </div>
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-sm">
                  {char.icon}
                </div>
                <h4 className={`text-2xl font-black ${char.textColor} uppercase mb-1`}>{char.name}</h4>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">{char.species} • {char.role}</p>
                <p className="text-gray-600 font-medium leading-relaxed">
                  {char.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 bg-teal-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="grid grid-cols-8 gap-10 p-10">
            {[...Array(32)].map((_, i) => <Star key={i} className="text-white" />)}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight">
                Uma Experiência <br/>
                <span className="text-orange-400">Mágica e Sensorial.</span>
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                    <Sparkles className="text-orange-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">Brisa do Jajá</h4>
                    <p className="text-teal-50 opacity-80">Marketing olfativo com cheirinho de Tutti-frutti para acalmar os pequenos exploradores.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                    <Tablet className="text-orange-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">Espaço Kids Digital</h4>
                    <p className="text-teal-50 opacity-80">Tablets com jogos exclusivos da Turma do Jajá e desenhos animados em todas as unidades.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                    <Award className="text-orange-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">Certificado de Coragem</h4>
                    <p className="text-teal-50 opacity-80">Assinado pelos Guardiões da Saúde, celebrando a bravura de cada criança.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[60px] p-12 shadow-2xl">
              <div className="text-center mb-10">
                <div className="inline-block p-4 bg-orange-100 rounded-3xl mb-6">
                  <Gift className="text-orange-600" size={40} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 uppercase">Combo Jajá Feliz</h3>
                <p className="text-gray-500 font-bold mt-2 uppercase tracking-widest text-xs">Colecione todos os heróis!</p>
              </div>
              <p className="text-gray-600 text-center mb-8 leading-relaxed">
                Cada exame ou vacina dá direito a um <strong>Toy Art 3D colecionável</strong> dos personagens da Turma do Jajá. Comece sua coleção hoje mesmo!
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-6 rounded-3xl text-center">
                  <span className="block text-2xl mb-2">🎖️</span>
                  <span className="text-[10px] font-black uppercase text-gray-400">Selos de Herói</span>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl text-center">
                  <span className="block text-2xl mb-2">👑</span>
                  <span className="text-[10px] font-black uppercase text-gray-400">Tiaras de Princesa</span>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl text-center">
                  <span className="block text-2xl mb-2">🔘</span>
                  <span className="text-[10px] font-black uppercase text-gray-400">Bottons Exclusivos</span>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl text-center">
                  <span className="block text-2xl mb-2">⚔️</span>
                  <span className="text-[10px] font-black uppercase text-gray-400">Faixas de Guerreira</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Home Collection Kids */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gray-900 rounded-[60px] p-12 lg:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
            <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
              <div className="lg:w-1/2">
                <div className="w-16 h-16 bg-teal-600 rounded-3xl flex items-center justify-center mb-8">
                  <Bike className="text-white" size={32} />
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-white mb-8">
                  Guepardo Kids: <br/>
                  <span className="text-teal-400">Aventura em Casa.</span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-10">
                  Nossa coleta domiciliar leva toda a magia da Turma do Jajá até o seu lar. Com a Bibi e o Jajá, a coleta é tão rápida e leve que parece mágica!
                </p>
                <Link 
                  to="/agendamento"
                  className="inline-block bg-teal-600 text-white px-12 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-xl shadow-teal-900/40"
                >
                  Agendar Coleta em Casa
                </Link>
              </div>
              <div className="lg:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=800" 
                  alt="Coleta Domiciliar Infantil"
                  className="rounded-[40px] shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Storytelling CTA */}
      <section className="py-24 bg-orange-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-black text-gray-900 mb-6 uppercase">O Medo Não Tem Vez!</h3>
          <p className="text-gray-600 text-lg mb-10 font-medium">
            "Não se preocupe! A Bibi já está preparando as asinhas dela para uma coleta super leve e o Jajá vai garantir que tudo seja mais rápido que um piscar de olhos!"
          </p>
          <div className="flex justify-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">✨</div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">🍭</div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">🎮</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Kids;
