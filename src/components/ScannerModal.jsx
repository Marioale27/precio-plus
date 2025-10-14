import React, { useEffect } from 'react';

/*
ScannerModal - demo implementation.
For Android native scanning replace with @capawesome/capacitor-barcode-scanner usage.
On web integrate QuaggaJS or ZXing for real scanning.
*/
export default function ScannerModal({onClose, onResult}) {
  useEffect(()=>{
    const code = prompt('Simular escaneo: ingresá código de barras (ej: 1234567890123)');
    if(code) onResult(code);
  },[]);
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{background:'white', padding:20, borderRadius:8}}>
        <div>Modo demo de escaneo. En Android nativo se usará el plugin de barcode scanner.</div>
        <div style={{marginTop:12, textAlign:'right'}}>
          <button onClick={onClose} style={{padding:8, borderRadius:6, background:'#e6eef7'}}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
