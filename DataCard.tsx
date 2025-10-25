import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface DataCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  trend?: 'up' | 'down' | 'neutral';
}

export default function DataCard({ title, value, subtitle, icon, trend = 'neutral' }: DataCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return Colors.success;
      case 'down': return Colors.error;
      default: return Colors.textSecondary;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      default: return 'trending-flat';
    }
  };

  return (
    <LinearGradient
      colors={[Colors.surface, Colors.surfaceLight]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        <MaterialIcons name={icon} size={24} color={Colors.accent} />
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <Text style={styles.value}>{value}</Text>
      
      {subtitle && (
        <View style={styles.footer}>
          <MaterialIcons 
            name={getTrendIcon() as keyof typeof MaterialIcons.glyphMap} 
            size={16} 
            color={getTrendColor()} 
          />
          <Text style={[styles.subtitle, { color: getTrendColor() }]}>
            {subtitle}
          </Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  value: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});