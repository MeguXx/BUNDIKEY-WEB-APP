import React, { useState, useEffect, useMemo } from 'react';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../infrastructure/firebase';
import type { Pedido, CatalogItem, TipoAtencion } from '../../domain/types';
import { districtFees } from '../../constants/catalog';
import { COLORS } from '../../constants/theme';
import { webStyles } from '../styles/webStyles';
import { useAuth } from '../../infrastructure/AuthContext';
import { enviarMensaje } from '../../infrastructure/chatRepository';

interface Props {
  pedido: Pedido | null;
  products: CatalogItem[];
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const PedidoFormModal: React.FC<Props> = ({ pedido, products, onClose, onDelete }) => {
  const { dbUser } = useAuth();
  const [tipoAtencion, setTipoAtencion] = useState<TipoAtencion>(pedido?.tipoAtencion || 'MESA');
  const [numeroMesa, setNumeroMesa] = useState(pedido?.numeroMesa || '1');
  const [clienteNombre, setClienteNombre] = useState(pedido?.clienteNombre || '');
  const [telefono, setTelefono] = useState(pedido?.telefono || '');
  const [direccionEntrega, setDireccionEntrega] = useState(pedido?.direccionEntrega || '');
  const [distrito, setDistrito] = useState(pedido?.distrito || 'Lince');
  
  const [personalServicio] = useState(pedido?.personalServicio || dbUser?.nombre || 'Personal');
  const [selectedMap, setSelectedMap] = useState<Record<string, { qty: number; price: number }>>({});

  const tiposPermitidos: TipoAtencion[] = dbUser?.rol === 'SALA' ? ['MESA', 'PARA_LLEVAR'] : ['MESA', 'PARA_LLEVAR', 'DELIVERY', 'EVENTO'];

  useEffect(() => {
    if (pedido?.producto) {
      const parts = pedido.producto.split(',');
      const map: Record<string, { qty: number; price: number }> = {};
      parts.forEach((p) => {
        const match = p.trim().match(/^(\d+)\s*x\s*(.+)$/i);
        if (match) {
          const qty = Number(match[1]);
          const name = match[2].trim();
          const item = products.find((prod) => prod.title === name);
          map[name] = { qty, price: item ? item.price : 0 };
        }
      });
      setSelectedMap(map);
    }
  }, [pedido, products]);

  const toggleProduct = (p: CatalogItem) => {
    setSelectedMap((prev) => {
      const next = { ...prev };
      if (next[p.title]) delete next[p.title];
      else next[p.title] = { qty: 1, price: p.price };
      return next;
    });
  };

  const updateQty = (e: React.MouseEvent, pName: string, delta: number) => {
    e.stopPropagation();
    setSelectedMap((prev) => {
      if (!prev[pName]) return prev;
      const nextQty = Math.max(1, prev[pName].qty + delta);
      return { ...prev, [pName]: { ...prev[pName], qty: nextQty } };
    });
  };

  const itemsTotal = useMemo(() => Object.keys(selectedMap).reduce((sum, key) => sum + selectedMap[key].qty * selectedMap[key].price, 0), [selectedMap]);
  const productsByCategory = useMemo(() => {
    const groups: Record<string, CatalogItem[]> = {};
    products.forEach(p => { if (!groups[p.category]) groups[p.category] = []; groups[p.category].push(p); });
    return groups;
  }, [products]);

  const isEnvio = tipoAtencion === 'DELIVERY' || tipoAtencion === 'EVENTO';
  const deliveryFee = isEnvio ? districtFees[distrito] || 5 : 0;
  const grandTotal = itemsTotal + deliveryFee;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEnvio && !clienteNombre.trim()) return alert('Ingresa el nombre del cliente para el envío.');
    const selectedKeys = Object.keys(selectedMap);
    if (selectedKeys.length === 0) return alert('Selecciona al menos un producto.');

    const productoString = selectedKeys.map((k) => `${selectedMap[k].qty} x ${k}`).join(', ');
    const totalCantidad = selectedKeys.reduce((sum, k) => sum + selectedMap[k].qty, 0);

    const payload: Partial<Pedido> = {
      tipoAtencion,
      clienteNombre: tipoAtencion === 'MESA' ? '' : clienteNombre,
      telefono: tipoAtencion === 'MESA' ? '' : telefono,
      numeroMesa: tipoAtencion === 'MESA' ? numeroMesa : '',
      direccionEntrega: isEnvio ? direccionEntrega : '',
      distrito: isEnvio ? distrito : '',
      personalServicio,
      producto: productoString,
      cantidad: totalCantidad,
      precio: grandTotal,
      prioridad: 'NORMAL',
      estado: pedido?.estado || 'PENDIENTE',
      fechaRegistro: pedido?.fechaRegistro || new Date().toISOString(),
    };

    const docId = pedido ? pedido.id : Date.now().toString();
    await setDoc(doc(db, 'pedidos', docId), { id: docId, ...payload }, { merge: true });

