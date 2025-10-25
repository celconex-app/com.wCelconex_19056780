
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import GradientButton from '@/components/ui/GradientButton';
import DataCard from '@/components/ui/DataCard';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('day');
  const [totalShared, setTotalShared] = useState('47.2 GB');
  const [totalEarned, setTotalEarned] = useState('$23.60');
  const [avgSpeed, setAvgSpeed] = useState('42.8 Mbps');

  const periods = [
    { key: 'day', label: 'Hoy' },
    { key: 'week', label: 'Semana' },
    { key: 'month', label: 'Mes' },
  ];

  const connectionHistory = [
    { time: '14:30', device: 'iPhone 15', data: '2.4 GB', duration: '1h 45m' },
    { time: '12:15', device: 'MacBook Pro', data: '5.8 GB', duration: '3h 22m' },
    { time: '09:45', device: 'Samsung S24', data: '1.2 GB', duration: '45m' },
    { time: '08:20', device: 'iPad Air', data: '3.1 GB', duration: '2h 10m' },
  ];

  const networkQualityData = [
    { label: 'Excelente', value: 65, color: Colors.success },
    { label: 'Buena', value: 25, color: Colors.accent },
    { label: 'Regular', value: 8, color: Colors.warning },
    { label: 'Mala', value: 2, color: Colors.error },
  ];

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.surface]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <GradientButton
            title="← Volver"
            onPress={() => router.back()}
            variant="secondary"
            style={styles.backButton}
          />
          <Text style={styles.title}>Análisis y Estadísticas</Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <GradientButton
              key={period.key}
              title={period.label}
              onPress={() => setSelectedPeriod(period.key)}
              variant={selectedPeriod === period.key ? 'primary' : 'secondary'}
              style={styles.periodButton}
            />
          ))}
        </View>

        {/* Main Stats */}
        <View style={styles.statsGrid}>
          <DataCard
            title="Datos Compartidos"
            value={totalShared}
            subtitle="↑ 15% vs período anterior"
            icon="share"
            trend="up"
          />
          
          <DataCard
            title="Ingresos Generados"
            value={totalEarned}
            subtitle="Por compartir datos"
            icon="monetization-on"
            trend="up"
          />
          
          <DataCard
            title="Velocidad Promedio"
            value={avgSpeed}
            subtitle="Rendimiento de red"
            icon="speed"
            trend="up"
          />
        </View>

        {/* Usage Chart Placeholder */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Uso de Datos por Hora</Text>
          <LinearGradient
            colors={[Colors.surface, Colors.surfaceLight]}
            style={styles.chartContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.chartPlaceholder}>
              <MaterialIcons name="trending-up" size={48} color={Colors.accent} />
              <Text style={styles.chartText}>Gráfico de uso en tiempo real</Text>
              <Text style={styles.chartSubtext}>Pico: 14:00 - 18:00 (68% del total)</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Network Quality */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calidad de Red</Text>
          <LinearGradient
            colors={[Colors.surface, Colors.surfaceLight]}
            style={styles.qualityContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {networkQualityData.map((item, index) => (
              <View key={index} style={styles.qualityItem}>
                <View style={styles.qualityInfo}>
                  <View style={[styles.qualityIndicator, { backgroundColor: item.color }]} />
                  <Text style={styles.qualityLabel}>{item.label}</Text>
                </View>
                <Text style={styles.qualityValue}>{item.value}%</Text>
              </View>
            ))}
          </LinearGradient>
        </View>

        {/* Connection History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historial de Conexiones</Text>
          {connectionHistory.map((connection, index) => (
            <LinearGradient
              key={index}
              colors={[Colors.surface, Colors.surfaceLight]}
              style={styles.historyItem}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.historyInfo}>
                <MaterialIcons name="smartphone" size={24} color={Colors.accent} />
                <View style={styles.historyText}>
                  <Text style={styles.historyDevice}>{connection.device}</Text>
                  <Text style={styles.historyTime}>{connection.time} • {connection.duration}</Text>
                </View>
              </View>
              <Text style={styles.historyData}>{connection.data}</Text>
            </LinearGradient>
          ))}
        </View>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Métricas de Rendimiento</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <MaterialIcons name="signal-cellular-4-bar" size={32} color={Colors.success} />
              <Text style={styles.metricValue}>-67 dBm</Text>
              <Text style={styles.metricLabel}>Señal</Text>
            </View>
            
            <View style={styles.metricItem}>
              <MaterialIcons name="network-check" size={32} color={Colors.accent} />
              <Text style={styles.metricValue}>12ms</Text>
              <Text style={styles.metricLabel}>Latencia</Text>
            </View>
            
            <View style={styles.metricItem}>
              <MaterialIcons name="trending-up" size={32} color={Colors.warning} />
              <Text style={styles.metricValue}>99.2%</Text>
              <Text style={styles.metricLabel}>Uptime</Text>
            </View>
            
            <View style={styles.metricItem}>
              <MaterialIcons name="people" size={32} color={Colors.primary} />
              <Text style={styles.metricValue}>47</Text>
              <Text style={styles.metricLabel}>Conexiones</Text>
            </View>
          </View>
        </View>

        {/* Export Options */}
        <View style={styles.actions}>
          <GradientButton
            title="Exportar Reporte"
            onPress={() => console.log('Export report')}
            style={styles.actionButton}
          />
          
          <GradientButton
            title="Compartir Estadísticas"
            onPress={() => console.log('Share stats')}
            variant="secondary"
            style={styles.actionButton}
          />
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
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  periodButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
  },
  statsGrid: {
    marginBottom: 30,
  },
  chartSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  chartContainer: {
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartPlaceholder: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  chartText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 12,
  },
  chartSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 30,
  },
  qualityContainer: {
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  qualityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  qualityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qualityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  qualityLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  qualityValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  historyItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  historyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyText: {
    marginLeft: 12,
  },
  historyDevice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  historyTime: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  historyData: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  actions: {
    marginTop: 20,
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  },
});
