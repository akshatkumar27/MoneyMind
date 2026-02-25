import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';
import { ThemeMode, darkColors, lightColors } from '../constants/theme';

interface ThemeContextType {
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    activeTheme: 'dark' | 'light';
    colors: typeof darkColors;
}

const ThemeContext = createContext<ThemeContextType>({
    themeMode: 'system',
    setThemeMode: () => { },
    activeTheme: 'dark',
    colors: darkColors,
});

export const useTheme = () => useContext(ThemeContext);

// Convenience hook to just get colors (acting like CSS var access)
export const useThemeColors = () => {
    const { colors } = useContext(ThemeContext);
    return colors;
};

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const storedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);
                if (storedTheme) {
                    setThemeModeState(storedTheme as ThemeMode);
                }
            } catch (error) {
                console.error('Failed to load theme:', error);
            } finally {
                setIsReady(true);
            }
        };
        loadTheme();
    }, []);

    const setThemeMode = async (mode: ThemeMode) => {
        setThemeModeState(mode);
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    };

    const activeTheme =
        themeMode === 'system'
            ? systemColorScheme === 'light'
                ? 'light'
                : 'dark'
            : themeMode;

    const resolvedColors = activeTheme === 'light' ? lightColors : darkColors;

    // Don't flash wrong theme before async storage loads
    if (!isReady) {
        return null;
    }

    return (
        <ThemeContext.Provider
            value={{
                themeMode,
                setThemeMode,
                activeTheme,
                colors: resolvedColors,
            }}>
            {children}
        </ThemeContext.Provider>
    );
};
