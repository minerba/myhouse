import { useCallback, useState } from 'react';
import { Link, useFocusEffect } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { colors } from '../../constants/theme';
import type { Application, ApplicationStatus } from '../../lib/types';

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  pending: '검토 대기',
  accepted: '수락됨',
  rejected: '거절됨',
};

export default function ApplicationsScreen() {
  const { session } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('applications')
      .select('*, tasks(*, profiles(company_name)), submissions(id, content_url, notes)')
      .eq('seeker_id', session?.user.id)
      .order('applied_at', { ascending: false });
    setApplications((data as Application[]) ?? []);
    setLoading(false);
  }, [session?.user.id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={applications.length === 0 ? styles.emptyContainer : { padding: 16 }}
      data={applications}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      ListEmptyComponent={
        !loading ? <Text style={styles.emptyText}>아직 지원한 태스크가 없어요.</Text> : null
      }
      renderItem={({ item }) => {
        const hasSubmission = (item.submissions?.length ?? 0) > 0;
        const needsSubmission = item.status === 'accepted' && !hasSubmission;

        return (
          <View style={styles.card}>
            <Text style={styles.company}>{item.tasks?.profiles?.company_name ?? '기업'}</Text>
            <Text style={styles.title}>{item.tasks?.title}</Text>
            <View style={styles.statusRow}>
              <Text style={[styles.statusBadge, statusStyle(item.status)]}>
                {STATUS_LABEL[item.status]}
              </Text>
            </View>

            {needsSubmission && (
              <Link href={`/application/${item.id}/submit`} asChild>
                <TouchableOpacity style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>결과물 제출하기</Text>
                </TouchableOpacity>
              </Link>
            )}
            {hasSubmission && <Text style={styles.submitted}>제출 완료 · 평가를 기다리는 중</Text>}
          </View>
        );
      }}
    />
  );
}

function statusStyle(status: ApplicationStatus) {
  return {
    pending: { backgroundColor: '#fdf1de', color: colors.accent },
    accepted: { backgroundColor: '#e8edfb', color: colors.brand },
    rejected: { backgroundColor: '#eeeff3', color: colors.inkMuted },
  }[status];
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: colors.background },
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
  statusRow: { flexDirection: 'row' },
  statusBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  submitButton: {
    marginTop: 12,
    backgroundColor: colors.ink,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  submitButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  submitted: { marginTop: 10, fontSize: 13, color: colors.inkMuted },
});
