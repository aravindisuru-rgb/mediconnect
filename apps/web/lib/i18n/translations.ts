export const translations = {
    en: {
        dashboard: "Dashboard",
        patients: "Patients",
        appointments: "Appointments",
        prescriptions: "Prescriptions",
        billing: "Billing",
        logout: "Sign Out",
        medicalRecords: "Medical Records",
        verifyNic: "Verify Identity (NIC)",
        welcome: "Ayubowan",
        search: "Search...",
        save: "Save",
        cancel: "Cancel"
    },
    si: {
        dashboard: "පුවරුව",
        patients: "රෝගීන්",
        appointments: "හමුවීම්",
        prescriptions: "ඖෂධ වට්ටෝරු",
        billing: "බිල්පත්",
        logout: "සයින් අවුට්",
        medicalRecords: "වෛද්‍ය වාර්තා",
        verifyNic: "අනන්‍යතාවය තහවුරු කරන්න",
        welcome: "ආයුබෝවන්",
        search: "සොයන්න...",
        save: "සුරකින්න",
        cancel: "අවලංගු කරන්න"
    },
    ta: {
        dashboard: "டாஷ்போர்டு",
        patients: "நோயாளி",
        appointments: "நியமனங்கள்",
        prescriptions: "மருந்து சீட்டு",
        billing: "பில்லிங்",
        logout: "வெளியேறு",
        medicalRecords: "மருத்துவ பதிவுகள்",
        verifyNic: "அடையாளத்தை சரிபார்க்கவும்",
        welcome: "வணக்கம்",
        search: "தேடுக...",
        save: "சேமி",
        cancel: "ரத்து செய்"
    }
};

export type Language = 'en' | 'si' | 'ta';

export function getTranslation(lang: Language, key: keyof typeof translations['en']) {
    return translations[lang][key] || translations['en'][key];
}
