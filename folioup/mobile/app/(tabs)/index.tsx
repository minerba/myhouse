import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { colors } from '../../constants/theme';
import type { Task } from '../../lib/types';

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*, profiles(company_name)')
      .eq('status', 'open')
      .order('created_at', { ascending: false });
    setTasks((data as Task[]) ?? []);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={tasks.length === 0 ? styles.emptyContainer : undefined}
      data={tasks}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      ListEmptyComponent={
        !loading ? <Text style={styles.emptyText}>지금은 모집중인 태스크가 없어요.</Text> : null
      }
      renderItem={({ item }) => (
        <Link href={`/task/${item.id}`} asChild>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.company}>{item.profiles?.company_name ?? '기업'}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.tagRow}>
              {item.skill_tags.slice(0, 3).map((tag) => (
                <Text key={tag} style={styles.tag}>
                  #{tag}
                </Text>
              ))}
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.reward}>{item.reward_amount.toLocaleString('ko-KR')}원</Text>
              <Text style={styles.duration}>{item.duration_days}일 소요</Text>
            </View>
          </TouchableOpacity>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: colors.background, padding: 16 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.inkMuted },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  company: { fontSize: 12, color: colors.inkMuted, marginBottom: 4 },
  title: { fontSize: 16, fontWeight: '700', color: colors.ink, marginBottom: 8 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  tag: {
    fontSize: 11,
    color: colors.inkMuted,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  reward: { fontSize: 14, fontWeight: '700', color: colors.brand },
  duration: { fontSize: 13, color: colors.inkMuted },
});
