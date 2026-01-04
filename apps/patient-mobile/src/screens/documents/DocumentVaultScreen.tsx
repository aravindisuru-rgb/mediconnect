import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import client from '../../api/client';
import { theme } from '../../theme';

export default function DocumentVaultScreen() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDocs();
    }, []);

    const fetchDocs = async () => {
        try {
            const res = await client.get('/documents/patient');
            setDocs(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>Health Documents</Text>
                <TouchableOpacity style={styles.addBtn}>
                    <Text style={styles.addBtnText}>+ Upload</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={docs}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.docIcon}>
                            <Text>📄</Text>
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.meta}>{item.type} • {new Date(item.uploadedAt).toLocaleDateString()}</Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.empty}>No documents in your vault.</Text>
                        <Text style={styles.emptySub}>Upload scans of prescriptions or lab reports here.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.m },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.l },
    header: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
    addBtn: { backgroundColor: theme.colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    addBtnText: { color: '#fff', fontWeight: 'bold' },
    card: { flexDirection: 'row', backgroundColor: theme.colors.surface, padding: theme.spacing.m, borderRadius: theme.borderRadius.m, marginBottom: theme.spacing.m, alignItems: 'center' },
    docIcon: { width: 44, height: 44, backgroundColor: '#f1f5f9', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.m },
    details: { flex: 1 },
    title: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
    meta: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
    emptyContainer: { alignItems: 'center', marginTop: 60 },
    empty: { fontSize: 16, fontWeight: 'bold', color: theme.colors.textSecondary },
    emptySub: { fontSize: 14, color: '#94a3b8', textAlign: 'center', marginTop: 8, paddingHorizontal: 20 }
});
