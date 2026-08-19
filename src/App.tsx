import { useEffect, useMemo, useRef, useState } from 'react';
import { AuthProvider, useAuth } from './infrastructure/AuthContext';
import { PedidoProvider, usePedido } from './infrastructure/PedidoContext';
import { CatalogProvider, useCatalog } from './infrastructure/CatalogContext';
import { useDeliveryEngine } from './infrastructure/useDeliveryEngine';
import { suscribirUsuarios } from './infrastructure/usuariosRepository';

import type { Pedido, TabPrincipal, UsuarioDB } from './domain/types';
import { COLORS } from './constants/theme';
import { webStyles } from './presentation/styles/webStyles';

import { AuthScreen } from './presentation/components/AuthScreen';
import { Header } from './presentation/components/Header';
import { TabBar } from './presentation/components/TabBar';
import { OrdersGrid } from './presentation/components/OrdersGrid';
import { CatalogView } from './presentation/components/CatalogView';
import { PedidoFormModal } from './presentation/components/PedidoFormModal';
import { TrackingModal } from './presentation/components/TrackingModal';
import { ProfileModal } from './presentation/components/ProfileModal';
import { QuickStatusModal } from './presentation/components/QuickStatusModal';
import { UsuariosAdminView } from './presentation/components/UsuariosAdminView';
import { ChatPanel } from './presentation/components/ChatPanel';
import { CierreCajaModal } from './presentation/components/CierreCajaModal';

import './presentation/styles/global.css';

