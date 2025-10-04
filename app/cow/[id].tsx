import { ThemedView } from '@/components/themed-view';
import { useCowContext } from '@/contexts/CowContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Cow } from '@/types/cow';
import { calculateDailyWeightGain, formatDateTime, getEventDescription } from '@/utils/cowUtils';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function CowDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCowById } = useCowContext();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [cow, setCow] = useState<Cow | undefined>(undefined);

  useEffect(() => {
    if (id) {
      const foundCow = getCowById(id);
      setCow(foundCow);
    }
  }, [id]);

  if (!cow) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      </ThemedView>
    );
  }

  const dailyWeightGain = calculateDailyWeightGain(cow);
  const sortedEvents = [...cow.events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#4CAF50';
      case 'In Treatment':
        return '#FF9800';
      case 'Deceased':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'created':
        return 'add-circle';
      case 'weight_check':
        return 'scale';
      case 'treatment':
        return 'medical';
      case 'pen_move':
        return 'swap-horizontal';
      case 'death':
        return 'close-circle';
      default:
        return 'ellipse';
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'created':
        return '#4CAF50';
      case 'weight_check':
        return '#2196F3';
      case 'treatment':
        return '#FF9800';
      case 'pen_move':
        return '#9C27B0';
      case 'death':
        return '#F44336';
      default:
        return '#999';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header Card */}
        <View style={[styles.headerCard, isDark && styles.cardDark]}>
          <View style={styles.headerRow}>
            <Text style={[styles.earTag, isDark && styles.textDark]}>#{cow.earTag}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(cow.status) }]}>
              <Text style={styles.statusText}>{cow.status}</Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons
                name={cow.sex === 'male' ? 'male' : 'female'}
                size={20}
                color={cow.sex === 'male' ? '#2196F3' : '#E91E63'}
              />
              <Text style={[styles.infoLabel, isDark && styles.textSecondaryDark]}>Sex</Text>
              <Text style={[styles.infoValue, isDark && styles.textDark]}>
                {cow.sex === 'male' ? 'Male' : 'Female'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="home" size={20} color="#4CAF50" />
              <Text style={[styles.infoLabel, isDark && styles.textSecondaryDark]}>Pen</Text>
              <Text style={[styles.infoValue, isDark && styles.textDark]}>{cow.pen}</Text>
            </View>
          </View>
        </View>

        {/* Weight Stats Card */}
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.cardTitle, isDark && styles.textDark]}>Weight Information</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, isDark && styles.textSecondaryDark]}>
                Current Weight
              </Text>
              <Text style={[styles.statValue, isDark && styles.textDark]}>
                {cow.weight ? `${cow.weight} kg` : 'N/A'}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statLabel, isDark && styles.textSecondaryDark]}>
                Daily Gain
              </Text>
              <Text style={[styles.statValue, isDark && styles.textDark]}>
                {dailyWeightGain !== null ? (
                  <>
                    {dailyWeightGain > 0 ? '+' : ''}
                    {dailyWeightGain} kg/day
                  </>
                ) : (
                  'N/A'
                )}
              </Text>
            </View>
          </View>

          {dailyWeightGain !== null && (
            <View style={styles.gainIndicator}>
              <Ionicons
                name={dailyWeightGain > 0 ? 'trending-up' : dailyWeightGain < 0 ? 'trending-down' : 'remove'}
                size={16}
                color={dailyWeightGain > 0 ? '#4CAF50' : dailyWeightGain < 0 ? '#F44336' : '#999'}
              />
              <Text
                style={[
                  styles.gainText,
                  {
                    color: dailyWeightGain > 0 ? '#4CAF50' : dailyWeightGain < 0 ? '#F44336' : '#999',
                  },
                ]}
              >
                {dailyWeightGain > 0
                  ? 'Positive weight gain'
                  : dailyWeightGain < 0
                  ? 'Weight loss detected'
                  : 'Stable weight'}
              </Text>
            </View>
          )}
        </View>

        {/* Timeline Card */}
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.cardTitle, isDark && styles.textDark]}>Event Timeline</Text>

          {sortedEvents.length === 0 ? (
            <Text style={[styles.emptyText, isDark && styles.textSecondaryDark]}>
              No events recorded
            </Text>
          ) : (
            <View style={styles.timeline}>
              {sortedEvents.map((event, index) => (
                <View key={event.id} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View
                      style={[
                        styles.timelineDot,
                        { backgroundColor: getEventColor(event.type) },
                      ]}
                    >
                      <Ionicons
                        name={getEventIcon(event.type) as any}
                        size={16}
                        color="#fff"
                      />
                    </View>
                    {index < sortedEvents.length - 1 && (
                      <View style={[styles.timelineLine, isDark && styles.timelineLineDark]} />
                    )}
                  </View>

                  <View style={styles.timelineContent}>
                    <Text style={[styles.eventDescription, isDark && styles.textDark]}>
                      {getEventDescription(event)}
                    </Text>
                    <Text style={[styles.eventDate, isDark && styles.textSecondaryDark]}>
                      {formatDateTime(event.date)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  earTag: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  gainIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
  },
  gainText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeline: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 4,
  },
  timelineLineDark: {
    backgroundColor: '#444',
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  eventDescription: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 13,
    color: '#999',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textDark: {
    color: '#fff',
  },
  textSecondaryDark: {
    color: '#999',
  },
});
