const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const rtdb = admin.database();

// =====================================
// FUNCIÓN: Registrar nuevo release
// =====================================
exports.logCelconexRelease = functions.https.onCall(async (data, context) => {
  try {
    const releaseData = {
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      uid: context.auth?.uid || 'system',
      ip: context.rawRequest.ip,
    };

    const docRef = await db.collection('celconex_releases').add(releaseData);
    
    // También guardar en Realtime Database para notificaciones rápidas
    await rtdb.ref(`releases/${docRef.id}`).set({
      ...releaseData,
      id: docRef.id,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    console.log(`Release creado: ${docRef.id}`, releaseData);
    
    return { 
      success: true, 
      id: docRef.id,
      message: `Release ${data.versionName} registrado correctamente`
    };
    
  } catch (error) {
    console.error('Error creando release:', error);
    throw new functions.https.HttpsError(
      'internal', 
      'Error registrando release',
      error.message
    );
  }
});

// =====================================
// FUNCIÓN: Marcar release como subido
// =====================================
exports.markCelconexReleaseUploaded = functions.https.onCall(async (data, context) => {
  const { releaseId, duration, playStoreTrack, finalStatus } = data;
  
  try {
    const updateData = {
      status: finalStatus || 'success',
      uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      duration: duration,
      playStoreTrack: playStoreTrack,
      needsUpload: false
    };

    // Actualizar en Firestore
    await db.collection('celconex_releases').doc(releaseId).update(updateData);
    
    // Actualizar en Realtime Database
    await rtdb.ref(`releases/${releaseId}`).update({
      ...updateData,
      uploadedAt: Date.now(),
      updatedAt: Date.now()
    });

    console.log(`Release ${releaseId} marcado como ${finalStatus}`);
    
    return { 
      success: true, 
      message: `Release ${releaseId} actualizado a ${finalStatus}`
    };
    
  } catch (error) {
    console.error('Error actualizando release:', error);
    throw new functions.https.HttpsError(
      'internal', 
      'Error actualizando release',
      error.message
    );
  }
});

// =====================================
// FUNCIÓN: Actualizar estado de release
// =====================================
exports.updateCelconexReleaseStatus = functions.https.onCall(async (data, context) => {
  const { releaseId, status, duration, error } = data;
  
  try {
    const updateData = {
      status: status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      duration: duration,
      ...(error && { error: error })
    };

    await db.collection('celconex_releases').doc(releaseId).update(updateData);
    
    await rtdb.ref(`releases/${releaseId}`).update({
      ...updateData,
      updatedAt: Date.now()
    });

    console.log(`Release ${releaseId} estado actualizado a: ${status}`);
    
    return { 
      success: true, 
      message: `Estado actualizado a ${status}`
    };
    
  } catch (error) {
    console.error('Error actualizando estado:', error);
    throw new functions.https.HttpsError(
      'internal', 
      'Error actualizando estado',
      error.message
    );
  }
});

// =====================================
// TRIGGER: Notificar cambios de estado
// =====================================
exports.notifyReleaseStatus = functions.firestore
  .document('celconex_releases/{releaseId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const releaseId = context.params.releaseId;

    // Solo notificar si el estado cambió a uno final
    if (before.status !== after.status && 
        ['success', 'failed', 'live'].includes(after.status)) {
      
      try {
        // Actualizar en Realtime Database para notificaciones push
        await rtdb.ref(`notifications/${releaseId}`).set({
          releaseId: releaseId,
          developerId: after.developerId || '8729530839422072366',
          flavor: after.flavor,
          track: after.track,
          versionName: after.versionName,
          versionCode: after.versionCode,
          status: after.status,
          timestamp: Date.now(),
          message: getStatusMessage(after.status, after.flavor, after.versionName),
          ...(after.error && { error: after.error })
        });

        // Log para debugging
        console.log(`Notificación enviada para release ${releaseId}: ${before.status} → ${after.status}`);
        
        // Aquí podrías agregar más integraciones:
        // - Slack webhook
        // - Discord webhook  
        // - Email notification
        // - Push notification a dispositivos
        
      } catch (error) {
        console.error('Error enviando notificación:', error);
      }
    }
    
    return null;
  });

// =====================================
// FUNCIÓN: Obtener estadísticas de releases
// =====================================
exports.getCelconexReleaseStats = functions.https.onCall(async (data, context) => {
  try {
    const { days = 30, flavor = 'all', developerId = '8729530839422072366' } = data;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    let query = db.collection('celconex_releases')
      .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(cutoffDate))
      .where('developerId', '==', developerId);
    
    if (flavor !== 'all') {
      query = query.where('flavor', '==', flavor);
    }

    const snapshot = await query.get();
    const releases = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const stats = {
      total: releases.length,
      success: releases.filter(r => r.status === 'success').length,
      failed: releases.filter(r => r.status === 'failed').length,
      pending: releases.filter(r => r.status === 'uploading').length,
      byFlavor: {
        full: releases.filter(r => r.flavor === 'full').length,
        lite: releases.filter(r => r.flavor === 'lite').length
      },
      byTrack: {
        internal: releases.filter(r => r.track === 'internal').length,
        alpha: releases.filter(r => r.track === 'alpha').length,
        beta: releases.filter(r => r.track === 'beta').length,
        production: releases.filter(r => r.track === 'production').length
      },
      avgDuration: releases
        .filter(r => r.duration)
        .reduce((acc, r) => acc + r.duration, 0) / releases.filter(r => r.duration).length || 0
    };

    return { success: true, stats, releases };
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Error obteniendo estadísticas',
      error.message
    );
  }
});

// =====================================
// UTILIDADES
// =====================================
function getStatusMessage(status, flavor, versionName) {
  const flavorText = flavor === 'full' ? 'Celconex' : 'Celconex Lite';
  
  switch (status) {
    case 'success':
      return `✅ ${flavorText} ${versionName} subido exitosamente`;
    case 'failed':
      return `❌ Error subiendo ${flavorText} ${versionName}`;
    case 'live':
      return `🎉 ${flavorText} ${versionName} está ahora disponible en Play Store`;
    default:
      return `📱 ${flavorText} ${versionName} - Estado: ${status}`;
  }
}

// Exportar reglas de seguridad sugeridas
exports.getSecurityRules = functions.https.onCall(async (data, context) => {
  return {
    firestore: `
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /celconex_releases/{releaseId} {
            allow read: if request.auth != null;
            allow create: if request.auth != null;
            allow update: if request.auth != null && 
              request.auth.uid == resource.data.uid;
          }
        }
      }
    `,
    database: `
      {
        "rules": {
          "releases": {
            ".read": "auth != null",
            ".write": "auth != null"
          },
          "notifications": {
            ".read": "auth != null",
            ".write": false
          }
        }
      }
    `
  };
});