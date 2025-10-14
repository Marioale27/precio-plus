# PrecioPlus - Proyecto (Entrega)

Este ZIP contiene el proyecto React + Capacitor listo para compilar la app PrecioPlus (Android APK) y para probar en escritorio con Electron.

## Contenido
- `package.json` - dependencias y scripts
- `src/` - código fuente (App.jsx, components, main.jsx, styles.css)
- `capacitor.config.json` - configuración Capacitor
- `electron/` - archivos mínimos para empaquetar en Windows
- `index.html`

## Qué ya está implementado
- Interfaz principal con listado de productos.
- Agregar/Editar producto con campos: nombre, precio compra, margen, código de barras, stock, stock mínimo.
- Escáner demo (prompt) para pruebas en navegador. En Android nativo se debe activar plugin Barcode Scanner.
- Guardado automático local usando `localforage` (IndexedDB).
- Moneda por defecto: Pesos argentinos (ARS) en formato local.
- Botón flotante para agregar productos.

## Pasos para correr en desarrollo (tu PC)
1. Instalar Node.js (v18+ recomendado) y npm.
2. Abrir terminal en la carpeta del proyecto.
3. Ejecutar:
   ```
   npm install
   npm run dev
   ```
4. Abrir http://localhost:5173

## Generar APK Android (resumen)
1. Instalar Capacitor CLI e inicializar (si no lo hiciste):
   ```
   npm install @capacitor/cli @capacitor/core
   npx cap init precio-plus com.tuempresa.precioPlus
   ```
2. Build web:
   ```
   npm run build
   ```
3. Copiar a Android:
   ```
   npx cap add android
   npx cap copy
   npx cap open android
   ```
4. En Android Studio: configurar permisos (cámara), build > Build APK(s) y obtener el APK.

### Integrar scanner nativo (Android)
Recomendado: `@capawesome/capacitor-barcode-scanner`
```
npm install @capawesome/capacitor-barcode-scanner
npx cap sync
```
Luego reemplazar el `ScannerModal` por la implementación nativa (ejemplo en README abajo).

## Backup en la nube - Firebase (opción recomendada)
1. Crear proyecto en https://console.firebase.google.com
2. Activar Firestore o Realtime Database.
3. Crear credenciales (web) y pegar la configuración en `src/firebaseConfig.js` (archivo a crear).
4. Instalar Firebase:
   ```
   npm install firebase
   ```
5. En el código: inicializar Firebase y subir/descargar `products` para copia de seguridad.

> Nota sobre Google Drive: Integrar Drive requiere configurar OAuth consent y manejo de tokens. Te dejo instrucciones para hacerlo manualmente si querés que lo incorpore luego.

## Siguientes pasos que yo te doy (si querés)
- Te guío paso a paso por videollamada o chat para generar el APK en tu PC.
- Te muestro exactamente dónde pegar la configuración de Firebase y cómo activarla.
- Puedo preparar una versión firmada (si me proporcionás keystore) o guiarte para firmarla.

