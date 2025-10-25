# Celconex - Configuración de Google Play Integrity API

## 🎯 Resumen
Google Play Integrity API proporciona verificación avanzada de la integridad de la aplicación y el dispositivo para Celconex v2.2.1.

## 📋 Requisitos Previos
- Cuenta de Google Cloud Platform
- Acceso a Google Play Console
- Proyecto Celconex configurado en Firebase/Supabase

## 🔐 Paso 1: Generar Claves RSA

### 1.1 Ejecutar Generador de Claves
```bash
chmod +x scripts/generate-rsa-keys.sh
./scripts/generate-rsa-keys.sh
```

### 1.2 Resultado Esperado
- ✅ `keys/private.pem` - Clave privada (MANTENER SEGURA)
- ✅ `keys/public.pem` - Clave pública (SUBIR A GOOGLE)
- ✅ `keys/decrypt-api-keys.sh` - Script de desencriptación

## 🌐 Paso 2: Configurar en Google Play Console

### 2.1 Acceder a Play Integrity
1. Ve a [Google Play Console](https://play.google.com/console/u/1/developers/8729530839422072366/app/4975791825773366332)
2. Navega a **Release > Setup > App integrity**
3. Sección **Play Integrity API**

### 2.2 Subir Clave Pública
1. Click en **"Upload public key"**
2. Sube el archivo `keys/public.pem`
3. Click **"Save changes"**
4. Click **"Download encryption keys"**
5. Guarda el archivo `api_keys.enc`

## 🔓 Paso 3: Desencriptar Claves de API

### 3.1 Desencriptar Claves
```bash
# Mover archivo descargado
mv ~/Downloads/api_keys.enc keys/

# Desencriptar
cd keys
./decrypt-api-keys.sh
```

### 3.2 Verificar Claves
```bash
cat keys/api_keys.txt
```

Debe mostrar:
```
DECRYPTION_KEY=XXXXXXXXXXXXX
VERIFICATION_KEY=YYYYYYYYYYYYY
```

## ⚙️ Paso 4: Configurar Supabase

### 4.1 Configurar Play Integrity
```bash
chmod +x scripts/setup-play-integrity.sh
./scripts/setup-play-integrity.sh
```

### 4.2 Configurar Secretos
```bash
./setup-supabase-secrets.sh
```

### 4.3 Desplegar Edge Function
```bash
npx supabase functions deploy verify-play-integrity
```

## 🧪 Paso 5: Probar Integración

### 5.1 Verificar en la App
1. Abre Celconex en Android
2. Ve a **Configuración > Seguridad**
3. Verifica que muestre **"Seguridad Óptima"**

### 5.2 Verificar Logs
```bash
npx supabase functions logs verify-play-integrity
```

## 🔒 Consideraciones de Seguridad

### ✅ Buenas Prácticas
- ✅ Claves RSA guardadas de forma segura
- ✅ `private.pem` NUNCA en Git
- ✅ Secretos configurados en Supabase
- ✅ Edge Function para verificación server-side

### ❌ Evitar
- ❌ Exponer claves en código cliente
- ❌ Hardcodear tokens de integridad
- ❌ Saltarse verificación server-side

## 📊 Niveles de Seguridad

### 🟢 HIGH - Seguridad Óptima
- App reconocida por Play Store
- Dispositivo con Strong Integrity
- Licencia válida
- Entorno seguro (Play Protect OK)

### 🟡 MEDIUM - Seguridad Buena
- App reconocida con advertencias menores
- Dispositivo con Basic/Device Integrity
- Algunos riesgos ambientales detectados

### 🟠 LOW - Seguridad Limitada
- Algunos problemas de integridad
- Funcionalidad puede verse afectada

### 🔴 COMPROMISED - Seguridad Comprometida
- Fallos críticos de verificación
- Dispositivo o app potencialmente comprometidos

## 📞 Troubleshooting

### Error: "Claves no encontradas"
```bash
# Verificar que se desencriptaron correctamente
ls -la keys/
cat keys/api_keys.txt
```

### Error: "Edge Function failed"
```bash
# Verificar secretos en Supabase
npx supabase secrets list

# Verificar deployment
npx supabase functions list
```

### Error: "Package name mismatch"
Verificar que el package name en el código sea `com.celconex.app`

---
**Desarrollado para**: Celconex v2.2.1  
**Developer ID**: 8729530839422072366  
**Última actualización**: $(date)