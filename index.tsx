import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import WifiWaves from '@/components/ui/WifiWaves';
import GradientButton from '@/components/ui/GradientButton';
import AnimatedLogo from '@/components/ui/AnimatedLogo';

export default function WelcomeScreen() {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'phone' | 'verify'>('welcome');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      console.log(`${title}: ${message}`);
    } else {
      // Alert implementation would go here
      console.log(`${title}: ${message}`);
    }
  };

  const handleSendCode = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      showAlert('Error', 'Por favor ingresa un número de teléfono válido');
      return;
    }

    setIsLoading(true);
    // Simular envío de SMS
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('verify');
      showAlert('Código Enviado', `Código de verificación enviado a ${phoneNumber}`);
    }, 2000);
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      showAlert('Error', 'Por favor ingresa el código de 6 dígitos');
      return;
    }

    setIsLoading(true);
    // Simular verificación
    setTimeout(() => {
      setIsLoading(false);
      showAlert('Verificación Exitosa', 'Tu número ha sido verificado correctamente');
      router.push('/dashboard');
    }, 1500);
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return text;
  };

  if (currentStep === 'welcome') {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
        <LinearGradient
          colors={[Colors.background, Colors.surface]}
          style={StyleSheet.absoluteFill}
        />
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Logo Section */}
          <View style={styles.logoSection}>
            <AnimatedLogo size={280} showWaves={true} />
            <Text style={styles.mainTitle}>CELCONEX</Text>
            <Text style={styles.tagline}>
              Comparte datos móviles en tiempo real de forma segura
            </Text>
          </View>

          {/* Features Overview */}
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>¿Cómo funciona?</Text>
            
            <View style={styles.featureItem}>
              <LinearGradient
                colors={[Colors.primary, Colors.accent]}
                style={styles.featureIcon}
              >
                <MaterialIcons name="smartphone" size={28} color={Colors.text} />
              </LinearGradient>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Verificación Segura</Text>
                <Text style={styles.featureDescription}>
                  Verifica tu identidad con tu número telefónico mediante SMS
                </Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <LinearGradient
                colors={[Colors.accent, Colors.success]}
                style={styles.featureIcon}
              >
                <MaterialIcons name="share" size={28} color={Colors.text} />
              </LinearGradient>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Compartir Instantáneo</Text>
                <Text style={styles.featureDescription}>
                  Genera códigos únicos para compartir tus datos móviles
                </Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <LinearGradient
                colors={[Colors.success, Colors.primary]}
                style={styles.featureIcon}
              >
                <MaterialIcons name="security" size={28} color={Colors.text} />
              </LinearGradient>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Control Total</Text>
                <Text style={styles.featureDescription}>
                  Monitorea el uso, establece límites y controla la seguridad
                </Text>
              </View>
            </View>
          </View>

          {/* CTA Button */}
          <View style={styles.ctaContainer}>
            <GradientButton
              title="Comenzar Verificación"
              onPress={() => setCurrentStep('phone')}
              style={styles.ctaButton}
            />
            
            <Text style={styles.disclaimerText}>
              Al continuar, aceptas nuestros términos de servicio y política de privacidad
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (currentStep === 'phone') {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
        <LinearGradient
          colors={[Colors.background, Colors.surface]}
          style={StyleSheet.absoluteFill}
        />
        
        <KeyboardAvoidingView 
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.verificationContainer}>
              <AnimatedLogo size={180} showWaves={false} />
              
              <Text style={styles.verificationTitle}>Verificación Telefónica</Text>
              <Text style={styles.verificationSubtitle}>
                Ingresa tu número de teléfono para recibir un código de verificación vía SMS
              </Text>

              <LinearGradient
                colors={[Colors.surface, Colors.surfaceLight]}
                style={styles.phoneCard}
              >
                <View style={styles.phoneInputContainer}>
                  <MaterialIcons name="phone" size={24} color={Colors.accent} />
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="(000) 000-0000"
                    placeholderTextColor={Colors.textSecondary}
                    value={phoneNumber}
                    onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
                    keyboardType="phone-pad"
                    maxLength={14}
                  />
                </View>
                
                <Text style={styles.phoneNote}>
                  Este número será usado para verificar tu identidad y enviar códigos de emparejamiento
                </Text>
              </LinearGradient>

              <View style={styles.verificationActions}>
                <GradientButton
                  title={isLoading ? 'Enviando...' : 'Enviar Código'}
                  onPress={handleSendCode}
                  disabled={isLoading}
                  style={styles.verificationButton}
                />
                
                <GradientButton
                  title="← Volver"
                  onPress={() => setCurrentStep('welcome')}
                  variant="secondary"
                  style={styles.backButton}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Verification Code Step
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.surface]}
        style={StyleSheet.absoluteFill}
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.verificationContainer}>
            <View style={styles.codeIconContainer}>
              <MaterialIcons name="sms" size={60} color={Colors.accent} />
            </View>
            
            <Text style={styles.verificationTitle}>Código de Verificación</Text>
            <Text style={styles.verificationSubtitle}>
              Ingresa el código de 6 dígitos que enviamos a {phoneNumber}
            </Text>

            <LinearGradient
              colors={[Colors.surface, Colors.surfaceLight]}
              style={styles.codeCard}
            >
              <TextInput
                style={styles.codeInput}
                placeholder="000000"
                placeholderTextColor={Colors.textSecondary}
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
              />
            </LinearGradient>

            <View style={styles.verificationActions}>
              <GradientButton
                title={isLoading ? 'Verificando...' : 'Verificar Código'}
                onPress={handleVerifyCode}
                disabled={isLoading}
                style={styles.verificationButton}
              />
              
              <GradientButton
                title="Reenviar Código"
                onPress={handleSendCode}
                variant="secondary"
                style={styles.resendButton}
              />
              
              <GradientButton
                title="← Cambiar Número"
                onPress={() => setCurrentStep('phone')}
                variant="secondary"
                style={styles.backButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 50,
    paddingTop: 40,
    paddingBottom: 20,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 20,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featuresTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 30,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  ctaContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  ctaButton: {
    width: '100%',
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
  },
  verificationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  verificationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  verificationSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  phoneCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    width: '100%',
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
  },
  phoneInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 18,
    paddingVertical: 12,
    marginLeft: 12,
    fontWeight: '600',
  },
  phoneNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  codeIconContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 40,
    padding: 20,
    marginBottom: 30,
    elevation: 4,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  codeCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    width: '100%',
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  codeInput: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    letterSpacing: 8,
  },
  verificationActions: {
    width: '100%',
    gap: 12,
  },
  verificationButton: {
    width: '100%',
  },
  backButton: {
    width: '100%',
  },
  resendButton: {
    width: '100%',
  },
});