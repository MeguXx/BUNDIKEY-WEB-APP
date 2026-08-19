import React, { useMemo } from 'react';
import type { Pedido } from '../../domain/types';
import { COLORS } from '../../constants/theme';
import { webStyles } from '../styles/webStyles';

export const CierreCajaModal: React.FC<{ pedidos: Pedido[]; onClose: () => void }> = ({ pedidos, onClose }) => {
  const { pedidosHoy, totalCaja, productosVendidos } = useMemo(() => {
    const hoy = new Date().toISOString().split('T')[0];
    const entregados = pedidos.filter(p => p.fechaRegistro.startsWith(hoy) && p.estado === 'ENTREGADO');
    const total = entregados.reduce((sum, p) => sum + p.precio, 0);

    const conteo: Record<string, { qty: number; subtotal: number }> = {};
    entregados.forEach(p => {
      if (p.producto) {
        p.producto.split(',').forEach(item => {
          const match = item.trim().match(/^(\d+)\s*x\s*(.+)$/i);
          if (match) {
            const qty = parseInt(match[1], 10);
            const name = match[2];
            if (!conteo[name]) conteo[name] = { qty: 0, subtotal: 0 };
            conteo[name].qty += qty;
            conteo[name].subtotal += (p.precio / p.cantidad) * qty; 
          }
        });
      }
    });

    const listado = Object.entries(conteo).sort((a, b) => b[1].qty - a[1].qty);
    return { pedidosHoy: entregados, totalCaja: total, productosVendidos: listado };
  }, [pedidos]);

  const exportarExcel = () => {
    let csv = 'Fecha,Total Pedidos,Ingresos Totales\n';
    csv += `${new Date().toLocaleDateString('es-PE')},${pedidosHoy.length},S/ ${totalCaja.toFixed(2)}\n\n`;
    csv += 'Producto,Cantidad Vendida,Subtotal Aproximado\n';
    productosVendidos.forEach(([nombre, datos]) => {
      csv += `${nombre},${datos.qty},S/ ${datos.subtotal.toFixed(2)}\n`;
    });

    const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cierre_Caja_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div style={webStyles.modalOverlay}>
      <div style={{ ...webStyles.modalContent, maxWidth: '500px', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        <h3 style={{ ...webStyles.modalTitle, textAlign: 'center' }}>Cierre de Caja Operativo</h3>
        <p style={{ color: COLORS.moca, marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>
          Fecha: {new Date().toLocaleDateString('es-PE')}
        </p>
        
        <div style={{ backgroundColor: COLORS.fondoHeader, padding: '20px', borderRadius: '12px', border: `1px solid ${COLORS.vainilla}`, flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: COLORS.chocolate, fontSize: '16px', fontWeight: 'bold' }}>Transacciones Pagadas:</span>
            <span style={{ fontSize: '18px', fontWeight: '900', color: COLORS.verde }}>{pedidosHoy.length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span style={{ color: COLORS.chocolate, fontSize: '18px', fontWeight: 'bold' }}>Ingresos Totales:</span>
            <span style={{ fontSize: '24px', fontWeight: '900', color: COLORS.chocolate }}>S/ {totalCaja.toFixed(2)}</span>
          </div>

          <hr style={{ border: 'none', borderTop: `1.5px dashed ${COLORS.moca}`, margin: '15px 0' }} />
          
          <h4 style={{ color: COLORS.chocolate, margin: '0 0 12px', fontSize: '15px' }}>Resumen de Artículos Vendidos:</h4>
          {productosVendidos.length === 0 ? (
            <p style={{ color: COLORS.moca, fontSize: '14px', textAlign: 'center' }}>No hay ventas consolidadas hoy.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', color: COLORS.chocolate }}>
              {productosVendidos.map(([nombre, datos]) => (
                <li key={nombre} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${COLORS.vainilla}` }}>
                  <span style={{ flex: 2 }}>{nombre}</span>
                  <strong style={{ flex: 1, textAlign: 'center' }}>x{datos.qty}</strong>
                  <strong style={{ flex: 1, textAlign: 'right', color: COLORS.moca }}>S/ {datos.subtotal.toFixed(2)}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={exportarExcel} style={{ ...webStyles.primaryBtn, flex: 1, backgroundColor: COLORS.verde }}>Descargar Excel (CSV)</button>
          <button onClick={onClose} style={{ ...webStyles.cancelBtnModal, flex: 1 }}>Cerrar y Volver</button>
        </div>
      </div>
    </div>
  );
};