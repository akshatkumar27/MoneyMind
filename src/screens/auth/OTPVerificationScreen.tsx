import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { BackButton, OTPInput, Button } from '../../components';
import { colors, typography, spacing, API_BASE_URL } from '../../constants';

type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
    OTPVerification: {
        email: string;
        otpToken: string;
        isSignupFlow?: boolean;
        signupData?: {
            name: string;
            age: string;
        };
    };
};

type OTPVerificationScreenRouteProp = RouteProp<AuthStackParamList, 'OTPVerification'>;

export const OTPVerificationScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<OTPVerificationScreenRouteProp>();
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(54);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [otpToken, setOtpToken] = useState(route.params?.otpToken || '');

    const email = route.params?.email || 'user@example.com';
    const isSignupFlow = route.params?.isSignupFlow || false;
    const signupData = route.params?.signupData;

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleVerify = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`,
                (isSignupFlow && signupData) ? {
                    otpToken: otpToken,
                    code: otp,
                    name: signupData.name,
                    age: signupData.age
                } :
                    {
                        otpToken: otpToken,
                        code: otp,
                    });
            console.log('OTP verified successfully:', response.data);

            // Save token to AsyncStorage
            await AsyncStorage.setItem('authToken', response.data.token);
            await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

            // If signup flow, store additional signup data
            if (isSignupFlow && signupData) {
                await AsyncStorage.setItem('signupData', JSON.stringify(signupData));
            }

            // Check if user is new and navigate accordingly
            if (response.data.user?.isNewUser || true) {
                // Navigate to onboarding questions
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Onboarding' as never }],
                });
            } else {
                // Navigate to main app
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' as never }],
                });
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setOtp('');
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || 'Invalid OTP. Please try again.';
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: errorMessage,
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Something went wrong. Please try again.',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer === 0) {
            setResending(true);
            try {
                const response = await axios.post(`${API_BASE_URL}/api/auth/send-otp`, {
                    email: email,
                });
                setOtpToken(response.data.otpToken);
                setTimer(54);
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'OTP has been resent to your email.',
                });
            } catch (error) {
                console.error('Error resending OTP:', error);
                if (axios.isAxiosError(error)) {
                    const errorMessage = error.response?.data?.message || 'Failed to resend OTP. Please try again.';
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: errorMessage,
                    });
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'Something went wrong. Please try again.',
                    });
                }
            } finally {
                setResending(false);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.header}>
                    <BackButton onPress={() => navigation.goBack()} />
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>Verify your email</Text>
                    <Text style={styles.subtitle}>
                        We've sent a 6-digit code to
                    </Text>
                    <View style={styles.emailContainer}>
                        <Text style={styles.email}>{email}</Text>
                        <Text style={styles.editLink} onPress={() => navigation.goBack()}>Edit</Text>
                    </View>
                    <View style={styles.otpContainer}>
                        <OTPInput value={otp} onChangeText={setOtp} length={6} />
                    </View>

                    <View style={styles.resendContainer}>
                        <Text style={styles.resendText}>Didn't receive the code? </Text>
                        <TouchableOpacity onPress={handleResend} disabled={timer > 0 || resending}>
                            <Text style={[styles.resendLink, (timer > 0 || resending) && styles.resendDisabled]}>
                                {resending ? 'Sending...' : `Resend Code ${timer > 0 ? `(${formatTime(timer)})` : ''}`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Button
                        title="Verify & Continue"
                        onPress={handleVerify}
                        loading={loading}
                        disabled={otp.length < 6}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
    },
    title: {
        color: colors.textPrimary,
        fontSize: typography.h1,
        fontWeight: typography.bold,
        marginBottom: spacing.sm,
    },
    subtitle: {
        color: colors.textSecondary,
        fontSize: typography.body,
        lineHeight: 24,
    },
    email: {
        color: colors.primary,
    },
    editLink: {
        color: colors.link,
        textDecorationLine: 'underline',
        marginLeft: spacing.sm,
    },
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: spacing.sm,
    },
    otpContainer: {
        marginTop: spacing.xl,
        alignItems: 'center',
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: spacing.lg,
        flexWrap: 'wrap',
    },
    resendText: {
        color: colors.textSecondary,
        fontSize: typography.bodySmall,
    },
    resendLink: {
        color: colors.link,
        fontSize: typography.bodySmall,
        fontWeight: typography.semibold,
    },
    resendDisabled: {
        color: colors.textMuted,
    },
    footer: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },
});
