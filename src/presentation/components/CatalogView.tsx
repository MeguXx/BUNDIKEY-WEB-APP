import React, { useState } from 'react';
import type { CatalogItem } from '../../domain/types';
import { COLORS } from '../../constants/theme';
import { webStyles } from '../styles/webStyles';
import { useCatalog } from '../../infrastructure/CatalogContext';

export const CatalogView: React.FC = () => {
  const { products, updatePrice } = useCatalog();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempPrice, setTempPrice] = useState('');

  const handleUpdate = (item: CatalogItem) => {
    const val = Number(tempPrice.replace(',', '.'));
    if (isNaN(val) || val < 0) return alert('Ingresa un precio válido.');

    if (window.confirm(`¿Actualizar el precio de "${item.title}" de S/ ${item.price.toFixed(2)} a S/ ${val.toFixed(2)}?`)) {
      updatePrice(item.id, val);
      setEditingId(null);
    }
  };

  return (
    <div style={webStyles.catalogoContainer}>
      <h2 style={webStyles.sectionTitle}>Gestión de Precios e Inventario</h2>
      <p style={{ color: COLORS.moca, fontSize: '14px', marginBottom: '22px' }}>
        Haz clic en «Editar» para modificar el precio de cualquier producto. Se actualizará de inmediato para los
        nuevos pedidos.
      </p>

      <div style={webStyles.catalogoGrid}>
        {products.map((p) => (
          <div key={p.id} className="bk-card" style={webStyles.catalogCard}>
            <div>
              <span style={webStyles.categoryBadge}>{p.category}</span>
              <h3 style={{ margin: '8px 0 4px', color: COLORS.chocolate, fontSize: '15px' }}>{p.title}</h3>
              {p.description && <p style={{ margin: 0, color: COLORS.moca, fontSize: '13px' }}>{p.description}</p>}
            </div>

            <div style={webStyles.priceBox}>
              {editingId === p.id ? (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: COLORS.chocolate }}>S/</span>
                  <input
                    className="bk-input"
                    type="number"
                    step="0.5"
                    value={tempPrice}
                    onChange={(e) => setTempPrice(e.target.value)}
                    style={{ width: '80px', padding: '4px 8px', borderRadius: '6px', border: `1px solid ${COLORS.chocolate}` }}
                  />
                  <button className="bk-btn" onClick={() => handleUpdate(p)} style={webStyles.saveSmallBtn}>
                    ✓
                  </button>
                  <button className="bk-btn" onClick={() => setEditingId(null)} style={webStyles.cancelSmallBtn}>
                    ✕
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '15px', color: COLORS.chocolate }}>S/ {p.price.toFixed(2)}</strong>
                  <button
                    className="bk-btn"
                    onClick={() => {
                      setEditingId(p.id);
                      setTempPrice(p.price.toFixed(2));
                    }}
                    style={webStyles.editPriceBtn}
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
