import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import WifiWaves from '@/components/ui/WifiWaves';
import GradientButton from '@/components/ui/GradientButton';
import DataCard from '@/components/ui/DataCard';
import NetworkMonitor from '@/components/ui/NetworkMonitor';
import AnimatedLogo from '@/components/ui/AnimatedLogo';

export default function DashboardScreen() {
  const [isSharing, setIsSharing] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const [dataShared, setDataShared] = useState(0); // MB shared today
  const [dataReceived, setDataReceived] = useState(0); // MB received today
  const [connectedDevices, setConnectedDevices] = useState(0);
  const [shareCode, setShareCode] = useState('');
  const [dataLimit, setDataLimit] = useState(500); // Daily limit in MB
  const [sessionDuration, setSessionDuration] = useState(0); // Current session duration in minutes
  const [receiverCode, setReceiverCode] = useState('');

    useEffect(() => {
    generateShareCode();
    
    // Simulate session timer
    let interval: ReturnType<typeof setTimeout>;
    if (isSharing || isReceiving) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
        // Simulate data transfer
        if (isSharing) {
          setDataShared(prev => prev + Math.random() * 2);
        }
        if (isReceiving) {
          setDataReceived(prev => prev + Math.random() * 1.5);
        }
      }, 60000); // Update every minute
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSharing, isReceiving]);

  const generateShareCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setShareCode(code);
  };

  const toggleSharing = () => {
    if (isSharing) {
      setIsSharing(false);
      setConnectedDevices(0);
      setSessionDuration(0);
      showAlert('Compartir Desactivado', 'Ya no estás compartiendo tus datos móviles');
    } else {
      if (dataShared >= dataLimit) {
        showAlert('Límite Alcanzado', 'Has alcanzado tu límite diario de datos compartidos');
        return;
      }
      setIsSharing(true);
      setSessionDuration(0);
      generateShareCode();
      showAlert('Compartir Activado', `Tu código de conexión es: ${shareCode}`);
    }
  };

  const connectToDevice = () => {
    if (!receiverCode || receiverCode.length !== 6) {
      showAlert('Error', 'Ingresa un código de conexión válido de 6 dígitos');
      return;
    }
    
    setIsReceiving(true);
    setSessionDuration(0);
    showAlert('Conectado', `Conectado exitosamente al dispositivo con código ${receiverCode}`);
  };

  const disconnectReceiver = () => {
    setIsReceiving(false);
    setSessionDuration(0);
    setReceiverCode('');
    showAlert('Desconectado', 'Te has desconectado del dispositivo');
  };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      console.log(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleRequestConnection = () => {
    if (isSharing) {
      const newDeviceCount = connectedDevices + 1;
      setConnectedDevices(newDeviceCount);
      showAlert('Nueva Conexión', `Dispositivo ${newDeviceCount} se ha conectado`);
    }
  };

  const handleLogout = () => {
    showAlert('Cerrar Sesión', 'Sesión cerrada correctamente');
    router.replace('/');
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getDataUsagePercentage = () => {
    return Math.min((dataShared / dataLimit) * 100, 100);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.surface]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <AnimatedLogo size={60} showWaves={false} />
            <View>
              <Text style={styles.welcomeText}>¡Hola Usuario!</Text>
              <Text style={styles.statusText}>
                {isSharing && isReceiving ? 'Compartiendo y Recibiendo' : 
                 isSharing ? 'Compartiendo datos activamente' : 
                 isReceiving ? 'Recibiendo datos' : 'Listo para conectar'}
              </Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <GradientButton
              title="Salir"
              onPress={handleLogout}
              variant="secondary"
              style={styles.logoutButton}
            />
          </View>
        </View>

        {/* Connection Status */}
        <View style={styles.statusSection}>
          <WifiWaves size={120} active={isSharing || isReceiving} />
          
          {/* Data Usage Progress */}
          <LinearGradient
            colors={[Colors.surface, Colors.surfaceLight]}
            style={styles.progressCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.progressTitle}>Uso Diario de Datos</Text>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${getDataUsagePercentage()}%` }]} 
              />
            </View>
            <Text style={styles.progressText}>
              {dataShared.toFixed(1)} MB / {dataLimit} MB ({getDataUsagePercentage().toFixed(1)}%)
            </Text>
          </LinearGradient>
          
          {isSharing && (
            <LinearGradient
              colors={[Colors.surface, Colors.surfaceLight]}
              style={styles.codeCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.codeLabel}>Código de Conexión</Text>
              <Text style={styles.codeText}>{shareCode}</Text>
              <Text style={styles.codeSubtext}>Comparte este código para permitir conexiones</Text>
              {sessionDuration > 0 && (
                <Text style={styles.sessionInfo}>
                  Sesión activa: {formatDuration(sessionDuration)}
                </Text>
              )}
            </LinearGradient>
          )}
        </View>

        {/* Network Monitor */}
        <View style={styles.monitorSection}>
          <NetworkMonitor 
            isActive={isSharing || isReceiving} 
            onStatusChange={(status) => console.log('Network status:', status)}
          />
        </View>

        {/* Real-time Statistics */}
        <View style={styles.statsSection}>
          <DataCard
            title="Datos Compartidos Hoy"
            value={`${dataShared.toFixed(1)} MB`}
            subtitle={`${connectedDevices} dispositivos conectados`}
            icon="share"
            trend={dataShared > 0 ? 'up' : 'neutral'}
          />
          
          <DataCard
            title="Datos Recibidos Hoy"
            value={`${dataReceived.toFixed(1)} MB`}
            subtitle={isReceiving ? 'Recibiendo activamente' : 'Sin conexiones activas'}
            icon="get-app"
            trend={dataReceived > 0 ? 'up' : 'neutral'}
          />
          
          <DataCard
            title="Estado de Red"
            value="5G"
            subtitle="Señal excelente • 45.2 Mbps"
            icon="network-cell"
            trend="up"
          />
        </View>

        {/* Sharing Controls */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Control de Compartir</Text>
          
          <GradientButton
            title={isSharing ? 'Detener Compartir Datos' : 'Iniciar Compartir Datos'}
            onPress={toggleSharing}
            style={styles.mainAction}
          />
          
          {isSharing && (
            <View style={styles.sharingControls}>
              <GradientButton
                title="Generar Nuevo Código"
                onPress={generateShareCode}
                variant="secondary"
                style={styles.controlButton}
              />
              
              <GradientButton
                title="Simular Nueva Conexión"
                onPress={handleRequestConnection}
                variant="secondary"
                style={styles.controlButton}
              />
            </View>
          )}
        </View>

        {/* Receiving Controls */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Conectar a Otro Dispositivo</Text>
          
                    {!isReceiving ? (
            <View style={styles.connectSection}>
              <View style={styles.codeInputContainer}>
                <MaterialIcons name="vpn-key" size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.codeInput}
                  placeholder="Ingresa código de 6 dígitos"
                  value={receiverCode}
                  onChangeText={(text) => setReceiverCode(text.toUpperCase())}
                  maxLength={6}
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>
              
              <GradientButton
                title="Conectar"
                onPress={connectToDevice}
                style={styles.connectButton}
              />
            </View>
          ) : (
            <View style={styles.receivingStatus}>
              <Text style={styles.receivingText}>
                Conectado y recibiendo datos • {formatDuration(sessionDuration)}
              </Text>
              <GradientButton
                title="Desconectar"
                onPress={disconnectReceiver}
                variant="secondary"
                style={styles.disconnectButton}
              />
            </View>
          )}
        </View>

        {/* Advanced Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Herramientas Avanzadas</Text>
          
          <View style={styles.featuresGrid}>
            <GradientButton
              title="⚙️ Límites y Seguridad"
              onPress={() => router.push('/settings')}
              variant="secondary"
              style={styles.featureButton}
            />
            
            <GradientButton
              title="📊 Análisis Detallado"
              onPress={() => router.push('/analytics')}
              variant="secondary"
              style={styles.featureButton}
            />
            
            <GradientButton
              title="🚀 Test de Velocidad"
              onPress={() => router.push('/speed-test')}
              variant="secondary"
              style={styles.featureButton}
            />
            
            <GradientButton
              title="📱 Historial"
              onPress={() => showAlert('Próximamente', 'Historial completo de sesiones')}
              variant="secondary"
              style={styles.featureButton}
            />
          </View>
        </View>

        {/* Session Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <MaterialIcons 
              name={isSharing || isReceiving ? "wifi-tethering" : "wifi-off"} 
              size={24} 
              color={isSharing || isReceiving ? Colors.success : Colors.textSecondary} 
            />
            <Text style={styles.statValue}>
              {isSharing || isReceiving ? 'Activo' : 'Inactivo'}
            </Text>
            <Text style={styles.statLabel}>Estado</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialIcons name="timer" size={24} color={Colors.accent} />
            <Text style={styles.statValue}>{formatDuration(sessionDuration)}</Text>
            <Text style={styles.statLabel}>Sesión Actual</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialIcons name="security" size={24} color={Colors.success} />
            <Text style={styles.statValue}>Segura</Text>
            <Text style={styles.statLabel}>Conexión</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statusText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  headerActions: {
    alignItems: 'flex-end',
  },
  logoutButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  progressCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
    minWidth: 280,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  codeCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
    minWidth: 200,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  codeLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  codeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.accent,
    letterSpacing: 4,
    marginBottom: 8,
  },
  codeSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  sessionInfo: {
    fontSize: 14,
    color: Colors.success,
    marginTop: 8,
    fontWeight: '600',
  },
  monitorSection: {
    marginBottom: 20,
  },
  statsSection: {
    marginBottom: 30,
  },
  actionsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  mainAction: {
    marginBottom: 16,
  },
  sharingControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  controlButton: {
    flex: 1,
  },
  connectSection: {
    gap: 12,
  },
  codeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  codeInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    paddingVertical: 12,
    marginLeft: 12,
    backgroundColor: 'transparent',
  },
  connectButton: {
    width: '100%',
  },
  receivingStatus: {
    alignItems: 'center',
    gap: 12,
  },
  receivingText: {
    fontSize: 16,
    color: Colors.success,
    fontWeight: '600',
    textAlign: 'center',
  },
  disconnectButton: {
    width: '100%',
  },
  featuresSection: {
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureButton: {
    width: '48%',
    paddingVertical: 12,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});