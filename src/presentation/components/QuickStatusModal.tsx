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

export function QuickStatusModal({ pedido, onClose, onUpdateState, onOpenEdit, onDelete }: any) {
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

  const handleCancelar = () => {
    if (window.confirm('¿Seguro que deseas CANCELAR este pedido? Esta acción no se puede deshacer.')) {
      handleState('CANCELADO');
    }
  };

  const handleForzar = (estado: EstadoPedido, mensaje: string) => {
    if (window.confirm(mensaje)) handleState(estado);
  };

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
    <div id="qsm-overlay" style={webStyles.modalOverlay}>
      <style>{`
        @media print {
          @page { margin: 10mm; }
          body * { visibility: hidden; }
          #ticket-area, #ticket-area * { visibility: visible; }
          /* Estas tres capas envuelven el ticket con position:fixed + blur + centrado
             para la pantalla. Sin resetearlas, la hoja de impresión sale casi en blanco
             porque el ticket hereda ese posicionamiento "flotante". Para imprimir las
             volvemos estáticas y el ticket pasa a fluir normal desde la esquina de la hoja. */
          #qsm-overlay { position: static !important; background: none !important; backdrop-filter: none !important; padding: 0 !important; display: block !important; }
          #qsm-content { position: static !important; max-width: none !important; max-height: none !important; overflow: visible !important; box-shadow: none !important; border: none !important; padding: 0 !important; margin: 0 !important; background: none !important; }
          #ticket-area { position: static !important; width: 320px !important; margin: 0 auto !important; box-shadow: none !important; border: none !important; }
          .no-print { display: none !important; }
        }
      `}</style>
      
      <div id="qsm-content" style={{ ...webStyles.modalContent, position: 'relative', maxWidth: showTicket ? '400px' : '360px', textAlign: 'center', padding: showTicket ? '20px' : '30px 25px' }}>
        {!showTicket && <button onClick={onClose} style={webStyles.closeXBtn}>✕</button>}
        
        {comprobante === 'NONE' ? (
          <>
            <h3 style={{ color: COLORS.chocolate, margin: '5px 0 5px 0', fontSize: '24px', fontWeight: 800 }}>
              {pedido.tipoAtencion === 'MESA' ? `Mesa ${pedido.numeroMesa}` : pedido.clienteNombre || 'Cliente'}
            </h3>
            <p style={{ color: COLORS.moca, marginBottom: isHistorial ? '18px' : '25px', fontWeight: 'bold', fontSize: '14px' }}>{pedido.tipoAtencion.replace('_', ' ')}</p>

            {isHistorial ? (
              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'inline-block', padding: '5px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.4px', marginBottom: '16px', backgroundColor: pedido.estado === 'ENTREGADO' ? softColors.verde.bg : softColors.rojo.bg, color: pedido.estado === 'ENTREGADO' ? softColors.verde.text : softColors.rojo.text, border: `1px solid ${pedido.estado === 'ENTREGADO' ? softColors.verde.border : softColors.rojo.border}` }}>
                  {pedido.estado.replace('_', ' ')}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: COLORS.chocolate, borderTop: `1px solid ${COLORS.vainilla}`, paddingTop: '14px' }}>
                  <div><strong style={{ color: COLORS.moca, fontWeight: 700 }}>Atendido por:</strong> {pedido.personalServicio}</div>
                  {pedido.telefono && <div><strong style={{ color: COLORS.moca, fontWeight: 700 }}>Teléfono:</strong> {pedido.telefono}</div>}
                  {isEnvio && pedido.direccionEntrega && <div><strong style={{ color: COLORS.moca, fontWeight: 700 }}>Dirección:</strong> {pedido.direccionEntrega}{pedido.distrito ? ` (${pedido.distrito})` : ''}</div>}
                  <div><strong style={{ color: COLORS.moca, fontWeight: 700 }}>Productos:</strong> {pedido.producto}</div>
                  <div><strong style={{ color: COLORS.moca, fontWeight: 700 }}>Cantidad total:</strong> {pedido.cantidad}</div>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>Total: S/ {pedido.precio.toFixed(2)}</div>
                  <div style={{ fontSize: '12px', color: COLORS.moca }}>Registrado: {new Date(pedido.fechaRegistro).toLocaleString('es-PE')}</div>
                </div>

                {rol === 'ADMIN' && (
                  <div style={{ borderTop: `1px solid ${COLORS.vainilla}`, marginTop: '18px', paddingTop: '14px' }}>
                    <button
                      onClick={() => {
                        const nombreRef = pedido.clienteNombre || `Mesa ${pedido.numeroMesa}`;
                        if (window.confirm(`Este es un registro del HISTORIAL (venta ya cerrada de "${nombreRef}"). Eliminarlo borra la venta de forma permanente y afectará el cierre de caja. ¿Confirmas que deseas eliminarlo?`)) {
                          onDelete?.(pedido.id);
                          onClose();
                        }
                      }}
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'transparent', border: `1.5px dashed ${softColors.rojo.border}`, color: softColors.rojo.text, fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
                    >
                      Eliminar registro (Admin)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  {rol === 'SALA' && (
                    <>
                      <SquareButton colorTheme={softColors.caramelo} subtitle="Alertar a Cocina" title="PENDIENTE" onClick={() => handleState('PENDIENTE')} />
                      <SquareButton colorTheme={softColors.verde} subtitle={isListo ? "Finalizar y" : "Esperando a Cocina"} title="ENTREGAR" disabled={!isListo} onClick={() => setComprobante('BOLETA')} />
                    </>
                  )}
                  {rol === 'COCINA' && (
                    <>
                      <SquareButton colorTheme={softColors.fresa} subtitle="Marcar" title="EN PREPARACIÓN" onClick={() => handleState('EN_PREPARACION')} />
                      <SquareButton colorTheme={softColors.verde} subtitle="Marcar como" title="LISTO" onClick={() => handleState('LISTO')} />
                    </>
                  )}
                  {(rol === 'CAJA' || rol === 'ADMIN') && (
                    <>
                      <SquareButton colorTheme={softColors.caramelo} subtitle="Alertar a Cocina" title="PENDIENTE" onClick={() => handleState('PENDIENTE')} />
                      <SquareButton colorTheme={softColors.verde} subtitle="Forzar estado" title="LISTO" onClick={() => handleForzar('LISTO', '¿Forzar este pedido como LISTO sin pasar por cocina?')} />
                      {isEnvio && <SquareButton colorTheme={softColors.azul} subtitle="Enviar a" title="RUTA" disabled={!isListo} onClick={() => handleForzar('EN_CAMINO', '¿Confirmas despachar este pedido a reparto ahora?')} />}
                      <SquareButton colorTheme={softColors.verde} subtitle={isListo ? "Cobrar y" : "Esperando a Cocina"} title="ENTREGAR" disabled={!isListo} onClick={() => setComprobante('BOLETA')} />
                    </>
                  )}
                </div>

                {(rol === 'CAJA' || rol === 'ADMIN' || rol === 'SALA') && (
                  <button onClick={handleCancelar} style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: 'transparent', border: `1.5px dashed ${softColors.rojo.border}`, color: softColors.rojo.text, fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px' }}>
                    Cancelar Pedido
                  </button>
                )}

                {canEdit && (
                  <div style={{ borderTop: `1px solid ${COLORS.vainilla}`, paddingTop: '15px' }}>
                    <button onClick={onOpenEdit} style={{ ...webStyles.editPriceBtn, width: '100%', padding: '14px', fontSize: '14px', backgroundColor: COLORS.blanco, border: `1px solid ${COLORS.vainilla}` }}>
                      Editar detalles del pedido
                    </button>
                  </div>
                )}
              </>
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
              <p style={{ margin: '2px 0' }}><strong>ATENCIÓN:</strong> {pedido.tipoAtencion === 'MESA' ? `Mesa ${pedido.numeroMesa}` : pedido.tipoAtencion.replace('_', ' ')}</p>
              <p style={{ margin: '2px 0' }}><strong>ATENDIDO POR:</strong> {pedido.personalServicio}</p>
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