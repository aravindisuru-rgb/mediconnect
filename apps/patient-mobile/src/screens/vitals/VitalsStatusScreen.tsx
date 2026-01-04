import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import client from '../../api/client';
import { theme } from '../../theme';

export default function VitalsStatusScreen() {
    const [vitals, setVitals] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVitals();
    }, []);

    const fetchVitals = async () => {
        try {
            // Hardcoded patient ID for demo or get from auth context
            const res = await client.get('/vitals/patient/current/latest');
            setVitals(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const VitalCard = ({ title, value, unit, color }: any) => (
        <View style={[styles.card, { borderLeftColor: color }]}>
            <Text style={styles.cardTitle}>{title}</Text>
            <View style={styles.valueRow}>
                <Text style={styles.value}>{value || '--'}</Text>
                <Text style={styles.unit}>{unit}</Text>
            </View>
        </View>
    );

    if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Health Bio-Metrics</Text>

            <View style={styles.grid}>
                <VitalCard title="Blood Pressure" value={vitals.BP_SYSTOLIC ? `${vitals.BP_SYSTOLIC.value}/${vitals.BP_DIASTOLIC?.value}` : null} unit="mmHg" color="#ef4444" />
                <VitalCard title="Heart Rate" value={vitals.HEART_RATE?.value} unit="bpm" color="#f97316" />
                <VitalCard title="Blood Sugar" value={vitals.GLUCOSE?.value} unit="mg/dL" color="#3b82f6" />
                <VitalCard title="Temperature" value={vitals.TEMP?.value} unit="°C" color="#10b981" />
                <VitalCard title="Weight" value={vitals.WEIGHT?.value} unit="kg" color="#8b5cf6" />
            </View>

            <Text style={styles.subtitle}>Recent Trends</Text>
            <View style={styles.placeholderChart}>
                <Text style={styles.placeholderText}>Charts & Trends Rendering...</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.m },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: theme.spacing.l, color: theme.colors.text },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.m },
    card: {
        width: '47%',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    cardTitle: { fontSize: 12, color: theme.colors.textSecondary, fontWeight: 'bold', textTransform: 'uppercase' },
    valueRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 8 },
    value: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
    unit: { fontSize: 12, color: theme.colors.textSecondary, marginLeft: 4 },
    subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: theme.spacing.l, marginBottom: theme.spacing.m, color: theme.colors.text },
    placeholderChart: { height: 200, backgroundColor: '#f1f5f9', borderRadius: theme.borderRadius.m, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#cbd5e1' },
    placeholderText: { color: theme.colors.textSecondary, fontStyle: 'italic' }
});
