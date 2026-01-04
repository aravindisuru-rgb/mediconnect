import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import client from '../../api/client';
import { theme } from '../../theme';

export default function MedicationListScreen() {
    const [meds, setMeds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMeds();
    }, []);

    const fetchMeds = async () => {
        try {
            const res = await client.get('/medications/patient');
            setMeds(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Medications</Text>
            <FlatList
                data={meds}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.status}</Text>
                        </View>
                        <Text style={styles.medName}>{item.name}</Text>
                        <Text style={styles.details}>{item.dosage} • {item.frequency}</Text>
                        {item.instructions && <Text style={styles.instructions}>{item.instructions}</Text>}
                        <Text style={styles.source}>Source: {item.source}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.empty}>No active medications found.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.m },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: theme.spacing.l, color: theme.colors.text },
    card: { backgroundColor: theme.colors.surface, padding: theme.spacing.m, borderRadius: theme.borderRadius.m, marginBottom: theme.spacing.m },
    medName: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text },
    details: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 },
    instructions: { fontSize: 14, color: theme.colors.text, marginTop: 8, fontStyle: 'italic' },
    source: { fontSize: 10, color: theme.colors.textSecondary, marginTop: 12 },
    badge: { alignSelf: 'flex-start', backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginBottom: 4 },
    badgeText: { fontSize: 10, fontWeight: 'bold', color: '#166534' },
    empty: { textAlign: 'center', marginTop: 20, color: theme.colors.textSecondary }
});