function Dashboard() {
  const { user, dbUser } = useAuth();
  const { pedidos, cambiarEstado, eliminarPedido } = usePedido();
  const { products } = useCatalog();
  const { activeDeliveries, tick } = useDeliveryEngine(pedidos);
  void tick;

  const [activeTab, setActiveTab] = useState<TabPrincipal>('SALA');
  const [queryText, setQueryText] = useState('');
  const [usuarios, setUsuarios] = useState<UsuarioDB[]>([]);

  const [showPedidoModal, setShowPedidoModal] = useState(false);
  const [showQuickStatus, setShowQuickStatus] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showCierre, setShowCierre] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const [editingPedido, setEditingPedido] = useState<Pedido | null>(null);
  const [trackingPedido, setTrackingPedido] = useState<Pedido | null>(null);
  const [toast, setToast] = useState<{titulo: string, msg: string} | null>(null);

  const prevPedidosRef = useRef<Pedido[]>([]);
  const prevUsuariosRef = useRef<UsuarioDB[]>([]);

  useEffect(() => {
    if (prevPedidosRef.current.length > 0 && dbUser) {
      const nuevos = pedidos.filter(p => !prevPedidosRef.current.find(prev => prev.id === p.id));
      const listos = pedidos.filter(p => p.estado === 'LISTO' && prevPedidosRef.current.find(prev => prev.id === p.id && prev.estado !== 'LISTO'));
      
      if (nuevos.length > 0 && (dbUser.rol === 'COCINA' || dbUser.rol === 'ADMIN')) {
        setToast({ titulo: 'Nueva Orden', msg: 'Ha ingresado un nuevo pedido a cocina.' });
      }
      if (listos.length > 0 && (dbUser.rol === 'SALA' || dbUser.rol === 'CAJA' || dbUser.rol === 'ADMIN')) {
        const pListo = listos[0];
        if (pListo.personalServicio === dbUser.nombre || dbUser.rol === 'ADMIN' || dbUser.rol === 'CAJA') {
          setToast({ titulo: 'Pedido Listo', msg: `El pedido de ${pListo.clienteNombre || 'Mesa '+pListo.numeroMesa} está listo para recoger.` });
        }
      }
    }
    prevPedidosRef.current = pedidos;
  }, [pedidos, dbUser]);

  // Auto-cierre del toast: separado del efecto de arriba a propósito.
  // Antes, el setTimeout vivía dentro del efecto de [pedidos, dbUser] y leía
  // el valor de "toast" ANTES de que el setToast() de esa misma pasada surtiera
  // efecto (closure obsoleto de React), así que casi nunca se programaba el cierre
  // y las alertas se quedaban pegadas en pantalla. Este efecto reacciona al toast
  // real y siempre agenda (y limpia) su propio temporizador.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (dbUser?.rol === 'ADMIN') {
      const unsub = suscribirUsuarios((users) => {
        setUsuarios(users);
        if (prevUsuariosRef.current.length > 0) {
          const nuevosPendientes = users.filter(u => u.rol === 'PENDIENTE' && !prevUsuariosRef.current.find(prev => prev.uid === u.uid));
          if (nuevosPendientes.length > 0) setToast({ titulo: 'Nuevo Registro', msg: `${nuevosPendientes[0].nombre} solicita acceso.` });
        }
        prevUsuariosRef.current = users;
      });
      return () => unsub();
    }
  }, [dbUser]);

  const pendientesCount = usuarios.filter(u => u.rol === 'PENDIENTE').length;

  const filteredPedidos = useMemo(() => {
    let result = pedidos;

    if (dbUser?.rol === 'SALA') {
      result = result.filter(p => p.personalServicio === dbUser.nombre);
    }

    if (activeTab === 'SALA') {
      if (dbUser?.rol === 'COCINA') {
        result = result.filter(p => p.estado === 'PENDIENTE' || p.estado === 'EN_PREPARACION' || p.estado === 'LISTO');
      } else {
        result = result.filter(p => p.estado !== 'ENTREGADO' && p.estado !== 'CANCELADO' && (p.tipoAtencion === 'MESA' || p.tipoAtencion === 'PARA_LLEVAR'));
      }
    } else if (activeTab === 'ENVIOS') {
      result = result.filter(p => (p.tipoAtencion === 'DELIVERY' || p.tipoAtencion === 'EVENTO') && (p.estado !== 'ENTREGADO' && p.estado !== 'CANCELADO' || activeDeliveries[p.id]));
    } else if (activeTab === 'HISTORIAL') {
      result = result.filter(p => (p.estado === 'ENTREGADO' || p.estado === 'CANCELADO') && !activeDeliveries[p.id]);
    }

    const norm = queryText.trim().toLowerCase();
    if (norm) result = result.filter(p => (p.clienteNombre && p.clienteNombre.toLowerCase().includes(norm)) || (p.producto && p.producto.toLowerCase().includes(norm)) || (p.numeroMesa && p.numeroMesa.includes(norm)));
    
    return result;
  }, [pedidos, queryText, activeTab, activeDeliveries, dbUser]);

  if (!user || !dbUser) return null;

  return (
    <div style={webStyles.webLayout}>
      {toast && (
        <div style={webStyles.toast}>
          <div style={{flex: 1}}>
            <div style={{fontSize: '16px', fontWeight: 800, marginBottom: '4px'}}>{toast.titulo}</div>
            <div style={{fontSize: '13px', fontWeight: 400, opacity: 0.9, lineHeight: 1.4}}>{toast.msg}</div>
          </div>
          <button
            className="bk-btn"
            onClick={() => setToast(null)}
            aria-label="Cerrar aviso"
            style={{ background: 'rgba(255,255,255,0.12)', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 900, fontSize: '14px', lineHeight: 1, width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ✕
          </button>
        </div>
      )}

      <Header dbUser={dbUser} activeTab={activeTab} pendientesCount={pendientesCount} onNavigate={(tab) => setActiveTab(tab as any)} onOpenCierre={() => setShowCierre(true)} onToggleChat={() => setShowChat(!showChat)} />

      <main style={webStyles.mainContent}>
        {activeTab !== 'CATALOGO' && activeTab !== 'USUARIOS' && dbUser.rol !== 'COCINA' && (
          <TabBar activeTab={activeTab as any} onChange={setActiveTab as any} rol={dbUser.rol} />
        )}

        {activeTab !== 'CATALOGO' && activeTab !== 'USUARIOS' && (
          <input className="bk-input" type="text" value={queryText} onChange={(e) => setQueryText(e.target.value)} placeholder="Buscar pedido..." style={{ ...webStyles.searchInput, marginTop: dbUser.rol === 'COCINA' ? '20px' : '0' }} />
        )}

        {activeTab === 'CATALOGO' ? <CatalogView /> : activeTab === 'USUARIOS' ? <UsuariosAdminView /> : (
          <OrdersGrid pedidos={filteredPedidos} activeDeliveries={activeDeliveries} onOpenPedido={(p) => { setEditingPedido(p); setShowQuickStatus(true); }} onCambiarEstado={cambiarEstado} onRastrear={(p) => setTrackingPedido(p)} />
        )}

        {activeTab !== 'CATALOGO' && activeTab !== 'USUARIOS' && dbUser.rol !== 'COCINA' && (
          <button className="bk-fab" onClick={() => { setEditingPedido(null); setShowPedidoModal(true); }} style={webStyles.fabBtn}>+</button>
        )}
      </main>

      {showChat && <ChatPanel dbUser={dbUser} onClose={() => setShowChat(false)} />}
      {showCierre && <CierreCajaModal pedidos={pedidos} onClose={() => setShowCierre(false)} />}
      {showQuickStatus && editingPedido && <QuickStatusModal pedido={editingPedido} onClose={() => setShowQuickStatus(false)} onUpdateState={cambiarEstado} onOpenEdit={() => { setShowQuickStatus(false); setShowPedidoModal(true); }} onDelete={eliminarPedido} />}
      {showPedidoModal && <PedidoFormModal pedido={editingPedido} products={products} onClose={() => setShowPedidoModal(false)} onDelete={(id) => { eliminarPedido(id); setShowPedidoModal(false); }} />}
      {trackingPedido && activeDeliveries[trackingPedido.id] && <TrackingModal pedido={trackingPedido} deliveryState={activeDeliveries[trackingPedido.id]} onClose={() => setTrackingPedido(null)} />}
      {showProfileModal && <ProfileModal user={user} onClose={() => setShowProfileModal(false)} />}
    </div>
  );
}

function Root() {
  const { user, dbUser, loading } = useAuth();
  if (loading) return <div style={webStyles.centerContainer}><p style={{ color: COLORS.chocolate, fontWeight: 700 }}>Cargando BundiKey Web...</p></div>;
  if (!user || !dbUser) return <AuthScreen />;
  return <PedidoProvider><CatalogProvider><Dashboard /></CatalogProvider></PedidoProvider>;
}

export default function App() {
  return <AuthProvider><Root /></AuthProvider>;
}