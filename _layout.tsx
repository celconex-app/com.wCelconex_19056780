
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import useAppUpdate from '@/hooks/useAppUpdate';
import UpdatePrompt from '@/components/ui/UpdatePrompt';
import UpdateProgress from '@/components/ui/UpdateProgress';

export default function RootLayout() {
  const {
    updateInfo,
    updateState,
    shouldShowUpdatePrompt,
    recommendedUpdateType,
    updatePriorityLevel,
    isUpdating,
    startUpdate,
    completeUpdate,
    dismissUpdate
  } = useAppUpdate();

  const [showProgress, setShowProgress] = useState(false);

  // Show progress modal for flexible updates
  React.useEffect(() => {
    if (updateState && ['pending', 'downloading', 'downloaded', 'installing'].includes(updateState.status)) {
      setShowProgress(true);
    } else {
      setShowProgress(false);
    }
  }, [updateState]);

  const handleStartUpdate = async (type?: 'immediate' | 'flexible') => {
    await startUpdate(type);
    if (type === 'flexible') {
      setShowProgress(true);
    }
  };

  const handleCompleteUpdate = async () => {
    await completeUpdate();
  };

  const handleDismissProgress = () => {
    // Only allow dismissing if not installing
    if (updateState?.status !== 'installing') {
      setShowProgress(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider>
          <StatusBar style="light" backgroundColor="#1a1a2e" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#0f0f1a' }
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="analytics" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="speed-test" />
          </Stack>

          {/* App Update Components */}
          <UpdatePrompt
            visible={shouldShowUpdatePrompt}
            updateInfo={updateInfo}
            recommendedType={recommendedUpdateType}
            priorityLevel={updatePriorityLevel}
            onUpdate={handleStartUpdate}
            onDismiss={dismissUpdate}
            isUpdating={isUpdating}
          />

          <UpdateProgress
            visible={showProgress}
            updateState={updateState || { status: 'pending', message: 'Preparing...' }}
            onComplete={handleCompleteUpdate}
            onDismiss={handleDismissProgress}
            allowBackground={recommendedUpdateType === 'flexible'}
          />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
