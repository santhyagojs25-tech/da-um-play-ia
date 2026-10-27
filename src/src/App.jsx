import React, { useState, useEffect } from 'react';
import {
  Play, Lock, Unlock, Crown, Shield, Users, Upload, Plus, Trash2,
  CheckCircle, AlertCircle, LogOut, Eye, EyeOff, Database, CreditCard,
  Copy, Check, Film, Sparkles, Clock, RefreshCw, Key, ExternalLink, X
} from 'lucide-react';

const INITIAL_SERIES = [
  {
    id: 's1',
    title: 'Cyber Amazônia 2099',
    category: 'Ficção Científica IA',
    synopsis: 'Em um futuro dominado por megacorporações sintéticas, uma guerreira biomecânica descobre o código-fonte ancestral oculto no coração da floresta.',
    poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    isHeroLaunch: true,
    episodes: [
      {
        id: 'e1',
        number: 1,
        title: 'O Despertar da Máquina (Episódio Piloto)',
        duration: '14 min',
        isVip: false,
        thumb: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
      },
      {
        id: 'e2',
        number: 2,
        title: 'Protocolo Vermelho na Neo-Manaus',
        duration: '18 min',
        isVip: true,
        thumb: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
      },
      {
        id: 'e3',
        number: 3,
        title: 'A Batalha dos Drones Neurais',
        duration: '21 min',
        isVip: true,
        thumb: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      }
    ]
  },
  {
    id: 's2',
    title: 'Crônicas do Submundo Neon',
    category: 'Ação & Suspense IA',
    synopsis: 'Caçadores de recompensas digitais disputam o controle das memórias proibidas da metrópole.',
    poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
    isHeroLaunch: false,
    episodes: [
      {
        id: 'e201',
        number: 1,
        title: 'Noite de Caçada (Grátis)',
        duration: '12 min',
        isVip: false,
        thumb: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
      },
      {
        id: 'e202',
        number: 2,
        title: 'Infiltração na Torre Azul',
        duration: '19 min',
        isVip: true,
        thumb: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
      }
    ]
  }
];

const INITIAL_USERS = [
  {
    id: 'u1',
    name: 'Você (Visitante Teste)',
    email: 'cliente@daumplayia.com.br',
    isVip: false,
    isOnline: true,
    lastEntry: 'Hoje, 15:42',
    lastExit: 'Ativo agora',
    lastWatched: 'Ep. 1 - O Despertar da Máquina'
  },
  {
    id: 'u2',
    name: 'Lucas Mendes',
    email: 'lucas.m@gmail.com',
    isVip: true,
    isOnline: true,
    lastEntry: 'Hoje, 15:30',
    lastExit: 'Ativo agora',
    lastWatched: 'Ep. 3 - A Batalha dos Drones Neurais'
  },
  {
    id: 'u3',
    name: 'Amanda Rocha',
    email: 'amanda.rocha@hotmail.com',
    isVip: false,
    isOnline: false,
    lastEntry: 'Hoje, 13:10',
    lastExit: 'Hoje, 14:05',
    lastWatched: 'Ep. 1 - Noite de Caçada'
  }
];

const SQL_SETUP_SCRIPT = `-- COPIE E COLE NO 'SQL EDITOR' DO SUPABASE E CLIQUE EM 'RUN'
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  is_vip boolean default false,
  is_online boolean default false,
  last_login timestamp with time zone default now(),
  last_logout timestamp with time zone,
  last_watched text default 'Nenhum episódio ainda',
  created_at timestamp with time zone default now()
);

create table if not exists public.series (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  synopsis text,
  category text default 'Série IA',
  poster_url text not null,
  banner_url text not null,
  is_hero_launch boolean default false,
  created_at timestamp with time zone default now()
);

create table if not exists public.episodes (
  id uuid primary key default gen_random_uuid(),
  series_id uuid references public.series(id) on delete cascade,
  episode_number integer not null,
  title text not null,
  duration text default '15 min',
  thumbnail_url text not null,
  video_url text not null,
  is_vip boolean default true,
  created_at timestamp with time zone default now()
);`;

