import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

type AuthContextType = {
    user: any;
    token: string | null;
    isLoading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    register: (email: string, pass: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

import jwtDecode from 'jwt-decode';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStorageData();
    }, []);

    const loadStorageData = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
                const decoded: any = jwtDecode(storedToken);
                setUser(decoded);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, pass: string) => {
        const res = await client.post('/auth/login', { email, password: pass });
        const { access_token } = res.data;
        setToken(access_token);
        const decoded: any = jwtDecode(access_token);
        setUser(decoded);
        await AsyncStorage.setItem('token', access_token);
    };

    const register = async (email: string, pass: string, profileData: any) => {
        await client.post('/auth/register', {
            email,
            password: pass,
            role: 'PATIENT',
            profileData: profileData || { firstName: 'New', lastName: 'Patient' }
        });
        await login(email, pass);
    };

    const logout = async () => {
        setToken(null);
        setUser(null);
        await AsyncStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
