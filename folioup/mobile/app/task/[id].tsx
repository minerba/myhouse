import { useCallback, useState } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { colors } from '../../constants/theme';
import type { ApplicationStatus, Task } from '../../lib/types';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const load = useCallback(async () => {
    const { data: taskData } = await supabase
      .from('tasks')
      .select('*, profiles(company_name)')
      .eq('id', id)
      .single();
    setTask(taskData as Task);

    const { data: appData } = await supabase
      .from('applications')
      .select('status')
      .eq('task_id', id)
      .eq('seeker_id', session?.user.id)
      .maybeSingle();
    setApplicationStatus(appData?.status ?? null);
    setLoading(false);
  }, [id, session?.user.id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function handleApply() {
    setApplying(true);
    const { error } = await supabase
      .from('applications')
      .insert({ task_id: id, seeker_id: session?.user.id });
    setApplying(false);
    if (error) {
      Alert.alert('지원 실패', error.message);
      return;
    }
    setApplicationStatus('pending');
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brand} />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.inkMuted }}>태스크를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.company}>{task.profiles?.company_name ?? '기업'}</Text>
      <Text style={styles.title}>{task.title}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.reward}>{task.reward_amount.toLocaleString('ko-KR')}원</Text>
        <Text style={styles.duration}>{task.duration_days}일 소요</Text>
      </View>

      <View style={styles.tagRow}>
        {task.skill_tags.map((tag) => (
          <Text key={tag} style={styles.tag}>
            #{tag}
          </Text>
        ))}
      </View>

      <Text style={styles.sectionTitle}>업무 설명</Text>
      <Text style={styles.description}>{task.description}</Text>

      {applicationStatus ? (
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>
            {{
              pending: '지원 완료 · 기업의 검토를 기다리고 있어요',
              accepted: '수락됨 · 결과물을 제출해주세요',
              rejected: '아쉽지만 이번엔 선정되지 않았어요',
            }[applicationStatus]}
          </Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleApply} disabled={applying}>
          {applying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>지원하기</Text>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  company: { fontSize: 13, color: colors.inkMuted, marginBottom: 4 },
  title: { fontSize: 22, fontWeight: '700', color: colors.ink, marginBottom: 12 },
  metaRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  reward: { fontSize: 16, fontWeight: '700', color: colors.brand },
  duration: { fontSize: 14, color: colors.inkMuted },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 20 },
  tag: {
    fontSize: 12,
    color: colors.inkMuted,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: 8 },
  description: { fontSize: 14, lineHeight: 21, color: colors.ink, marginBottom: 24 },
  button: { backgroundColor: colors.brand, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  statusBox: { backgroundColor: colors.surface, borderRadius: 10, padding: 14, borderWidth: 1, borderColor: colors.line },
  statusText: { color: colors.ink, fontSize: 14 },
});
