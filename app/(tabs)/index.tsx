import { ThemedView } from '@/components/themed-view';
import { useCowContext } from '@/contexts/CowContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Cow, CowStatus } from '@/types/cow';
import { formatDate, getLastEventDate, getUniquePens } from '@/utils/cowUtils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function CowListScreen() {
  const { filters, setFilters, getFilteredCows, isLoading, cows } = useCowContext();
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const filteredCows = getFilteredCows();
  const uniquePens = getUniquePens(cows);

  const handleSearch = (text: string) => {
    setFilters({ ...filters, searchQuery: text });
  };

  const handleStatusFilter = (status: CowStatus | 'all') => {
    setFilters({ ...filters, statusFilter: status });
  };

  const handlePenFilter = (pen: string) => {
    setFilters({ ...filters, penFilter: pen });
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      statusFilter: 'all',
      penFilter: '',
    });
  };

  const getStatusColor = (status: CowStatus) => {
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

  const renderCowItem = ({ item }: { item: Cow }) => {
    const lastEventDate = getLastEventDate(item);

    return (
      <TouchableOpacity
        style={[styles.cowCard, isDark && styles.cowCardDark]}
        onPress={() => router.push(`/cow/${item.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.cowHeader}>
          <View style={styles.cowHeaderLeft}>
            <Text style={[styles.earTag, isDark && styles.textDark]}>#{item.earTag}</Text>
            <View style={styles.iconRow}>
              <Ionicons
                name={item.sex === 'male' ? 'male' : 'female'}
                size={16}
                color={item.sex === 'male' ? '#2196F3' : '#E91E63'}
                style={styles.icon}
              />
              <Text style={[styles.penText, isDark && styles.textDark]}>Pen {item.pen}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.cowFooter}>
          <Text style={[styles.lastEventText, isDark && styles.textSecondaryDark]}>
            Last event: {formatDate(lastEventDate)}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={isDark ? '#999' : '#666'} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color={isDark ? '#666' : '#ccc'} />
      <Text style={[styles.emptyText, isDark && styles.textDark]}>
        {filters.searchQuery || filters.statusFilter !== 'all' || filters.penFilter
          ? 'No cows match your filters'
          : 'No cows in the catalog yet'}
      </Text>
      {(filters.searchQuery || filters.statusFilter !== 'all' || filters.penFilter) && (
        <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
          <Text style={styles.clearButtonText}>Clear Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, isDark && styles.searchContainerDark]}>
        <Ionicons name="search" size={20} color={isDark ? '#999' : '#666'} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, isDark && styles.searchInputDark]}
          placeholder="Search by ear tag..."
          placeholderTextColor={isDark ? '#999' : '#999'}
          value={filters.searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={styles.filterButton}>
          <Ionicons
            name={showFilters ? 'filter' : 'filter-outline'}
            size={20}
            color={
              filters.statusFilter !== 'all' || filters.penFilter ? '#4CAF50' : isDark ? '#999' : '#666'
            }
          />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={[styles.filtersContainer, isDark && styles.filtersContainerDark]}>
          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, isDark && styles.textDark]}>Status:</Text>
            <View style={styles.filterButtons}>
              {(['all', 'Active', 'In Treatment', 'Deceased'] as const).map(status => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterChip,
                    filters.statusFilter === status && styles.filterChipActive,
                    isDark && styles.filterChipDark,
                  ]}
                  onPress={() => handleStatusFilter(status)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      filters.statusFilter === status && styles.filterChipTextActive,
                      isDark && styles.textDark,
                    ]}
                  >
                    {status === 'all' ? 'All' : status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, isDark && styles.textDark]}>Pen:</Text>
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  !filters.penFilter && styles.filterChipActive,
                  isDark && styles.filterChipDark,
                ]}
                onPress={() => handlePenFilter('')}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    !filters.penFilter && styles.filterChipTextActive,
                    isDark && styles.textDark,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              {uniquePens.map(pen => (
                <TouchableOpacity
                  key={pen}
                  style={[
                    styles.filterChip,
                    filters.penFilter === pen && styles.filterChipActive,
                    isDark && styles.filterChipDark,
                  ]}
                  onPress={() => handlePenFilter(pen)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      filters.penFilter === pen && styles.filterChipTextActive,
                      isDark && styles.textDark,
                    ]}
                  >
                    {pen}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsText, isDark && styles.textSecondaryDark]}>
          {filteredCows.length} {filteredCows.length === 1 ? 'cow' : 'cows'}
        </Text>
      </View>

      {/* Cow List */}
      <FlatList
        data={filteredCows}
        renderItem={renderCowItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />

      {/* Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-cow')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 48,
  },
  searchContainerDark: {
    backgroundColor: '#2a2a2a',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  searchInputDark: {
    color: '#fff',
  },
  filterButton: {
    padding: 8,
  },
  filtersContainer: {
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  filtersContainerDark: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333',
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterChipDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
  },
  filterChipActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  cowCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cowCardDark: {
    backgroundColor: '#2a2a2a',
  },
  cowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cowHeaderLeft: {
    flex: 1,
  },
  earTag: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  penText: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cowFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastEventText: {
    fontSize: 13,
    color: '#999',
  },
  textDark: {
    color: '#fff',
  },
  textSecondaryDark: {
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  clearButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
