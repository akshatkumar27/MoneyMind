import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../../constants';
import { MainStackParamList } from '../../navigation/MainTabNavigator';


type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type EditGoalRouteProp = RouteProp<MainStackParamList, 'EditGoal'>;

export const EditGoalScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<EditGoalRouteProp>();

    // Initialize state with route params or defaults
    const [name, setName] = useState(route.params?.name || 'Emergency fund');
    const [target, setTarget] = useState(route.params?.target?.toString() || '5000');
    const [achieveIn, setAchieveIn] = useState(route.params?.achieveIn?.toString() || '2 year');
    const [monthlyContribution, setMonthlyContribution] = useState(
        route.params?.monthlyContribution?.toString() || '500'
    );

    const handleSave = () => {
        // TODO: Save goal data to backend/state
        console.log('Saving goal:', { name, target, achieveIn, monthlyContribution });
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backButtonText}>{'<'}</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Edit your goal</Text>
                        <View style={styles.headerIconContainer}>
                            <Text style={styles.headerIcon}></Text>
                        </View>
                    </View>

                    {/* Form Card */}
                    <View style={styles.formCard}>
                        {/* Name Field */}
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Name</Text>
                            <TextInput
                                style={styles.textInput}
                                value={name}
                                onChangeText={setName}
                                placeholderTextColor={colors.textMuted}
                            />
                        </View>

                        {/* Target Field */}
                        <View style={styles.rowFieldContainer}>
                            <Text style={styles.fieldLabel}>Target</Text>
                            <TextInput
                                style={styles.rowInput}
                                value={target}
                                onChangeText={setTarget}
                                keyboardType="numeric"
                                placeholderTextColor={colors.textMuted}
                            />
                        </View>

                        {/* Achieve In Field */}
                        <View style={styles.rowFieldContainer}>
                            <Text style={styles.fieldLabel}>achieve in (months)</Text>
                            <TextInput
                                style={styles.rowInput}
                                value={achieveIn}
                                onChangeText={setAchieveIn}
                                keyboardType="numeric"

                                placeholderTextColor={colors.textMuted}
                            />
                        </View>

                        {/* Monthly Contribution Field */}
                        <View style={styles.rowFieldContainer}>
                            <Text style={styles.fieldLabel}>Monthly contribution</Text>
                            <TextInput
                                style={styles.rowInput}
                                value={monthlyContribution}
                                onChangeText={setMonthlyContribution}
                                keyboardType="numeric"
                                placeholderTextColor={colors.textMuted}
                            />
                        </View>

                        {/* Save Button */}
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
    scrollView: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        color: colors.textPrimary,
        fontSize: 18,
        fontWeight: typography.medium,
    },
    headerTitle: {
        color: colors.textPrimary,
        fontSize: typography.h3,
        fontWeight: typography.semibold,
        flex: 1,
        marginLeft: spacing.md,
    },
    headerIconContainer: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerIcon: {
        color: colors.textSecondary,
        fontSize: 24,
    },
    formCard: {
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        marginTop: spacing.md,
    },
    fieldContainer: {
        marginBottom: spacing.lg,
    },
    fieldLabel: {
        color: colors.textSecondary,
        fontSize: typography.bodySmall,
        marginBottom: spacing.sm,
    },
    textInput: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        color: colors.textPrimary,
        fontSize: typography.body,
    },
    rowFieldContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    rowInput: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        color: colors.textPrimary,
        fontSize: typography.body,
        minWidth: 100,
        textAlign: 'center',
    },
    saveButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingVertical: spacing.md,
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    saveButtonText: {
        color: colors.textPrimary,
        fontSize: typography.body,
        fontWeight: typography.medium,
    },
});
