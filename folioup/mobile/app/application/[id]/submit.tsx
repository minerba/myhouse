import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '../../../lib/supabase';
import { colors } from '../../../constants/theme';

export default function SubmitResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [contentUrl, setContentUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!contentUrl.trim()) {
      Alert.alert('링크를 입력해주세요', '결과물을 확인할 수 있는 링크가 필요해요.');
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from('submissions')
      .insert({ application_id: id, content_url: contentUrl.trim(), notes: notes.trim() || null });
    setLoading(false);

    if (error) {
      Alert.alert('제출 실패', error.message);
      return;
    }
    router.back();
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>결과물 링크</Text>
        <Text style={styles.hint}>구글 드라이브, 노션, 깃허브 등 확인 가능한 링크를 붙여주세요.</Text>
        <TextInput
          style={styles.input}
          value={contentUrl}
          onChangeText={setContentUrl}
          placeholder="https://..."
          autoCapitalize="none"
          keyboardType="url"
        />

        <Text style={styles.label}>메모 (선택)</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="작업하면서 전달하고 싶은 내용을 적어주세요."
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>제출하기</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: 20 },
  label: { fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: 4 },
  hint: { fontSize: 12, color: colors.inkMuted, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: colors.surface,
    marginBottom: 20,
  },
  textarea: { minHeight: 100, textAlignVertical: 'top' },
  button: { backgroundColor: colors.brand, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