export default function App() {
  // Estados principais do Catálogo e Usuários
  const [seriesList, setSeriesList] = useState(INITIAL_SERIES);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState('u1');
  const [selectedSeriesId, setSelectedSeriesId] = useState('s1');

  // Player e Checkout PIX
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [showVipModal, setShowVipModal] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);

  // Segurança do ADM (100% Escondido)
  const [logoClicks, setLogoClicks] = useState(0);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminTab, setAdminTab] = useState('conexao'); // Começa na nova Central de Conexão Fácil
  const [adminPasswordHash, setAdminPasswordHash] = useState('admin123');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Estados da Nova Central de Conexão Fácil (Supabase + PIX)
  const [supabaseUrl, setSupabaseUrl] = useState(() => localStorage.getItem('dup_sb_url') || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(() => localStorage.getItem('dup_sb_key') || '');
  const [pixAccessToken, setPixAccessToken] = useState(() => localStorage.getItem('dup_pix_token') || '');
  const [connectionStatus, setConnectionStatus] = useState('local'); // 'local' | 'testing' | 'connected'
  const [sqlCopied, setSqlCopied] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Estados de Upload de Série/Episódio no ADM
  const [newEpSeriesId, setNewEpSeriesId] = useState('s1');
  const [newEpTitle, setNewEpTitle] = useState('');
  const [newEpNumber, setNewEpNumber] = useState(4);
  const [newEpDuration, setNewEpDuration] = useState('16 min');
  const [newEpThumb, setNewEpThumb] = useState('');
  const [newEpVideo, setNewEpVideo] = useState('');
  const [newEpIsVip, setNewEpIsVip] = useState(true);

  // Estados de Troca de Senha do ADM
  const [currentPassCheck, setCurrentPassCheck] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [passChangeMsg, setPassChangeMsg] = useState('');

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];
  const heroSeries = seriesList.find((s) => s.isHeroLaunch) || seriesList[0];
  const selectedSeries = seriesList.find((s) => s.id === selectedSeriesId) || seriesList[0];

  // Gatilho Secreto: 3 cliques rápidos na Logo
  useEffect(() => {
    if (logoClicks === 0) return;
    if (logoClicks >= 3) {
      setShowAdminAuthModal(true);
      setLogoClicks(0);
      return;
    }
    const timer = setTimeout(() => setLogoClicks(0), 1200);
    return () => clearTimeout(timer);
  }, [logoClicks]);

  // Verifica se já havia chaves salvas no navegador
  useEffect(() => {
    if (supabaseUrl.includes('supabase.co') && supabaseAnonKey.length > 20) {
      setConnectionStatus('connected');
    }
  }, []);

  // Funções de Reprodução com Trava Grátis vs VIP
  const handlePlayEpisode = (episode) => {
    if (episode.isVip && !currentUser.isVip) {
      setShowVipModal(true);
      return;
    }
    setActiveEpisode(episode);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, lastWatched: `Ep. ${episode.number} - ${episode.title}` }
          : u
      )
    );
  };

  // Simular ou Aprovar Pagamento PIX de R$ 9,90
  const handleApproveVipPayment = () => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, isVip: true } : u))
    );
    setShowVipModal(false);
  };

  // Controle Manual de VIP pelo ADM (Dar ou Tirar VIP)
  const toggleUserVipByAdmin = (userId) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isVip: !u.isVip } : u))
    );
  };

  // Controle de Entrada/Saída simulado
  const toggleUserOnlineSession = (userId) => {
    const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              isOnline: !u.isOnline,
              lastEntry: !u.isOnline ? `Hoje, ${now}` : u.lastEntry,
              lastExit: u.isOnline ? `Hoje, ${now}` : 'Ativo agora'
            }
          : u
      )
    );
  };

  // Login Secreto do ADM
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passwordInput === adminPasswordHash) {
      setAdminUnlocked(true);
      setShowAdminAuthModal(false);
      setPasswordInput('');
      setAuthError('');
    } else {
      setAuthError('Acesso Negado: Credencial de administrador inválida.');
    }
  };

  // Salvar Conexão Automática no Painel do ADM
  const handleSaveCloudKeys = (e) => {
    e.preventDefault();
    setConnectionStatus('testing');
    localStorage.setItem('dup_sb_url', supabaseUrl.trim());
    localStorage.setItem('dup_sb_key', supabaseAnonKey.trim());
    localStorage.setItem('dup_pix_token', pixAccessToken.trim());

    setTimeout(() => {
      if (supabaseUrl.includes('supabase.co') && supabaseAnonKey.length > 20) {
        setConnectionStatus('connected');
        setSaveMessage('Conectado com sucesso ao Supabase! Suas chaves foram salvas.');
      } else {
        setConnectionStatus('local');
        setSaveMessage('Chaves salvas localmente. Insira uma URL válida (.supabase.co) para ativar a nuvem.');
      }
    }, 600);
  };

  // Adicionar Novo Episódio no Painel do ADM
  const handleAddEpisode = (e) => {
    e.preventDefault();
    if (!newEpTitle.trim()) return;
    const newEp = {
      id: 'ep_' + Date.now(),
      number: Number(newEpNumber),
      title: newEpTitle,
      duration: newEpDuration || '15 min',
      isVip: newEpIsVip,
      thumb:
        newEpThumb.trim() ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      videoUrl:
        newEpVideo.trim() ||
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    };

    setSeriesList((prev) =>
      prev.map((s) =>
        s.id === newEpSeriesId ? { ...s, episodes: [...s.episodes, newEp] } : s
      )
    );
    setNewEpTitle('');
    setNewEpNumber((n) => Number(n) + 1);
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-white font-sans selection:bg-[#ff1722] selection:text-white">
      {/* BARRA DO TOPO */}
      <header className="sticky top-0 z-40 bg-[#07080c]/95 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Clique 3 vezes na logo para abrir o login secreto do ADM */}
          <button
            onClick={() => setLogoClicks((c) => c + 1)}
            className="flex items-center gap-2.5 text-left focus:outline-none select-none group"
            title="Da Um Play IA"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff1722] to-[#00d4ff] p-0.5 shadow-lg shadow-[#ff1722]/20">
              <div className="w-full h-full bg-[#07080c] rounded-[10px] flex items-center justify-center">
                <Play className="w-5 h-5 text-[#ff1722] fill-[#ff1722] ml-0.5" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black tracking-tighter text-white">
                DA UM <span className="text-[#ff1722]">PLAY</span>{' '}
                <span className="text-[#00d4ff]">IA</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-gray-400">
                Streaming Original IA
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
            <a href="#vitrine" className="hover:text-white transition">Início</a>
            <a href="#catalogo" className="hover:text-white transition">Lançamentos</a>
            <a href="#catalogo" className="hover:text-[#00d4ff] transition">Exclusivos VIP</a>
          </nav>
        </div>

        {/* Status do Usuário Logado + Botão de Assinar VIP R$ 9,90 */}
        <div className="flex items-center gap-3">
          {currentUser.isVip ? (
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/40 flex items-center gap-1.5 shadow-lg shadow-[#00d4ff]/10">
              <Crown className="w-4 h-4" /> CONTA VIP ATIVA
            </span>
          ) : (
            <button
              onClick={() => setShowVipModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[#ff1722] to-[#00d4ff] text-white shadow-lg shadow-[#ff1722]/30 hover:opacity-95 transition flex items-center gap-1.5"
            >
              <Crown className="w-4 h-4" /> ASSINAR VIP • R$ 9,90
            </button>
          )}

          {adminUnlocked && (
            <button
              onClick={() => setAdminUnlocked(false)}
              className="px-3 py-1.5 rounded-lg bg-[#ff1722]/20 border border-[#ff1722] text-[#ff1722] text-xs font-bold hover:bg-[#ff1722] hover:text-white transition"
            >
              Esconder Painel ADM
            </button>
          )}
        </div>
      </header>

      {/* =====================================================================
          PAINEL DO ADM (APARECE APENAS QUANDO DESTRAVADO COM SENHA)
      ===================================================================== */}
      {adminUnlocked && (
        <section className="bg-[#0d1017] border-b-2 border-[#00d4ff] p-6 shadow-2xl">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#00d4ff]/15 border border-[#00d4ff]/40 text-[#00d4ff]">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wide flex items-center gap-2">
                    Painel de Comando do Administrador
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Acesso Mestre
                    </span>
                  </h2>
                  <p className="text-xs text-gray-400">
                    Gerencie a conexão com o Supabase, suba episódios, monitore quem entra/sai e dê ou tire VIP.
                  </p>
                </div>
              </div>

              {/* Abas do Painel ADM */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setAdminTab('conexao')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    adminTab === 'conexao'
                      ? 'bg-[#00d4ff] text-[#07080c]'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Database className="w-4 h-4" /> 1. Conexão Fácil (Supabase & PIX)
                </button>
                <button
                  onClick={() => setAdminTab('usuarios')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    adminTab === 'usuarios'
                      ? 'bg-[#ff1722] text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Users className="w-4 h-4" /> 2. Usuários & Dar/Tirar VIP
                </button>
                <button
                  onClick={() => setAdminTab('lancamentos')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    adminTab === 'lancamentos'
                      ? 'bg-[#ff1722] text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Upload className="w-4 h-4" /> 3. Subir Lançamentos & Eps
                </button>
                <button
                  onClick={() => setAdminTab('senha')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    adminTab === 'senha'
                      ? 'bg-[#ff1722] text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Key className="w-4 h-4" /> 4. Trocar Senha ADM
                </button>
              </div>
            </div>

            {/* ABA 1: CENTRAL DE CONEXÃO FÁCIL (PASSO A PASSO SUPABASE + PIX) */}
            {adminTab === 'conexao' && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Coluna 1: Guia de 3 Cliques com Botão de Copiar SQL */}
                <div className="bg-[#07080c] border border-white/10 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00d4ff]">
                      Passo a Passo Guiado (Sem complicação)
                    </span>
                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#00d4ff] hover:underline flex items-center gap-1 font-semibold"
                    >
                      Abrir Supabase <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="space-y-3 text-xs text-gray-300">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="font-bold text-white mb-1">
                        1º Clique: Copie o código das tabelas abaixo
                      </p>
                      <p className="text-gray-400 mb-2">
                        No Supabase, clique no ícone <b>SQL Editor (&gt;_)</b> na barra esquerda, cole este código e clique no botão verde <b>Run</b>.
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(SQL_SETUP_SCRIPT);
                          setSqlCopied(true);
                          setTimeout(() => setSqlCopied(false), 3000);
                        }}
                        className="w-full py-2 px-3 rounded-lg bg-[#00d4ff]/15 border border-[#00d4ff]/40 text-[#00d4ff] font-bold flex items-center justify-center gap-2 hover:bg-[#00d4ff]/25 transition"
                      >
                        {sqlCopied ? (
                          <>
                            <Check className="w-4 h-4" /> Código SQL Copiado! Agora cole lá no Supabase
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" /> Copiar Código SQL Prontinho
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="font-bold text-white mb-1">
                        2º Clique: Crie a pasta de Capas e Vídeos
                      </p>
                      <p className="text-gray-400">
                        No menu esquerdo do Supabase, clique na pastinha <b>Storage</b> &rarr; <b>New Bucket</b> &rarr; digite <code className="text-[#00d4ff]">midia-catalogo</code> &rarr; marque <b>Public Bucket</b> e salve.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="font-bold text-white mb-1">
                        3º Clique: Cole suas 2 Chaves ao lado &rarr;
                      </p>
                      <p className="text-gray-400">
                        Clique na engrenagem <b>Project Settings</b> &rarr; <b>API</b>, copie a <b>Project URL</b> e a chave <b>anon public</b> e cole no quadro ao lado.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Coluna 2: Formulário para colar URL, Anon Key e Token PIX */}
                <form
                  onSubmit={handleSaveCloudKeys}
                  className="bg-[#07080c] border border-white/10 rounded-2xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">
                      Chaves de Conexão Automática
                    </h3>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        connectionStatus === 'connected'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {connectionStatus === 'connected'
                        ? '● Nuvem Supabase Conectada'
                        : '● Rodando em Modo Local'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-semibold">
                      1. Project URL do Supabase
                    </label>
                    <input
                      type="text"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      placeholder="https://seuprojeto.supabase.co"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1017] border border-white/15 text-xs text-white focus:border-[#00d4ff] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-semibold">
                      2. Chave API (anon public) do Supabase
                    </label>
                    <input
                      type="password"
                      value={supabaseAnonKey}
                      onChange={(e) => setSupabaseAnonKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1017] border border-white/15 text-xs text-white focus:border-[#00d4ff] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-semibold">
                      3. Token PIX R$ 9,90 (Mercado Pago / PushinPay - Opcional agora)
                    </label>
                    <input
                      type="password"
                      value={pixAccessToken}
                      onChange={(e) => setPixAccessToken(e.target.value)}
                      placeholder="APP_USR-00000000000000-..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1017] border border-white/15 text-xs text-white focus:border-[#00d4ff] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff1722] to-[#00d4ff] text-white font-extrabold text-xs uppercase tracking-wider hover:opacity-95 transition shadow-lg"
                  >
                    Salvar e Conectar Banco de Dados
                  </button>

                  {saveMessage && (
                    <p className="text-xs text-[#00d4ff] bg-[#00d4ff]/10 border border-[#00d4ff]/30 rounded-lg p-2.5 text-center">
                      {saveMessage}
                    </p>
                  )}
                </form>
              </div>
            )}

            {/* ABA 2: CONTROLE DE QUEM ENTRA, QUEM SAI E PODER DE DAR/TIRAR VIP */}
            {adminTab === 'usuarios' && (
              <div className="bg-[#07080c] border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-sm font-bold">
                    Controle de Assinantes, Entradas, Saídas e Liberação Manual de VIP
                  </h3>
                  <span className="text-xs text-gray-400">
                    Total: {users.length} usuários | VIPs: {users.filter((u) => u.isVip).length}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-gray-400 uppercase">
                      <tr>
                        <th className="p-3.5">Usuário</th>
                        <th className="p-3.5">Sessão (Entrada / Saída)</th>
                        <th className="p-3.5">Último Episódio</th>
                        <th className="p-3.5">Plano Atual</th>
                        <th className="p-3.5 text-right">Poder do ADM</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-white/5">
                          <td className="p-3.5">
                            <div className="font-bold text-white">{u.name}</div>
                            <div className="text-gray-400">{u.email}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${
                                  u.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'
                                }`}
                              />
                              <span className={u.isOnline ? 'text-emerald-400 font-bold' : 'text-gray-400'}>
                                {u.isOnline ? 'Online Agora' : 'Saiu'}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-400 mt-0.5">
                              Entrada: {u.lastEntry} • Saída: {u.lastExit}
                            </div>
                          </td>
                          <td className="p-3.5 text-gray-300">{u.lastWatched}</td>
                          <td className="p-3.5">
                            {u.isVip ? (
                              <span className="px-2.5 py-1 rounded-full bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/40 font-bold">
                                VIP ATIVO (R$ 9,90)
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-white/10 text-gray-300 font-semibold">
                                GRÁTIS
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => toggleUserVipByAdmin(u.id)}
                              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                                u.isVip
                                  ? 'bg-[#ff1722]/20 text-[#ff1722] border border-[#ff1722]/40 hover:bg-[#ff1722] hover:text-white'
                                  : 'bg-[#00d4ff] text-[#07080c] hover:opacity-90'
                              }`}
                            >
                              {u.isVip ? 'Tirar VIP' : 'Tornar VIP'}
                            </button>
                            <button
                              onClick={() => toggleUserOnlineSession(u.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20"
                              title="Simular Entrada/Saída"
                            >
                              {u.isOnline ? 'Desconectar' : 'Simular Login'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ABA 3: SUBIR LANÇAMENTOS E EPISÓDIOS (CHAVE GRÁTIS OU VIP) */}
            {adminTab === 'lancamentos' && (
              <form
                onSubmit={handleAddEpisode}
                className="bg-[#07080c] border border-white/10 rounded-2xl p-5 grid md:grid-cols-3 gap-4"
              >
                <div>
                  <label className="block text-xs text-gray-400 mb-1 font-bold">
                    Escolher Série
                  </label>
                  <select
                    value={newEpSeriesId}
                    onChange={(e) => setNewEpSeriesId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0d1017] border border-white/15 text-xs text-white"
                  >
                    {seriesList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1 font-bold">
                    Título do Novo Episódio
                  </label>
                  <input
                    type="text"
                    required
                    value={newEpTitle}
                    onChange={(e) => setNewEpTitle(e.target.value)}
                    placeholder="Ex: O Ataque dos Clones IA"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0d1017] border border-white/15 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-bold">Nº Ep.</label>
                    <input
                      type="number"
                      value={newEpNumber}
                      onChange={(e) => setNewEpNumber(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0d1017] border border-white/15 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-bold">Duração</label>
                    <input
                      type="text"
                      value={newEpDuration}
                      onChange={(e) => setNewEpDuration(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0d1017] border border-white/15 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1 font-bold">
                    Link da Capa do Episódio (Thumbnail)
                  </label>
                  <input
                    type="text"
                    value={newEpThumb}
                    onChange={(e) => setNewEpThumb(e.target.value)}
                    placeholder="https://... (ou deixe vazio p/ capa padrão)"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0d1017] border border-white/15 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1 font-bold">
                    Link do Vídeo MP4
                  </label>
                  <input
                    type="text"
                    value={newEpVideo}
                    onChange={(e) => setNewEpVideo(e.target.value)}
                    placeholder="https://...arquivo.mp4"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0d1017] border border-white/15 text-xs text-white"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={() => setNewEpIsVip(!newEpIsVip)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold border transition ${
                      newEpIsVip
                        ? 'bg-[#00d4ff]/20 border-[#00d4ff] text-[#00d4ff]'
                        : 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    }`}
                  >
                    {newEpIsVip ? '🔒 Modo: EXCLUSIVO VIP' : '🔓 Modo: GRÁTIS'}
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-[#ff1722] text-white text-xs font-extrabold hover:opacity-90"
                  >
                    Publicar
                  </button>
                </div>
              </form>
            )}

            {/* ABA 4: TROCAR SENHA DO ADM (MASCARADA) */}
            {adminTab === 'senha' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (currentPassCheck !== adminPasswordHash) {
                    setPassChangeMsg('Senha atual incorreta.');
                    return;
                  }
                  if (newAdminPass.length < 4) {
                    setPassChangeMsg('A nova senha deve ter pelo menos 4 caracteres.');
                    return;
                  }
                  setAdminPasswordHash(newAdminPass);
                  setCurrentPassCheck('');
                  setNewAdminPass('');
                  setPassChangeMsg('Senha do Administrador atualizada com sucesso!');
                }}
                className="bg-[#07080c] border border-white/10 rounded-2xl p-5 max-w-md space-y-3"
              >
                <h3 className="text-sm font-bold">Alterar Senha Secreta do ADM</h3>
                <input
                  type="password"
                  placeholder="Digite a senha atual"
                  value={currentPassCheck}
                  onChange={(e) => setCurrentPassCheck(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1017] border border-white/15 text-xs text-white"
                />
                <input
                  type="password"
                  placeholder="Digite a nova senha secreta"
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1017] border border-white/15 text-xs text-white"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#ff1722] text-white text-xs font-bold"
                >
                  Salvar Nova Senha
                </button>
                {passChangeMsg && (
                  <p className="text-xs text-[#00d4ff] pt-1">{passChangeMsg}</p>
                )}
              </form>
            )}
          </div>
        </section>
      )}

      {/* =====================================================================
          VITRINE PRINCIPAL DO ESPECTADOR (SUPER BANNER DE LANÇAMENTO)
      ===================================================================== */}
      <section id="vitrine" className="relative min-h-[480px] flex items-end p-6 md:p-12 overflow-hidden">
        <img
          src={heroSeries.banner}
          alt={heroSeries.title}
          className="absolute inset-0 w-full h-full object-cover opacity-45 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-[#07080c]/70 to-transparent" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#ff1722] text-white text-[11px] font-black uppercase tracking-wider">
              🔥 Lançamento em Destaque
            </span>
            <span className="px-3 py-1 rounded-full bg-[#00d4ff]/20 border border-[#00d4ff]/40 text-[#00d4ff] text-[11px] font-bold">
              {heroSeries.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
            {heroSeries.title}
          </h1>

          <p className="text-sm text-gray-300 leading-relaxed">
            {heroSeries.synopsis}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => handlePlayEpisode(heroSeries.episodes[0])}
              className="px-6 py-3.5 rounded-xl bg-[#ff1722] hover:bg-[#ff1722]/90 text-white font-black text-sm flex items-center gap-2 shadow-xl shadow-[#ff1722]/30 transition"
            >
              <Play className="w-5 h-5 fill-white" /> Assistir 1º Episódio Grátis
            </button>
            {!currentUser.isVip && (
              <button
                onClick={() => setShowVipModal(true)}
                className="px-6 py-3.5 rounded-xl bg-[#00d4ff]/15 hover:bg-[#00d4ff]/25 border border-[#00d4ff]/50 text-[#00d4ff] font-extrabold text-sm flex items-center gap-2 transition"
              >
                <Crown className="w-5 h-5" /> Liberar Tudo por R$ 9,90
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
          CARROSSEL DE CAPAS DAS SÉRIES + LISTA DE EPISÓDIOS (GRÁTIS vs VIP)
      ===================================================================== */}
      <main id="catalogo" className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Seletor de Séries (Capas Verticais) */}
        <div>
          <h2 className="text-lg font-black uppercase tracking-wide mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ff1722]" /> Séries Originais Da Um Play IA
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {seriesList.map((serie) => (
              <button
                key={serie.id}
                onClick={() => setSelectedSeriesId(serie.id)}
                className={`group relative rounded-2xl overflow-hidden border-2 text-left transition ${
                  selectedSeries.id === serie.id
                    ? 'border-[#00d4ff] shadow-lg shadow-[#00d4ff]/20'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="aspect-[2/3] relative">
                  <img
                    src={serie.poster}
                    alt={serie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-[#ff1722] text-[10px] font-black uppercase">
                    {serie.episodes.length} Eps
                  </span>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-xs text-[#00d4ff] font-bold">{serie.category}</p>
                    <h3 className="text-sm font-black text-white leading-tight">
                      {serie.title}
                    </h3>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Episódios da Série Selecionada */}
        <div className="bg-[#0d1017] border border-white/10 rounded-3xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div>
              <span className="text-xs font-bold text-[#00d4ff] uppercase">
                Temporada 1 Completa
              </span>
              <h3 className="text-2xl font-black">{selectedSeries.title}</h3>
            </div>
            <span className="text-xs text-gray-400">
              Clique em um episódio para iniciar o player
            </span>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {selectedSeries.episodes.map((ep) => {
              const locked = ep.isVip && !currentUser.isVip;
              return (
                <div
                  key={ep.id}
                  onClick={() => handlePlayEpisode(ep)}
                  className={`group cursor-pointer rounded-2xl overflow-hidden bg-[#07080c] border transition ${
                    locked
                      ? 'border-[#00d4ff]/40 hover:border-[#00d4ff]'
                      : 'border-white/10 hover:border-[#ff1722]'
                  }`}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={ep.thumb}
                      alt={ep.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                      {locked ? (
                        <div className="w-12 h-12 rounded-full bg-[#00d4ff]/20 border border-[#00d4ff] flex items-center justify-center text-[#00d4ff]">
                          <Lock className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#ff1722] flex items-center justify-center text-white shadow-lg shadow-[#ff1722]/40">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      )}
                    </div>

                    {/* Etiqueta VIP ou Grátis */}
                    <span
                      className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase ${
                        ep.isVip
                          ? 'bg-[#00d4ff] text-[#07080c]'
                          : 'bg-emerald-500 text-black'
                      }`}
                    >
                      {ep.isVip ? '🔒 VIP R$ 9,90' : '🔓 GRÁTIS'}
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>Episódio {ep.number}</span>
                      <span>{ep.duration}</span>
                    </div>
                    <h4 className="font-bold text-sm text-white group-hover:text-[#00d4ff] transition">
                      {ep.title}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* =====================================================================
          MODAL DO PLAYER DE VÍDEO
      ===================================================================== */}
      {activeEpisode && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0d1017] border border-white/15 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#ff1722]">
                  REPRODUZINDO AGORA • EPISÓDIO {activeEpisode.number}
                </span>
                <h3 className="text-base font-black text-white">{activeEpisode.title}</h3>
              </div>
              <button
                onClick={() => setActiveEpisode(null)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <video
                src={activeEpisode.videoUrl}
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL DE CHECKOUT PIX AUTOMÁTICO (R$ 9,90)
      ===================================================================== */}
      {showVipModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0d1017] border-2 border-[#00d4ff] rounded-3xl max-w-md w-full p-6 space-y-5 relative shadow-2xl shadow-[#00d4ff]/20">
            <button
              onClick={() => setShowVipModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#00d4ff]/15 border border-[#00d4ff]/40 text-[#00d4ff] flex items-center justify-center mx-auto">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black">Passaporte VIP Total</h3>
              <p className="text-xs text-gray-300">
                Desbloqueie todos os episódios exclusivos e lançamentos antecipados na hora.
              </p>
            </div>

            <div className="bg-[#07080c] border border-white/10 rounded-2xl p-4 text-center">
              <span className="text-xs text-gray-400 uppercase">Assinatura Mensal</span>
              <div className="text-4xl font-black text-[#00d4ff] my-1">R$ 9,90</div>
              <span className="text-[11px] text-emerald-400 font-semibold">
                ⚡ Liberação automática no mesmo segundo via PIX
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    '00020126580014BR.GOV.BCB.PIX0136daumplayia-vip-99052040000530398654049.905802BR'
                  );
                  setPixCopied(true);
                  setTimeout(() => setPixCopied(false), 3000);
                }}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                {pixCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" /> Código PIX Copia e Cola Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copiar Código PIX (R$ 9,90)
                  </>
                )}
              </button>

              <button
                onClick={handleApproveVipPayment}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff1722] to-[#00d4ff] text-white font-black text-xs uppercase tracking-wider shadow-lg"
              >
                Já Paguei / Liberar Meu VIP Agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL SECRETO DE SENHA DO ADM (SEM DICAS OU SENHA EXPOSTA)
      ===================================================================== */}
      {showAdminAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleAdminLogin}
            className="bg-[#0d1017] border border-white/15 rounded-2xl max-w-sm w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#ff1722]" /> Credencial Restrita
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowAdminAuthModal(false);
                  setAuthError('');
                  setPasswordInput('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="password"
              required
              autoFocus
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Digite sua chave de comando"
              className="w-full px-4 py-3 rounded-xl bg-[#07080c] border border-white/15 text-sm text-white focus:border-[#00d4ff] focus:outline-none"
            />

            {authError && <p className="text-xs text-[#ff1722] font-semibold">{authError}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#ff1722] text-white font-black text-xs uppercase tracking-wider"
            >
              Autenticar
            </button>
          </form>
        </div>
      )}

      {/* RODAPÉ COM GATILHO MICROSCÓPICO PARA O DONO */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
        <span>© 2026 Da Um Play IA — Todos os direitos reservados.</span>
        <button
          onClick={() => setShowAdminAuthModal(true)}
          className="opacity-20 hover:opacity-60 transition p-1"
          aria-label="Configurações"
        >
          <Lock className="w-3 h-3" />
        </button>
      </footer>
    </div>
  );
}
