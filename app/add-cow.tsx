import { ThemedView } from '@/components/themed-view';
import { useCowContext } from '@/contexts/CowContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { storageService } from '@/services/storage';
import { Cow, CowSex, CowStatus } from '@/types/cow';
import { generateId } from '@/utils/cowUtils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AddCowScreen() {
  const router = useRouter();
  const { addCow } = useCowContext();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [formData, setFormData] = useState({
    earTag: '',
    sex: '' as CowSex | '',
    pen: '',
    status: 'Active' as CowStatus,
    weight: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};

    // Validate ear tag
    if (!formData.earTag.trim()) {
      newErrors.earTag = 'Ear tag is required';
    } else {
      // Check uniqueness
      const existing = await storageService.getCowByEarTag(formData.earTag.trim());
      if (existing) {
        newErrors.earTag = 'This ear tag already exists';
      }
    }

    // Validate sex
    if (!formData.sex) {
      newErrors.sex = 'Sex is required';
    }

    // Validate pen
    if (!formData.pen.trim()) {
      newErrors.pen = 'Pen is required';
    }

    // Validate weight (optional but must be positive if provided)
    if (formData.weight) {
      const weightNum = parseFloat(formData.weight);
      if (isNaN(weightNum) || weightNum <= 0) {
        newErrors.weight = 'Weight must be a positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const isValid = await validateForm();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const now = new Date().toISOString();
      const cowId = generateId();
      const weight = formData.weight ? parseFloat(formData.weight) : undefined;

      const newCow: Cow = {
        id: cowId,
        earTag: formData.earTag.trim(),
        sex: formData.sex as CowSex,
        pen: formData.pen.trim(),
        status: formData.status,
        weight,
        events: [
          {
            id: generateId(),
            type: 'created',
            date: now,
            description: 'Cow added to catalog',
          },
        ],
        createdAt: now,
      };

      // Add weight check event if weight is provided
      if (weight) {
        newCow.events.push({
          id: generateId(),
          type: 'weight_check',
          date: now,
          description: 'Initial weight recorded',
          weight,
        });
      }

    await addCow(newCow);
    Alert.alert('Success', 'Cow added successfully!', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
    } catch (error) {
      console.error('Error adding cow:', error);
      Alert.alert('Error', 'Failed to add cow. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    error?: string,
    keyboardType: 'default' | 'numeric' = 'default',
    required: boolean = true
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, isDark && styles.textDark]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>
      <TextInput
        style={[
          styles.input,
          isDark && styles.inputDark,
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#666' : '#999'}
        keyboardType={keyboardType}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const renderSexSelector = () => (
    <View style={styles.inputContainer}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, isDark && styles.textDark]}>
          Sex<Text style={styles.required}> *</Text>
        </Text>
      </View>
      <View style={styles.sexButtons}>
        <TouchableOpacity
          style={[
            styles.sexButton,
            formData.sex === 'male' && styles.sexButtonActive,
            isDark && styles.sexButtonDark,
          ]}
          onPress={() => {
            setFormData({ ...formData, sex: 'male' });
            setErrors({ ...errors, sex: '' });
          }}
        >
          <Ionicons
            name="male"
            size={24}
            color={formData.sex === 'male' ? '#fff' : '#2196F3'}
          />
          <Text
            style={[
              styles.sexButtonText,
              formData.sex === 'male' && styles.sexButtonTextActive,
              isDark && styles.textDark,
            ]}
          >
            Male
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sexButton,
            formData.sex === 'female' && styles.sexButtonActive,
            isDark && styles.sexButtonDark,
          ]}
          onPress={() => {
            setFormData({ ...formData, sex: 'female' });
            setErrors({ ...errors, sex: '' });
          }}
        >
          <Ionicons
            name="female"
            size={24}
            color={formData.sex === 'female' ? '#fff' : '#E91E63'}
          />
          <Text
            style={[
              styles.sexButtonText,
              formData.sex === 'female' && styles.sexButtonTextActive,
              isDark && styles.textDark,
            ]}
          >
            Female
          </Text>
        </TouchableOpacity>
      </View>
      {errors.sex && <Text style={styles.errorText}>{errors.sex}</Text>}
    </View>
  );

  const renderStatusSelector = () => (
    <View style={styles.inputContainer}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, isDark && styles.textDark]}>
          Status<Text style={styles.required}> *</Text>
        </Text>
      </View>
      <View style={styles.statusButtons}>
        {(['Active', 'In Treatment', 'Deceased'] as CowStatus[]).map(status => (
          <TouchableOpacity
            key={status}
            style={[
              styles.statusChip,
              formData.status === status && styles.statusChipActive,
              isDark && styles.statusChipDark,
            ]}
            onPress={() => setFormData({ ...formData, status })}
          >
            <Text
              style={[
                styles.statusChipText,
                formData.status === status && styles.statusChipTextActive,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {renderInput(
            'Ear Tag',
            formData.earTag,
            (text) => {
              setFormData({ ...formData, earTag: text });
              setErrors({ ...errors, earTag: '' });
            },
            'Enter ear tag number',
            errors.earTag
          )}

          {renderSexSelector()}

          {renderInput(
            'Pen',
            formData.pen,
            (text) => {
              setFormData({ ...formData, pen: text });
              setErrors({ ...errors, pen: '' });
            },
            'e.g., A1, B2',
            errors.pen
          )}

          {renderStatusSelector()}

          {renderInput(
            'Weight',
            formData.weight,
            (text) => {
              setFormData({ ...formData, weight: text });
              setErrors({ ...errors, weight: '' });
            },
            'Weight in kg (optional)',
            errors.weight,
            'numeric',
            false
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, isDark && styles.cancelButtonDark]}
              onPress={() => router.back()}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText, isDark && styles.textDark]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={[styles.buttonText, styles.submitButtonText]}>
                {isSubmitting ? 'Saving...' : 'Add Cow'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  required: {
    color: '#F44336',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#000',
  },
  inputDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
    color: '#fff',
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
  },
  sexButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  sexButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    gap: 8,
  },
  sexButtonDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
  },
  sexButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  sexButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  sexButtonTextActive: {
    color: '#fff',
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statusChipDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
  },
  statusChipActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  statusChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  statusChipTextActive: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
  },
  cancelButtonText: {
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#fff',
  },
  textDark: {
    color: '#fff',
  },
});
