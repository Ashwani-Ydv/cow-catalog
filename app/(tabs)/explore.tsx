import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useCowContext } from '@/contexts/CowContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { storageService } from '@/services/storage';
import { generateSampleCows } from '@/utils/sampleData';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DeveloperScreen() {
  const { cows, refreshCows } = useCowContext();
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleLoadSampleData = async () => {
    Alert.alert(
      'Load Sample Data',
      'This will add 20 sample cows to the catalog. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Load',
          onPress: async () => {
            setIsLoading(true);
            try {
              const sampleCows = generateSampleCows(20);
              const existingCows = await storageService.getCows();
              await storageService.saveCows([...existingCows, ...sampleCows]);
              await refreshCows();
              Alert.alert('Success', '20 sample cows have been added!');
            } catch (error) {
              console.error('Error loading sample data:', error);
              Alert.alert('Error', 'Failed to load sample data');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleClearAll = async () => {
    Alert.alert(
      'Clear All Data',
      'This will delete ALL cows from the catalog. This cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await storageService.clearAll();
              await refreshCows();
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Ionicons name="information-circle" size={48} color="#4CAF50" style={styles.icon} />
          <ThemedText style={styles.title}>Developer Utilities</ThemedText>
          <ThemedText style={styles.description}>
            Use these tools to manage your cow catalog data during development.
          </ThemedText>
        </View>

        <View style={[styles.statsCard, isDark && styles.cardDark]}>
          <ThemedText style={styles.statsTitle}>Current Data</ThemedText>
          <View style={styles.statsRow}>
            <ThemedText style={styles.statsLabel}>Total Cows:</ThemedText>
            <ThemedText style={styles.statsValue}>{cows.length}</ThemedText>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton, isLoading && styles.buttonDisabled]}
          onPress={handleLoadSampleData}
          disabled={isLoading}
        >
          <Ionicons name="cloud-download" size={20} color="#fff" />
          <Text style={styles.buttonText}>
            {isLoading ? 'Loading...' : 'Load Sample Data'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.dangerButton, isLoading && styles.buttonDisabled]}
          onPress={handleClearAll}
          disabled={isLoading}
        >
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.buttonText}>
            {isLoading ? 'Clearing...' : 'Clear All Data'}
          </Text>
        </TouchableOpacity>

        <View style={[styles.infoCard, isDark && styles.cardDark]}>
          <Ionicons name="bulb" size={24} color="#FF9800" />
          <ThemedText style={styles.infoText}>
            Tip: Start by loading sample data to test the app features, including searching, filtering, and viewing cow details.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#2a2a2a',
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: 16,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  dangerButton: {
    backgroundColor: '#F44336',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
