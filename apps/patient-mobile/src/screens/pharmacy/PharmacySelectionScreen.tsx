import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { theme } from '../../theme';

export default function PharmacySelectionScreen({ navigation }: any) {
    const [search, setSearch] = useState('');

    // Mock Data - In real app, fetch from /pharmacies endpoint
    const pharmacies = [
        { id: '1', name: 'City Health Pharmacy', address: '123 Main St, Colombo 03', distance: '0.5 km' },
        { id: '2', name: 'Lanka Meds', address: '45 Galle Rd, Colombo 04', distance: '1.2 km' },
        { id: '3', name: 'Wellness Plus', address: '89 Ward Place, Colombo 07', distance: '2.5 km' },
        { id: '4', name: 'Asiri Pharmacy', address: '11 Kirula Rd, Colombo 05', distance: '3.0 km' },
    ];

    const handleSelect = (pharmacy: any) => {
        // In real app: API call to set preferred pharmacy or attach to current Prescription Order
        console.log('Selected:', pharmacy.name);
        // Navigate back or to confirmation
        navigation.goBack();
    };

    const renderItem = ({ item }: any) => (
        <TouchableOpacity style={styles.card} onPress={() => handleSelect(item)}>
            <View style={styles.iconContainer}>
                <Text style={styles.iconText}>💊</Text>
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.address}>{item.address}</Text>
                <Text style={styles.distance}>{item.distance} away</Text>
                {/* Mock Price Indicator */}
                <Text style={styles.priceTag}>Est. Total: LKR 1,200</Text>
            </View>
            <View style={styles.actions}>
                <View style={[styles.selectBtn, styles.inquireBtn]}>
                    <Text style={[styles.selectBtnText, styles.inquireText]}>Inquire</Text>
                </View>
                <View style={styles.selectBtn}>
                    <Text style={styles.selectBtnText}>Select</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select a Pharmacy</Text>
            <Text style={styles.subtitle}>Choose where you want to send your prescription.</Text>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name or city..."
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <FlatList
                data={pharmacies}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
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
        color: theme.colors.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.l,
    },
    searchContainer: {
        marginBottom: theme.spacing.l,
    },
    searchInput: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
        fontSize: 16,
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
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ecfdf5', // emerald-50
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.m,
    },
    iconText: {
        fontSize: 24,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 2,
    },
    address: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginBottom: 2,
    },
    distance: {
        fontSize: 12,
        color: theme.colors.primary,
        fontWeight: '500',
    },
    priceTag: {
        fontSize: 12,
        color: '#d97706', // amber-600
        fontWeight: 'bold',
        marginTop: 4,
    },
    actions: {
        alignItems: 'flex-end',
        gap: 8,
    },
    selectBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.m,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.m,
        minWidth: 70,
        alignItems: 'center',
    },
    inquireBtn: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    selectBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    inquireText: {
        color: theme.colors.primary,
    },
});
