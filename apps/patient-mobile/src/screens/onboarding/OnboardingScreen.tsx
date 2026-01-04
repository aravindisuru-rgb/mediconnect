import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Switch } from 'react-native';
import { theme } from '../../theme';

export default function OnboardingScreen({ navigation }: any) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        dob: '',
        nic: '',
        gender: '',
        allergies: '',
        conditions: '',
        medications: '',
        smoker: false,
        alcohol: false,
    });

    const updateForm = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const nextStep = () => {
        if (step < 3) setStep(step + 1);
        else navigation.replace('Dashboard'); // Finish onboarding
    };

    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Basic Information</Text>
            <Text style={styles.label}>Date of Birth (YYYY-MM-DD)</Text>
            <TextInput
                style={styles.input}
                placeholder="1990-01-01"
                value={formData.dob}
                onChangeText={(text) => updateForm('dob', text)}
            />
            <Text style={styles.label}>National ID (NIC) - Sri Lanka</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter NIC Number"
                value={formData.nic}
                onChangeText={(text) => updateForm('nic', text)}
            />
            <Text style={styles.label}>Gender</Text>
            <View style={styles.row}>
                {['Male', 'Female', 'Other'].map((g) => (
                    <TouchableOpacity
                        key={g}
                        style={[styles.chip, formData.gender === g && styles.chipActive]}
                        onPress={() => updateForm('gender', g)}
                    >
                        <Text style={[styles.chipText, formData.gender === g && styles.chipTextActive]}>{g}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Medical History</Text>
            <Text style={styles.label}>Known Allergies</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g. Penicillin, Peanuts"
                multiline
                value={formData.allergies}
                onChangeText={(text) => updateForm('allergies', text)}
            />
            <Text style={styles.label}>Chronic Conditions</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g. Diabetes, Hypertension"
                multiline
                value={formData.conditions}
                onChangeText={(text) => updateForm('conditions', text)}
            />
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Lifestyle</Text>
            <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Do you smoke?</Text>
                <Switch
                    value={formData.smoker}
                    onValueChange={(val) => updateForm('smoker', val)}
                    trackColor={{ false: '#767577', true: theme.colors.primary }}
                />
            </View>
            <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Do you consume alcohol?</Text>
                <Switch
                    value={formData.alcohol}
                    onValueChange={(val) => updateForm('alcohol', val)}
                    trackColor={{ false: '#767577', true: theme.colors.primary }}
                />
            </View>

            <Text style={styles.label}>Current Medications</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="List current medications"
                multiline
                value={formData.medications}
                onChangeText={(text) => updateForm('medications', text)}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </ScrollView>

            <View style={styles.footer}>
                {step > 1 && (
                    <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep(step - 1)}>
                        <Text style={styles.secondaryButtonText}>Back</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
                    <Text style={styles.primaryButtonText}>{step === 3 ? 'Complete Profile' : 'Next'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    progressBar: {
        height: 4,
        backgroundColor: theme.colors.border,
        width: '100%',
        marginTop: 50, // Safe area
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.colors.primary,
    },
    content: {
        padding: theme.spacing.l,
    },
    stepContainer: {
        gap: theme.spacing.m,
    },
    stepTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.m,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.colors.text,
        marginTop: theme.spacing.s,
    },
    input: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.m,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        gap: theme.spacing.s,
    },
    chip: {
        paddingHorizontal: theme.spacing.m,
        paddingVertical: theme.spacing.s,
        borderRadius: theme.borderRadius.xl,
        backgroundColor: theme.colors.border,
    },
    chipActive: {
        backgroundColor: theme.colors.primary,
    },
    chipText: {
        color: theme.colors.text,
    },
    chipTextActive: {
        color: '#fff',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.s,
    },
    switchLabel: {
        fontSize: 16,
        color: theme.colors.text,
    },
    footer: {
        padding: theme.spacing.l,
        borderTopWidth: 1,
        borderColor: theme.colors.border,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: theme.spacing.m,
        backgroundColor: theme.colors.surface,
    },
    primaryButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    secondaryButton: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.m,
    },
    secondaryButtonText: {
        color: theme.colors.textSecondary,
    },
});