    if (pedido && dbUser?.rol === 'CAJA') {
      await enviarMensaje('SISTEMA', 'ALERTA', `El usuario ${dbUser.nombre} (CAJA) modificó el pedido de ${pedido.clienteNombre || 'Mesa '+pedido.numeroMesa}`);
    }

    onClose();
  };

  return (
    <div style={webStyles.modalOverlay}>
      <div style={{ ...webStyles.modalContent, maxWidth: '1100px', width: '95%', padding: '20px 30px' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            {tiposPermitidos.map((t) => (
              <button key={t} type="button" onClick={() => setTipoAtencion(t)} style={{ ...webStyles.chipOptionBtn, flex: 1, padding: '10px', fontSize: '13px', ...(tipoAtencion === t ? webStyles.chipOptionSelected : {}) }}>
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div style={{ backgroundColor: COLORS.fondoHeader, padding: '15px', borderRadius: '10px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
            {tipoAtencion === 'MESA' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{...webStyles.label, marginBottom: 0}}>Mesa:</label>
                <select value={numeroMesa} onChange={(e) => setNumeroMesa(e.target.value)} style={{...webStyles.input, width: '120px', padding: '6px', fontWeight: 'bold'}}>
                  {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={(i + 1).toString()}>Mesa {i + 1}</option>)}
                </select>
              </div>
            )}
            {tipoAtencion !== 'MESA' && (
              <>
                <input type="text" maxLength={40} value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} placeholder="Nombre del Cliente" required={isEnvio} style={{...webStyles.input, flex: 1}} />
                <input type="tel" maxLength={15} value={telefono} onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))} placeholder="Celular (Opcional)" required={isEnvio} style={{...webStyles.input, width: '140px'}} />
              </>
            )}
            {isEnvio && (
              <>
                <input type="text" maxLength={80} value={direccionEntrega} onChange={(e) => setDireccionEntrega(e.target.value)} placeholder="Dirección" required style={{...webStyles.input, flex: 2}} />
                <select value={distrito} onChange={(e) => setDistrito(e.target.value)} style={{...webStyles.input, width: '150px'}}>
                  {Object.keys(districtFees).map((d) => <option key={d} value={d}>{d} (+S/ {districtFees[d]})</option>)}
                </select>
              </>
            )}
          </div>

          <div>
            <div style={{ maxHeight: '45vh', overflowY: 'auto', paddingRight: '5px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', marginTop: '5px' }}>
                {Object.keys(productsByCategory).map(category => (
                  <React.Fragment key={category}>
                    <div style={{ gridColumn: '1 / -1', fontSize: '16px', fontWeight: 'bold', color: COLORS.chocolate, marginTop: '10px', borderBottom: `2px solid ${COLORS.fondoHeader}`, paddingBottom: '6px' }}>{category}</div>
                    {productsByCategory[category].map((p) => {
                      const isSel = Boolean(selectedMap[p.title]);
                      return (
                        <div key={p.id} onClick={() => toggleProduct(p)} style={{ padding: '10px 8px', borderRadius: '12px', border: `2px solid ${isSel ? COLORS.verde : COLORS.vainilla}`, backgroundColor: isSel ? '#F0F9F0' : COLORS.blanco, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '120px', boxShadow: '0 4px 10px rgba(65, 44, 39, 0.05)', transition: 'all 0.2s ease', transform: isSel ? 'scale(0.98)' : 'none' }}>
                          <div style={{ fontSize: '13px', fontWeight: 'bold', color: COLORS.chocolate, marginBottom: '6px', lineHeight: '1.2' }}>{p.title}</div>
                          <div style={{ fontSize: '12px', color: COLORS.moca, fontWeight: 'bold' }}>S/ {p.price.toFixed(2)}</div>
                          {isSel && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                              <button type="button" onClick={(e) => updateQty(e, p.title, -1)} style={{ backgroundColor: COLORS.chocolate, color: COLORS.blanco, border: 'none', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                              <span style={{ fontWeight: '900', fontSize: '16px', color: COLORS.chocolate }}>{selectedMap[p.title].qty}</span>
                              <button type="button" onClick={(e) => updateQty(e, p.title, 1)} style={{ backgroundColor: COLORS.chocolate, color: COLORS.blanco, border: 'none', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div style={{...webStyles.summaryBoxModal, fontSize: '16px', padding: '15px'}}>
            <span>Subtotal: <strong>S/ {itemsTotal.toFixed(2)}</strong></span>
            {isEnvio && <span> + Delivery: <strong>S/ {deliveryFee.toFixed(2)}</strong></span>}
            <span style={{ color: COLORS.chocolate, fontSize: '20px' }}>Total: <strong>S/ {grandTotal.toFixed(2)}</strong></span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{...webStyles.primaryBtn, flex: 2, padding: '12px'}}>Guardar</button>
            {pedido && (
              <button type="button" onClick={() => onDelete(pedido.id)} style={{...webStyles.deleteBtnModal, flex: 1, padding: '12px'}}>Eliminar</button>
            )}
            <button type="button" onClick={onClose} style={{...webStyles.cancelBtnModal, flex: 1, padding: '12px'}}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};