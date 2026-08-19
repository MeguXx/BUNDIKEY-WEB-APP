import React, { useState } from 'react';
import type { EstadoPedido } from '../../domain/types';
import { COLORS } from '../../constants/theme';
import { webStyles } from '../styles/webStyles';
import { useAuth } from '../../infrastructure/AuthContext';

const softColors = {
  caramelo: { bg: '#FDF3E1', border: '#F0D4A8', text: '#B87A2B' }, 
  fresa:    { bg: '#FDE8E9', border: '#F5C6C7', text: '#C85A5A' }, 
  azul:     { bg: '#EAF3F4', border: '#C2DADB', text: '#3A6368' }, 
  verde:    { bg: '#EAF2EB', border: '#C5DCC8', text: '#466D45' }, 
  rojo:     { bg: '#FAEOE0', border: '#EBB4B4', text: '#B84040' }, 
  gris:     { bg: '#F5F5F5', border: '#E0E0E0', text: '#9E9E9E' }, 
};

export function QuickStatusModal({ pedido, onClose, onUpdateState, onOpenEdit }: any) {
  const { dbUser } = useAuth();
  const [comprobante, setComprobante] = useState<'NONE'|'BOLETA'|'FACTURA'>('NONE');
  const [docIdentidad, setDocIdentidad] = useState('');
  const [showTicket, setShowTicket] = useState(false);

  const handleState = (estado: EstadoPedido) => {
    onUpdateState(pedido.id, estado);
    onClose();
  };

  const prepararTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (comprobante === 'FACTURA' && docIdentidad.length < 11) return alert('RUC inválido.');
    setShowTicket(true);
  };

  const confirmarVenta = () => handleState('ENTREGADO');
  const imprimirTicket = () => window.print();

  const isEnvio = pedido.tipoAtencion === 'DELIVERY' || pedido.tipoAtencion === 'EVENTO';
  const rol = dbUser?.rol;
  const isHistorial = pedido.estado === 'ENTREGADO' || pedido.estado === 'CANCELADO';
  const isListo = pedido.estado === 'LISTO' || pedido.estado === 'EN_CAMINO';
  
  // SOLO CAJA Y ADMIN PUEDEN EDITAR (Y SOLO SI NO ESTÁ EN EL HISTORIAL)
  const canEdit = !isHistorial && (rol === 'CAJA' || rol === 'ADMIN');

  const subtotal = (pedido.precio / 1.18).toFixed(2);
  const igv = (pedido.precio - Number(subtotal)).toFixed(2);
  const total = pedido.precio.toFixed(2);

  const SquareButton = ({ onClick, colorTheme, title, subtitle, disabled = false }: any) => (
    <button onClick={disabled ? undefined : onClick} style={{ backgroundColor: disabled ? softColors.gris.bg : colorTheme.bg, border: `2px solid ${disabled ? softColors.gris.border : colorTheme.border}`, borderRadius: '16px', padding: '15px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'not-allowed' : 'pointer', aspectRatio: '1', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', width: '100%', opacity: disabled ? 0.6 : 1 }}>
      <span style={{ fontSize: '12px', color: disabled ? softColors.gris.text : colorTheme.text, opacity: 0.8, marginBottom: '6px', fontWeight: '600' }}>{subtitle}</span>
      <span style={{ fontSize: '15px', color: disabled ? softColors.gris.text : colorTheme.text, fontWeight: '800' }}>{title}</span>
    </button>
  );

  return (
    <div style={webStyles.modalOverlay}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #ticket-area, #ticket-area * { visibility: visible; }
          #ticket-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; box-shadow: none; border: none; }
          .no-print { display: none !important; }
        }
      `}</style>
      
      <div style={{ ...webStyles.modalContent, position: 'relative', maxWidth: showTicket ? '400px' : '360px', textAlign: 'center', padding: showTicket ? '20px' : '30px 25px' }}>
        {!showTicket && <button onClick={onClose} style={webStyles.closeXBtn}>✕</button>}
        
        {comprobante === 'NONE' ? (
          <>
            <h3 style={{ color: COLORS.chocolate, margin: '5px 0 5px 0', fontSize: '24px' }}>
              {pedido.tipoAtencion === 'MESA' ? `Mesa ${pedido.numeroMesa}` : pedido.clienteNombre || 'Cliente'}
            </h3>
            <p style={{ color: COLORS.moca, marginBottom: '25px', fontWeight: 'bold', fontSize: '14px' }}>{pedido.tipoAtencion.replace('_', ' ')}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              {rol === 'SALA' && !isHistorial && (
                <>
                  <SquareButton colorTheme={softColors.caramelo} subtitle="Alertar a Cocina" title="PENDIENTE" onClick={() => handleState('PENDIENTE')} />
                  <SquareButton colorTheme={softColors.verde} subtitle={isListo ? "Finalizar y" : "Esperando a Cocina"} title="ENTREGAR" disabled={!isListo} onClick={() => setComprobante('BOLETA')} />
                </>
              )}
              {rol === 'COCINA' && !isHistorial && (
                <>
                  <SquareButton colorTheme={softColors.fresa} subtitle="Marcar" title="EN PREPARACIÓN" onClick={() => handleState('EN_PREPARACION')} />
                  <SquareButton colorTheme={softColors.verde} subtitle="Marcar como" title="LISTO" onClick={() => handleState('LISTO')} />
                </>
              )}
              {(rol === 'CAJA' || rol === 'ADMIN') && !isHistorial && (
                <>
                  <SquareButton colorTheme={softColors.caramelo} subtitle="Alertar a Cocina" title="PENDIENTE" onClick={() => handleState('PENDIENTE')} />
                  <SquareButton colorTheme={softColors.verde} subtitle="Forzar estado" title="LISTO" onClick={() => handleState('LISTO')} />
                  {isEnvio && <SquareButton colorTheme={softColors.azul} subtitle="Enviar a" title="RUTA" disabled={!isListo} onClick={() => handleState('EN_CAMINO')} />}
                  <SquareButton colorTheme={softColors.verde} subtitle={isListo ? "Cobrar y" : "Esperando a Cocina"} title="ENTREGAR" disabled={!isListo} onClick={() => setComprobante('BOLETA')} />
                </>
              )}
            </div>

            {(rol === 'CAJA' || rol === 'ADMIN' || rol === 'SALA') && !isHistorial && (
              <button onClick={() => handleState('CANCELADO')} style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: 'transparent', border: `1.5px dashed ${softColors.rojo.border}`, color: softColors.rojo.text, fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px' }}>
                Cancelar Pedido
              </button>
            )}

            {canEdit && (
              <div style={{ borderTop: `1px solid ${COLORS.vainilla}`, paddingTop: '15px' }}>
                <button onClick={onOpenEdit} style={{ ...webStyles.editPriceBtn, width: '100%', padding: '14px', fontSize: '14px', backgroundColor: COLORS.blanco, border: `1px solid ${COLORS.vainilla}` }}>
                  ✏️ Editar detalles del pedido
                </button>
              </div>
            )}
          </>
        ) : !showTicket ? (
          <form onSubmit={prepararTicket} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h4 style={{ margin: '0 0 10px', color: COLORS.chocolate }}>Emisión de Comprobante</h4>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setComprobante('BOLETA')} style={{ ...webStyles.chipOptionBtn, flex: 1, backgroundColor: comprobante === 'BOLETA' ? COLORS.chocolate : COLORS.blanco, color: comprobante === 'BOLETA' ? COLORS.blanco : COLORS.chocolate }}>Boleta</button>
              <button type="button" onClick={() => setComprobante('FACTURA')} style={{ ...webStyles.chipOptionBtn, flex: 1, backgroundColor: comprobante === 'FACTURA' ? COLORS.chocolate : COLORS.blanco, color: comprobante === 'FACTURA' ? COLORS.blanco : COLORS.chocolate }}>Factura</button>
            </div>
            <input type="text" value={docIdentidad} onChange={e => setDocIdentidad(e.target.value.replace(/\D/g, ''))} placeholder={comprobante === 'FACTURA' ? 'Ingrese RUC (11 dígitos)' : 'DNI (Opcional)'} required={comprobante === 'FACTURA'} style={webStyles.input} maxLength={comprobante === 'FACTURA' ? 11 : 8} />
            <button type="submit" style={{ ...webStyles.primaryBtn, backgroundColor: COLORS.verde }}>Generar Vista Previa</button>
            <button type="button" onClick={() => setComprobante('NONE')} style={{ ...webStyles.cancelBtnModal, padding: '12px' }}>Volver atrás</button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div id="ticket-area" style={{ backgroundColor: '#fff', color: '#000', fontFamily: '"Courier New", Courier, monospace', padding: '20px', textAlign: 'left', border: '1px solid #ccc', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: '13px', lineHeight: '1.4' }}>
              <h2 style={{ textAlign: 'center', margin: '0 0 5px', fontSize: '18px', fontWeight: 'bold' }}>BUNDIKEY S.A.C.</h2>
              <p style={{ textAlign: 'center', margin: 0 }}>RUC: 20601234567</p>
              <p style={{ textAlign: 'center', margin: '0 0 10px' }}>Av. Principal 123, Lince - Lima</p>
              <h3 style={{ textAlign: 'center', margin: '10px 0', borderBottom: '1px solid #000', paddingBottom: '5px', fontSize: '15px' }}>
                {comprobante} ELECTRÓNICA<br/>B001-000{Math.floor(Math.random() * 90000) + 10000}
              </h3>
              <p style={{ margin: '2px 0' }}><strong>CLIENTE:</strong> {pedido.clienteNombre || 'CLIENTE VARIOS'}</p>
              <p style={{ margin: '2px 0' }}><strong>DOC:</strong> {docIdentidad || 'S/N'}</p>
              <p style={{ margin: '2px 0' }}><strong>FECHA:</strong> {new Date().toLocaleString('es-PE')}</p>
              
              <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', margin: '10px 0', padding: '5px 0' }}>
                <div style={{ display: 'flex', fontWeight: 'bold', marginBottom: '5px' }}>
                  <span style={{ flex: 1 }}>CANT</span>
                  <span style={{ flex: 4 }}>PRODUCTO</span>
                </div>
                {pedido.producto.split(',').map((p: string, i: number) => {
                  const match = p.trim().match(/^(\d+)\s*x\s*(.+)$/i);
                  return (
                    <div key={i} style={{ display: 'flex', margin: '3px 0' }}>
                      <span style={{ flex: 1 }}>{match ? match[1] : '1'}</span>
                      <span style={{ flex: 4 }}>{match ? match[2] : p.trim()}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}><span>OP. GRAVADAS</span><span>S/ {subtotal}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}><span>I.G.V (18%)</span><span>S/ {igv}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0', fontSize: '16px', fontWeight: 'bold' }}><span>TOTAL VENTA</span><span>S/ {total}</span></div>
              
              <p style={{ textAlign: 'center', margin: '15px 0 10px', fontSize: '11px' }}>Representación impresa del comprobante.<br/>Gracias por su preferencia.</p>
              <div style={{ textAlign: 'center' }}>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=BundiKey-${pedido.id}`} alt="QR Code" style={{ width: '90px', height: '90px' }} />
              </div>
            </div>

            <div className="no-print" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button onClick={confirmarVenta} style={{ ...webStyles.primaryBtn, flex: 2, backgroundColor: COLORS.verde }}>Confirmar</button>
              <button onClick={imprimirTicket} style={{ ...webStyles.primaryBtn, flex: 1, backgroundColor: COLORS.azul }}>Imprimir</button>
              <button onClick={() => setShowTicket(false)} style={{ ...webStyles.cancelBtnModal, flex: 1, padding: '12px' }}>Volver</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}