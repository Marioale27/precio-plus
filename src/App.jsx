import React, { useEffect, useState } from 'react';
import localforage from 'localforage';
import ScannerModal from './components/ScannerModal';

const STORAGE_KEY = 'precio_plus_products_v2';

function currency(n){ return Number(n).toLocaleString('es-AR', {style:'currency', currency:'ARS', minimumFractionDigits:2}); }
function calcSale(cost, margin) { return Math.round((Number(cost) * (1 + Number(margin)/100)) * 100)/100; }

export default function App(){
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  // form fields
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [margin, setMargin] = useState(35);
  const [barcode, setBarcode] = useState('');
  const [stock, setStock] = useState(1);
  const [minStock, setMinStock] = useState(1);

  useEffect(()=>{
    localforage.getItem(STORAGE_KEY).then(v => {
      if(v) setProducts(v);
    });
  },[]);

  useEffect(()=>{ localforage.setItem(STORAGE_KEY, products); }, [products]);

  function resetForm(){
    setName(''); setCost(''); setMargin(35); setBarcode(''); setStock(1); setMinStock(1); setEditing(null);
  }

  function saveProduct(){
    const c = parseFloat(String(cost).replace(',','.')) || 0;
    const m = Number(margin) || 0;
    const sale = calcSale(c,m);
    if(!name.trim()) return alert('Ingresá nombre');
    if(editing){
      setProducts(products.map(p => p.id===editing.id ? {...p, name:name.trim(), cost:c, margin:m, sale, barcode, stock:Number(stock), minStock:Number(minStock)} : p));
      resetForm(); setShowForm(false);
    } else {
      const item = { id: Date.now(), name: name.trim(), cost:c, margin:m, sale, barcode, stock:Number(stock), minStock:Number(minStock), createdAt:Date.now() };
      setProducts([item, ...products]);
      resetForm(); setShowForm(false);
    }
  }

  function onEdit(p){
    setEditing(p);
    setName(p.name); setCost(p.cost); setMargin(p.margin); setBarcode(p.barcode||''); setStock(p.stock||0); setMinStock(p.minStock||1);
    setShowForm(true);
  }

  function removeProduct(id){
    if(!confirm('Eliminar producto?')) return;
    setProducts(products.filter(p => p.id !== id));
  }

  function sellOne(id, qty=1){
    setProducts(products.map(p => {
      if(p.id !== id) return p;
      const newStock = Number(p.stock) - Number(qty);
      return {...p, stock: newStock < 0 ? 0 : newStock};
    }));
  }

  function onScanResult(code){
    setShowScanner(false);
    setBarcode(code || '');
    const found = products.find(p => p.barcode === code);
    if(found){
      if(confirm(`Encontrado "${found.name}". Vender 1 unidad?`)){
        sellOne(found.id, 1);
        return;
      } else {
        onEdit(found);
      }
    } else {
      setShowForm(true);
    }
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{minHeight:'100vh', background:'#ffffff', padding:16}}>
      <header style={{background:'#1e293b', color:'white', padding:20, borderRadius:12, marginBottom:12}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h1 style={{fontSize:22, margin:0}}>PrecioPlus</h1>
        </div>
        <p style={{opacity:0.9, marginTop:6}}>Gestión de precios e inventario</p>
      </header>

      <div style={{marginBottom:12}}>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar productos" style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #e2e8f0'}} />
      </div>

      <div style={{display:'grid', gap:12}}>
        {filtered.length === 0 && <div style={{color:'#64748b'}}>No hay productos. Agregá uno con +</div>}
        {filtered.map(p => (
          <div key={p.id} style={{padding:14, border:'1px solid #e6eef7', borderRadius:10, display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow: p.stock <= (p.minStock||1) ? '0 0 0 3px rgba(250,204,21,0.2)' : 'none'}}>
            <div>
              <div style={{fontWeight:700, fontSize:16}}>{p.name}</div>
              <div style={{color:'#64748b', marginTop:6}}>Compra: {currency(p.cost)} • Venta: {currency(p.sale)} • Margen: {p.margin}%</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontWeight:700}}>Stock {p.stock}</div>
              <div style={{display:'flex', gap:8, marginTop:8, justifyContent:'flex-end'}}>
                <button onClick={()=>sellOne(p.id,1)} style={{padding:'6px 10px', borderRadius:8, background:'#fef3c7'}}>Vender 1</button>
                <button onClick={()=>onEdit(p)} style={{padding:'6px 10px', borderRadius:8, background:'#e6f2ff'}}>Editar</button>
                <button onClick={()=>removeProduct(p.id)} style={{padding:'6px 10px', borderRadius:8, background:'#fee2e2'}}>Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={()=>{ setShowForm(true); resetForm(); }} style={{position:'fixed', right:20, bottom:20, width:56, height:56, borderRadius:28, background:'#1e293b', color:'white', fontSize:28, border:'none', boxShadow:'0 6px 18px rgba(0,0,0,0.12)'}}>+</button>

      {showForm && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'flex-end'}}>
          <div style={{background:'white', borderTopLeftRadius:12, borderTopRightRadius:12, width:'100%', padding:16}}>
            <h3 style={{margin:0, marginBottom:8}}>{editing ? 'Editar producto' : 'Nuevo producto'}</h3>
            <div style={{display:'grid', gap:8}}>
              <input placeholder="Nombre" value={name} onChange={e=>setName(e.target.value)} style={{padding:10, borderRadius:8, border:'1px solid #e6eef7'}} />
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
                <input placeholder="Precio de compra" value={cost} onChange={e=>setCost(e.target.value)} style={{padding:10, borderRadius:8, border:'1px solid #e6eef7'}} />
                <input placeholder="Margen %" value={margin} onChange={e=>setMargin(e.target.value)} style={{padding:10, borderRadius:8, border:'1px solid #e6eef7'}} />
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
                <input placeholder="Código de barras" value={barcode} onChange={e=>setBarcode(e.target.value)} style={{padding:10, borderRadius:8, border:'1px solid #e6eef7'}} />
                <button onClick={()=>setShowScanner(true)} style={{padding:10, borderRadius:8, background:'#1e293b', color:'white'}}>Escanear</button>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
                <input placeholder="Stock" value={stock} onChange={e=>setStock(e.target.value)} style={{padding:10, borderRadius:8, border:'1px solid #e6eef7'}} />
                <input placeholder="Stock mínimo alerta" value={minStock} onChange={e=>setMinStock(e.target.value)} style={{padding:10, borderRadius:8, border:'1px solid #e6eef7'}} />
              </div>
              <div style={{display:'flex', gap:8, marginTop:10}}>
                <button onClick={saveProduct} style={{flex:1, padding:10, borderRadius:8, background:'#059669', color:'white'}}>Guardar</button>
                <button onClick={()=>{ setShowForm(false); setEditing(null); }} style={{flex:1, padding:10, borderRadius:8, background:'#e6eef7'}}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showScanner && <ScannerModal onClose={()=>setShowScanner(false)} onResult={onScanResult} />}
    </div>
  );
}
