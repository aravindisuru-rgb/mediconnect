import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import client from '../../api/client';
import { theme } from '../../theme';

export default function BookAppointmentScreen({ route, navigation }: any) {
    const { doctor } = route.params;
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    // Mock slots - in real app, fetch from API based on doctor availability
    const slots = [
        { id: '1', time: '09:00 AM' },
        { id: '2', time: '09:30 AM' },
        { id: '3', time: '10:00 AM' },
        { id: '4', time: '11:00 AM' },
        { id: '5', time: '02:00 PM' },
    ];

    const handleBook = async () => {
        if (!selectedSlot) {
            Alert.alert("Selection Required", "Please select a time slot.");
            return;
        }

        setLoading(true);
        try {
            // Calculate start/end time based on slot (mock logic)
            const today = new Date();
            // ... date logic 

            await client.post('/appointments', {
                doctorId: doctor.id,
                startTime: new Date().toISOString(), // Mock
                endTime: new Date().toISOString(),   // Mock
                type: 'IN_PERSON',
                reason: reason
            });

            Alert.alert("Success", "Appointment booked successfully!", [
                { text: "OK", onPress: () => navigation.navigate("Dashboard") }
            ]);
        } catch (e) {
            Alert.alert("Error", "Failed to book appointment.");
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>Booking Appointment with</Text>
                <Text style={styles.doctorName}>Dr. {doctor.firstName} {doctor.lastName}</Text>
                <Text style={styles.specialty}>{doctor.specialty}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select Available Slot</Text>
                <View style={styles.slotsGrid}>
                    {slots.map((slot) => (
                        <TouchableOpacity
                            key={slot.id}
                            style={[styles.slot, selectedSlot === slot.id && styles.slotActive]}
                            onPress={() => setSelectedSlot(slot.id)}
                        >
                            <Text style={[styles.slotText, selectedSlot === slot.id && styles.slotTextActive]}>
                                {slot.time}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Reason for Visit</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. High fever, Annual checkup..."
                    multiline
                    numberOfLines={3}
                    value={reason}
                    onChangeText={setReason}
                />
            </View>

            <TouchableOpacity
                style={styles.bookBtn}
                onPress={handleBook}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.bookBtnText}>Confirm Booking</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.m,
    },
    header: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.l,
        borderRadius: theme.borderRadius.l,
        marginBottom: theme.spacing.l,
        alignItems: 'center',
    },
    label: {
        color: theme.colors.textSecondary,
        marginBottom: 4,
    },
    doctorName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 4,
    },
    specialty: {
        color: theme.colors.primary,
        fontWeight: '500',
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: theme.spacing.m,
        color: theme.colors.text,
    },
    slotsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.m,
    },
    slot: {
        paddingVertical: theme.spacing.m,
        paddingHorizontal: theme.spacing.l,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    slotActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    slotText: {
        color: theme.colors.text,
        fontWeight: '500',
    },
    slotTextActive: {
        color: '#fff',
    },
    input: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
        textAlignVertical: 'top',
    },
    bookBtn: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.l,
        borderRadius: theme.borderRadius.l,
        alignItems: 'center',
        marginBottom: 50,
    },
    bookBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
