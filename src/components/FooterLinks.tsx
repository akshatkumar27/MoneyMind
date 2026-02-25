import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {FooterLinksProps} from './types';
import {typography} from '../constants/theme';
import { useThemeColors } from "../context/ThemeContext";

export const FooterLinks: React.FC<FooterLinksProps> = ({
  showAuthLink = true,
  authLinkType = 'signup',
  onAuthLinkPress,
}) => {
    const colors = useThemeColors();
  return (
    <View style={styles.container}>
      {showAuthLink && (
        <View style={styles.authLinkContainer}>
          <Text style={[styles.authText, { color: colors.textSecondary }]}>
            {authLinkType === 'signup'
              ? "Don't have an account? "
              : 'Already have an account? '}
          </Text>
          <TouchableOpacity onPress={onAuthLinkPress}>
            <Text style={[styles.authLink, { color: colors.link }]}>
              {authLinkType === 'signup' ? 'Sign up' : 'Log in'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.termsContainer}>
        <TouchableOpacity>
          <Text style={[styles.termsText, { color: colors.textMuted }]}>TERMS OF SERVICE</Text>
        </TouchableOpacity>
        <Text style={[styles.separator, { color: colors.textMuted }]}>•</Text>
        <TouchableOpacity>
          <Text style={[styles.termsText, { color: colors.textMuted }]}>PRIVACY POLICY</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  authLinkContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  authText: {
    fontSize: typography.bodySmall,
  },
  authLink: {
    fontSize: typography.bodySmall,
    fontWeight: typography.semibold,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  termsText: {
    fontSize: typography.caption,
    letterSpacing: 0.5,
  },
  separator: {
    marginHorizontal: 8,
  },
  divider: {
    width: 134,
    height: 4,
    borderRadius: 2,
  },
});
