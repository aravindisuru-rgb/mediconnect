import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import client from '../../api/client';
import { theme } from '../../theme';

export default function DoctorListScreen({ navigation }: any) {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            // In a real app we'd have a specific endpoint for searching doctors
            // For MVP we might simple list users with role DOCTOR or similar
            // Mocking for now as we haven't built public doctor search API yet
            // const res = await client.get('/doctors');

            // Mock Data
            setDoctors([
                { id: '1', firstName: 'Sarah', lastName: 'Silva', specialty: 'Cardiologist', hospital: 'General Hospital' },
                { id: '2', firstName: 'Ravi', lastName: 'Perera', specialty: 'General Practitioner', hospital: 'City Clinic' },
                { id: '3', firstName: 'Ama', lastName: 'Fernando', specialty: 'Pediatrician', hospital: 'Kids Care' },
            ]);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('BookAppointment', { doctor: item })}
        >
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.firstName[0]}{item.lastName[0]}</Text>
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>Dr. {item.firstName} {item.lastName}</Text>
                <Text style={styles.specialty}>{item.specialty}</Text>
                <Text style={styles.hospital}>{item.hospital}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Find a Doctor</Text>
            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : (
                <FlatList
                    data={doctors}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.m,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: theme.spacing.l,
        color: theme.colors.text,
    },
    list: {
        gap: theme.spacing.m,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.l,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.m,
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
    },
    specialty: {
        color: theme.colors.primary,
        fontWeight: '500',
        marginBottom: 2,
    },
    hospital: {
        color: theme.colors.textSecondary,
        fontSize: 13,
    },
});
