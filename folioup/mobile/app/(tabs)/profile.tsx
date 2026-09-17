import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { colors } from '../../constants/theme';
import type { TrackRecord } from '../../lib/types';

export default function ProfileScreen() {
  const { profile, session } = useAuth();
  const [track, setTrack] = useState<TrackRecord | null>(null);

  const load = useCallback(async () => {
    if (!session) return;
    const { data } = await supabase
      .from('seeker_track_record')
      .select('*')
      .eq('seeker_id', session.user.id)
      .maybeSingle();
    setTrack(data);
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{profile?.name?.[0] ?? '?'}</Text>
      </View>
      <Text style={styles.name}>{profile?.name}</Text>
      <Text style={styles.email}>{session?.user.email}</Text>

      <Text style={styles.sectionTitle}>검증된 실적</Text>
      <View style={styles.statsRow}>
        <Stat label="완료한 태스크" value={String(track?.completed_count ?? 0)} />
        <Stat label="평균 평점" value={track?.avg_score ? `${track.avg_score}` : '-'} />
        <Stat label="채용 의향" value={String(track?.would_hire_count ?? 0)} />
      </View>

      {(!track || track.completed_count === 0) && (
        <Text style={styles.emptyHint}>
          태스크를 완료하고 평가를 받으면 여기에 검증된 실적이 쌓여요.
        </Text>
      )}

      <TouchableOpacity style={styles.signOutButton} onPress={() => supabase.auth.signOut()}>
        <Text style={styles.signOutText}>로그아웃</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '700' },
  name: { fontSize: 20, fontWeight: '700', color: colors.ink },
  email: { fontSize: 13, color: colors.inkMuted, marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  statValue: { fontSize: 20, fontWeight: '700', color: colors.brand },
  statLabel: { fontSize: 11, color: colors.inkMuted, marginTop: 4, textAlign: 'center' },
  emptyHint: { fontSize: 13, color: colors.inkMuted, marginBottom: 24 },
  signOutButton: { marginTop: 12, alignItems: 'center', paddingVertical: 12 },
  signOutText: { color: colors.danger, fontWeight: '600', fontSize: 14 },
});
