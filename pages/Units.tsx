
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { UNITS } from '../constants';
import { UnitType, Unit } from '../types';
import SEO from '../components/SEO';
import { 
  MapPin, 
  ArrowRight, 
  Phone, 
  Navigation, 
  Layers, 
  Map as MapIcon, 
  Cpu, 
  Zap, 
  Smartphone, 
  Activity, 
  Maximize, 
  Box,
  Layout as LayoutIcon,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const smartFeatures = [
  {
    title: 'Check-in Biométrico',
    description: 'Totens de autoatendimento com reconhecimento facial e integração total com o Super App.',
    icon: <Smartphone className="text-teal-500" />,
    coord: '01'
  },
  {
    title: 'Box de Coleta Express',
    description: 'Cabines ergonômicas projetadas para o fluxo Guepardo: coleta em menos de 3 minutos.',
    icon: <Zap className="text-orange-500" />,
    coord: '02'
  },
  {
    title: 'Triagem Automatizada',
    description: 'Sistema de esteira inteligente que separa e etiqueta amostras via Biologia Molecular instantânea.',
    icon: <Cpu className="text-blue-500" />,
    coord: '03'
  },
  {
    title: 'Brisa do Jajá Integrada',
    description: 'Difusores de aroma Tutti-frutti e som ambiente 8D para redução de ansiedade.',
    icon: <Activity className="text-pink-500" />,
    coord: '04'
  }
];

const layoutSpecs: Record<string, { id: string, description: string, areas: string[] }> = {
  'Compacto (35m²)': {
    id: 'CQJ-SMART-C',
    description: 'Otimização extrema para centros comerciais e pontos de alto fluxo. Foco em coleta rápida.',
    areas: ['Recepção Digital', '2 Boxes Coleta', 'Mini-Triagem']
  },
  'Linear (45m²)': {
    id: 'CQJ-SMART-L',
    description: 'Layout alongado para lojas de rua. Fluxo unidirecional perfeito para biossegurança.',
    areas: ['Recepção', '3 Boxes Coleta', 'Lab Satélite', 'DML']
  },
  'Hub (60m²)': {
    id: 'CQJ-SMART-H',
    description: 'Unidade completa com capacidade de processamento local e área kids expandida.',
    areas: ['Recepção VIP', '4 Boxes Coleta', 'Lab Processamento', 'Espaço Kids']
  }
};

// Fix for default marker icon in Leaflet
// @ts-ignore
import markerIcon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const ITEMS_PER_PAGE = 10;

// Component to update map center and bounds
const MapEffects = ({ units, userCoords, activeUnitId }: { units: Unit[], userCoords: { lat: number; lng: number } | null, activeUnitId: string | null }) => {
  const map = useMap();

  useEffect(() => {
    if (activeUnitId) {
      const unit = units.find(u => u.id === activeUnitId);
      if (unit) {
        map.setView([unit.coordinates.lat, unit.coordinates.lng], 16, { animate: true });
        return;
      }
    }

    if (userCoords) {
      map.setView([userCoords.lat, userCoords.lng], 14, { animate: true });
      return;
    }

    if (units.length > 0) {
      const bounds = L.latLngBounds(units.map(u => [u.coordinates.lat, u.coordinates.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [units, userCoords, activeUnitId, map]);

  return null;
};

const createCustomIcon = (color: string) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.2); display: flex; items-center justify-center;">
             <div style="width: 10px; height: 10px; background-color: white; border-radius: 50%; transform: rotate(45deg);"></div>
           </div>`,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const icons = {
  [UnitType.CLASSIC]: createCustomIcon('#0d9488'), // Teal
  [UnitType.AUTONOMOUS]: createCustomIcon('#f97316'), // Orange
  [UnitType.PROCESSING]: createCustomIcon('#3b82f6'), // Blue
};

// Função para calcular distância entre dois pontos (Haversine Formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const Units: React.FC = () => {
  const [selectedType, setSelectedType] = useState<UnitType | 'ALL'>('ALL');
  const [cityFilter, setCityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isProximityActive, setIsProximityActive] = useState(false);
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  const mapContainerRef = React.useRef<HTMLDivElement>(null);

  // Requisitar geolocalização
  const handleProximityToggle = () => {
    if (isProximityActive) {
      setIsProximityActive(false);
      setUserCoords(null);
      return;
    }

    if (!navigator.geolocation) {
      setGeoError("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsProximityActive(true);
        setGeoError(null);
      },
      (error) => {
        setGeoError("Não foi possível acessar sua localização. Verifique as permissões de GPS.");
        setIsProximityActive(false);
      }
    );
  };

  const filteredAndSortedUnits = useMemo(() => {
    let result = UNITS.filter(unit => {
      const typeMatch = selectedType === 'ALL' || unit.type === selectedType;
      const cityMatch = unit.city.toLowerCase().includes(cityFilter.toLowerCase());
      return typeMatch && cityMatch;
    });

    if (isProximityActive && userCoords) {
      result = [...result].sort((a, b) => {
        const distA = calculateDistance(userCoords.lat, userCoords.lng, a.coordinates.lat, a.coordinates.lng);
        const distB = calculateDistance(userCoords.lat, userCoords.lng, b.coordinates.lat, b.coordinates.lng);
        return distA - distB;
      });
    }

    return result;
  }, [selectedType, cityFilter, isProximityActive, userCoords]);

  // Reset to page 1 when filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, cityFilter, isProximityActive]);

  const totalPages = Math.ceil(filteredAndSortedUnits.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUnits = filteredAndSortedUnits.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <SEO 
        title="Unidades Smart e Pontos Logísticos - Coleta Já" 
        description="Localize as Smart Units, Pontos Logísticos e unidades no Litoral Paraibano da Coleta Já. Atendimento em João Pessoa, Cabedelo, Santa Rita, Bayeux, Conde e Lucena."
        keywords="unidades laboratório João Pessoa, Coleta Já Cabedelo, Coleta Já Santa Rita, Coleta Já Bayeux, Coleta Já Conde, Coleta Já Lucena"
      />
      <div className="max-w-7xl mx-auto px-6 pt-32">
        <header className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Plano de Ocupação Territorial</span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tighter uppercase">Rede Coleta Já - Paraíba</h1>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Nossa rede de Smart Units e Pontos Logísticos está estrategicamente distribuída em João Pessoa e em todo o Litoral Paraibano. Garantimos agilidade, tecnologia e o melhor atendimento em Cabedelo, Santa Rita, Bayeux, Conde e Lucena.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="px-4 py-2 bg-teal-50 text-teal-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-teal-100">
              🤝 Convênios Municipais Ativos
            </div>
            <div className="px-4 py-2 bg-orange-50 text-orange-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-orange-100">
              🚜 Coleta Rural com Frete Grátis
            </div>
          </div>
        </header>

        {/* Filters */}
        <section className="bg-white p-10 rounded-[40px] shadow-2xl shadow-teal-900/5 border border-teal-50 mb-16 flex flex-col md:flex-row gap-8 items-end" aria-label="Filtros">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 ml-1">Cidade / Região</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ex: João Pessoa, Cabedelo..." 
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all font-bold text-gray-700"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              />
              <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 text-teal-600 opacity-30" size={20} />
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 ml-1">Tipo de Unidade</label>
            <select 
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all font-bold appearance-none cursor-pointer text-gray-700"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as UnitType | 'ALL')}
            >
              <option value="ALL">Todas as Unidades</option>
              <option value={UnitType.CLASSIC}>Smart Units (Atendimento)</option>
              <option value={UnitType.AUTONOMOUS}>Guichês MAT (Logística)</option>
              <option value={UnitType.PROCESSING}>Hubs de Processamento</option>
            </select>
          </div>

          <div className="w-full md:w-auto">
             <button 
              onClick={handleProximityToggle}
              className={`w-full flex items-center justify-center px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all transform hover:-translate-y-1 shadow-xl ${
                isProximityActive 
                ? 'bg-teal-600 text-white shadow-teal-500/20' 
                : 'bg-white text-teal-600 border-2 border-teal-600 shadow-teal-900/5'
              }`}
            >
              <Navigation className={`mr-3 ${isProximityActive ? 'animate-pulse' : ''}`} size={16} />
              {isProximityActive ? 'Mais Próximas' : 'Ordenar por GPS'}
            </button>
          </div>
        </section>

        {geoError && (
          <div className="mb-8 p-6 bg-orange-50 border border-orange-100 text-orange-600 text-xs font-black rounded-3xl flex items-center animate-fade-in-down">
            <span className="mr-3 text-lg">🛰️</span> {geoError}
          </div>
        )}

        {/* Interactive Map */}
        <section 
          ref={mapContainerRef}
          className="mb-16 bg-white p-4 rounded-[40px] shadow-2xl shadow-teal-900/5 border border-teal-50 overflow-hidden h-[500px] relative z-0"
        >
          <MapContainer 
            center={[-7.1195, -34.8450]} 
            zoom={13} 
            style={{ height: '100%', width: '100%', borderRadius: '32px' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredAndSortedUnits.map(unit => (
              <Marker 
                key={unit.id} 
                position={[unit.coordinates.lat, unit.coordinates.lng]}
                icon={icons[unit.type] || icons[UnitType.CLASSIC]}
                eventHandlers={{
                  click: () => setActiveUnitId(unit.id)
                }}
              >
                <Popup className="custom-popup">
                  <div className="min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                       <div className={`w-2 h-2 rounded-full ${unit.type === UnitType.CLASSIC ? 'bg-teal-500' : 'bg-orange-500'}`}></div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{unit.city}</span>
                    </div>
                    <h4 className="font-black text-gray-900 uppercase text-xs mb-1">{unit.name}</h4>
                    <p className="text-[9px] text-gray-500 font-bold mb-3 leading-tight">{unit.address}</p>
                    <div className="flex gap-2">
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${unit.coordinates.lat},${unit.coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-teal-700 transition-colors"
                      >
                        <Navigation size={10} /> Como Chegar
                      </a>
                      {unit.type === UnitType.CLASSIC && (
                        <Link 
                          to={`/unidades/${unit.id}`}
                          className="px-3 py-1.5 border border-teal-600 text-teal-600 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-teal-50"
                        >
                          Detalhes
                        </Link>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            <MapEffects 
              units={filteredAndSortedUnits} 
              userCoords={userCoords} 
              activeUnitId={activeUnitId} 
            />

            {userCoords && (
              <Marker 
                position={[userCoords.lat, userCoords.lng]}
                icon={L.divIcon({
                  html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>',
                  className: '',
                  iconSize: [16, 16],
                  iconAnchor: [8, 8]
                })}
              >
                <Popup>Você está aqui</Popup>
              </Marker>
            )}
          </MapContainer>

          {/* Map Overlay Controls */}
          <div className="absolute bottom-10 right-10 z-[1000] flex flex-col gap-2">
             <button 
              onClick={() => setActiveUnitId(null)}
              className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/50 text-teal-600 hover:text-teal-700 transition-all font-black text-[10px] uppercase tracking-widest"
             >
               Ver Tudo
             </button>
          </div>
        </section>

        {/* Units List */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          {paginatedUnits.length > 0 ? (
            paginatedUnits.map(unit => {
              const distance = userCoords 
                ? calculateDistance(userCoords.lat, userCoords.lng, unit.coordinates.lat, unit.coordinates.lng)
                : null;
              
              const isLogisticHub = unit.type === UnitType.AUTONOMOUS || unit.type === UnitType.PROCESSING;

              return (
                <article key={unit.id} className="bg-white rounded-[50px] overflow-hidden shadow-xl shadow-teal-900/5 border border-teal-50 flex flex-col md:flex-row hover:shadow-2xl transition-all duration-500 group">
                  <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden bg-gray-100">
                    <img 
                      src={`https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600&h=600&seed=${unit.id}`} 
                      alt={unit.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                      loading="lazy"
                    />
                    <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase text-teal-600 shadow-xl border border-white/50 z-10">
                      {isLogisticHub ? 'Ponto Logístico' : 'Smart Unit'}
                    </div>
                    {distance !== null && (
                      <div className="absolute bottom-6 left-6 px-4 py-2 bg-orange-500 text-white rounded-2xl text-[10px] font-black shadow-xl z-10 animate-fade-in">
                        📍 {distance.toFixed(1)} km de você
                      </div>
                    )}
                  </div>
                  <div className="p-10 md:w-3/5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-teal-600 transition-colors leading-tight">{unit.name}</h3>
                      
                      {unit.layoutType && (
                        <div className="mb-6 flex items-center gap-3">
                          <div className="px-3 py-1 bg-teal-50 rounded-lg border border-teal-100 flex items-center gap-2">
                            <LayoutIcon size={12} className="text-teal-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-teal-700">Layout {unit.layoutType}</span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4 mb-8">
                        <div className="flex items-start text-xs text-gray-500 font-bold leading-relaxed">
                          <MapPin className="mr-4 text-teal-600 shrink-0" size={18} />
                          {unit.address}
                        </div>
                        {isLogisticHub ? (
                          <div className="flex items-center text-xs text-orange-500 font-black bg-orange-50 p-2 rounded-lg">
                            <Layers className="mr-3 shrink-0" size={18} />
                            Base Operacional Guepardo
                          </div>
                        ) : (
                          <div className="flex items-center text-xs text-gray-500 font-bold">
                            <Phone className="mr-4 text-teal-600 shrink-0" size={18} />
                            {unit.phone}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!isLogisticHub && (
                      <div className="flex flex-col gap-3">
                        <button 
                          onClick={() => {
                            setActiveUnitId(unit.id);
                            mapContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }}
                          className="w-full py-4 bg-white border-2 border-teal-600 text-teal-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-teal-50 transition"
                        >
                          Localizar no Mapa
                        </button>
                        <Link to={`/unidades/${unit.id}`} 
                           className="w-full py-4 bg-teal-600 text-center text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-teal-700 transition shadow-xl shadow-teal-500/10">
                          Ver Detalhes
                        </Link>
                      </div>
                    )}
                    {isLogisticHub && (
                       <div className="w-full py-4 bg-gray-100 text-center text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest">
                          Apenas Logística Interna
                       </div>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full text-center py-32 bg-white rounded-[60px] border-2 border-dashed border-teal-50">
              <p className="text-gray-400 font-black uppercase tracking-widest text-sm mb-6">Nenhuma unidade encontrada.</p>
              <button 
                onClick={() => {setCityFilter(''); setSelectedType('ALL'); setIsProximityActive(false);}}
                className="text-teal-600 font-black uppercase text-xs border-b-2 border-teal-600 pb-1"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex justify-center items-center space-x-4 pb-20">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-14 h-14 rounded-2xl font-black text-sm transition-all ${
                  currentPage === i + 1 
                    ? 'bg-teal-600 text-white shadow-2xl shadow-teal-500/20 scale-110' 
                    : 'bg-white border border-teal-50 text-gray-400 hover:bg-teal-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </nav>
        )}

        {/* Smart Infrastructure Section */}
        <section className="py-24 border-t border-gray-200">
          <div className="text-center mb-20">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-600 mb-4 block">Infraestrutura Smart v2.0</span>
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 uppercase tracking-tighter">Engenharia de <br/><span className="text-teal-600">Alta Performance</span></h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {smartFeatures.map((feature) => (
              <div key={feature.title} className="bg-white p-10 rounded-[40px] shadow-xl shadow-teal-900/5 border border-teal-50 group hover:-translate-y-2 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-black uppercase tracking-tight mb-4">{feature.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Layout Proposals */}
          <div className="bg-gray-900 rounded-[60px] p-12 lg:p-20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
            
            <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
              <div>
                <h3 className="text-3xl lg:text-4xl font-black text-white uppercase mb-8">Propostas de <br/><span className="text-teal-400">Layout Estratégico</span></h3>
                <div className="space-y-6">
                  {Object.entries(layoutSpecs).map(([name, spec]) => (
                    <div key={name} className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-teal-400 font-black uppercase tracking-widest text-xs">{name}</h4>
                        <span className="text-[10px] font-mono text-gray-500">{spec.id}</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4 font-medium">{spec.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {spec.areas.map(area => (
                          <span key={area} className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-bold text-gray-300 uppercase tracking-tighter">{area}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="aspect-video bg-black/40 rounded-[40px] border border-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 pointer-events-none" 
                       style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[80%] h-[70%] border-2 border-teal-500/30 rounded-2xl relative flex items-center justify-center">
                      <div className="absolute top-0 left-0 w-1/3 h-full border-r border-teal-500/30 flex items-center justify-center text-[8px] font-mono text-teal-500/50 uppercase">Recepção</div>
                      <div className="absolute top-0 right-0 w-2/3 h-full flex flex-col">
                        <div className="h-1/2 border-b border-teal-500/30 flex items-center justify-center text-[8px] font-mono text-teal-500/50 uppercase">Coleta</div>
                        <div className="h-1/2 flex items-center justify-center text-[8px] font-mono text-teal-500/50 uppercase">Triagem</div>
                      </div>
                      <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 w-full h-px bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.8)]"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                    <span className="text-[8px] font-mono text-teal-500 uppercase tracking-widest">Simulação de Fluxo Ativa</span>
                  </div>
                </div>
                <div className="mt-10 grid grid-cols-2 gap-6">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                    <h5 className="text-white font-black uppercase text-[10px] mb-2 tracking-widest">Eficiência Térmica</h5>
                    <p className="text-gray-500 text-[10px] font-medium">Filtros HEPA H14 integrados em todos os layouts.</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                    <h5 className="text-white font-black uppercase text-[10px] mb-2 tracking-widest">Conectividade</h5>
                    <p className="text-gray-500 text-[10px] font-medium">Rede 5G dedicada para transmissão de laudos.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Units;
