import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';

export default function DashboardScreen({ navigation }: any) {
    const { user, logout } = useAuth(); // Assuming user has name

    const features = [
        { title: 'My Medications', icon: '💊', color: '#dcfce7', route: 'MedicationList' },
        { title: 'Medical Vault', icon: '📂', color: '#f3e8ff', route: 'DocumentVault' },
        { title: 'Biometrics', icon: '📊', color: '#fef9c3', route: 'VitalsStatus' },
        { title: 'Doctors', icon: '👨‍⚕️', color: '#ffedd5', route: 'DoctorList' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello,</Text>
                    <Text style={styles.username}>{user?.firstName || 'Patient'}</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.profileBtn}>
                    <Text>👤</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Important Stats Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Your Health Timeline</Text>
                    <View style={styles.timelineItem}>
                        <Text style={styles.time}>Today, 9:00 AM</Text>
                        <Text style={styles.event}>Medication Reminder: Metformin</Text>
                    </View>
                    <View style={styles.timelineItem}>
                        <Text style={styles.time}>Tomorrow, 2:00 PM</Text>
                        <Text style={styles.event}>Next Appt: Dr. Silva (Cardiologist)</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.grid}>
                    {features.map((f) => (
                        <TouchableOpacity
                            key={f.title}
                            style={[styles.gridItem, { backgroundColor: f.color }]}
                            onPress={() => navigation.navigate(f.route)}
                        >
                            <Text style={styles.icon}>{f.icon}</Text>
                            <Text style={styles.gridText}>{f.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Risk Assessment Banner */}
                <View style={[styles.card, styles.alertCard]}>
                    <Text style={styles.alertTitle}>Health Risk Assessment</Text>
                    <Text style={styles.alertText}>Update your family history to get personalized screening recommendations.</Text>
                    <TouchableOpacity style={styles.alertBtn}>
                        <Text style={styles.alertBtnText}>Update Now</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        padding: theme.spacing.l,
        paddingTop: 60,
        backgroundColor: theme.colors.surface,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: theme.colors.border,
    },
    greeting: {
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    profileBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: theme.spacing.l,
    },
    card: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.l,
        marginBottom: theme.spacing.l,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: theme.spacing.m,
        color: theme.colors.text,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: theme.spacing.s,
    },
    time: {
        width: 120,
        color: theme.colors.textSecondary,
        fontSize: 14,
    },
    event: {
        color: theme.colors.text,
        fontWeight: '500',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: theme.spacing.m,
        color: theme.colors.text,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.m,
        marginBottom: theme.spacing.l,
    },
    gridItem: {
        width: '47%',
        padding: theme.spacing.l,
        borderRadius: theme.borderRadius.l,
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 1,
    },
    icon: {
        fontSize: 32,
        marginBottom: theme.spacing.s,
    },
    gridText: {
        fontWeight: '600',
        color: theme.colors.text,
    },
    alertCard: {
        backgroundColor: '#fff7ed',
        borderWidth: 1,
        borderColor: '#fed7aa',
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#c2410c',
        marginBottom: 4,
    },
    alertText: {
        color: '#9a3412',
        marginBottom: theme.spacing.m,
    },
    alertBtn: {
        alignSelf: 'flex-start',
        backgroundColor: '#c2410c',
        paddingHorizontal: theme.spacing.m,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.m,
    },
    alertBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
});
