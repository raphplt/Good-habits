import CachedImage from "@components/Shared/CachedImage";
import { useHabits } from "@context/HabitsContext";
import { ThemeContext } from "@context/ThemeContext";
import useHabitTimer from "@hooks/useHabitTimer";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import getImage from "@utils/getImage";
import { useNavigation } from "expo-router";
import { ReactNode, useContext, useEffect, useState } from "react";
import { View, Pressable, Image, StyleSheet, Alert } from "react-native";
import { Iconify } from "react-native-iconify";

export default function ({ children }: { children: ReactNode }) {
    const { currentHabit, categories } = useHabits();
    const { theme } = useContext(ThemeContext);
    const { stopTimer } = useHabitTimer();
    const navigation: NavigationProp<ParamListBase> = useNavigation();

    if (!currentHabit) return null;

    const handlePress = () => {
        Alert.alert(
            "Êtes-vous sûr de vouloir arrêter cette habitude ?",
            "La progression actuelle sera perdue",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                    onPress: () => {},
                },
                {
                    text: "Arrêter",
                    style: "destructive",
                    onPress: () => {
                        stopTimer();
                        navigation.navigate("habitDetail");
                    },
                },
            ]
        );
    };

    const habitCategory = categories.find(
        (c) => c.category === currentHabit.category
    );

    const [imageUri, setImageUri] = useState<string | null>(null);

    useEffect(() => {
        const loadCategoryImage = async () => {
            if (habitCategory) {
                const uri = getImage(habitCategory.slug);
                setImageUri(uri);
            }
        };
        loadCategoryImage();
    }, [habitCategory]);

    return (
        <View className="flex flex-col items-center justify-around h-full">
            <CachedImage
                imagePath={imageUri || "images/categories/fitness.jpg"}
                blurRadius={15}
                style={StyleSheet.absoluteFill}
            />

            <Pressable
                onPress={handlePress}
                className="flex justify-start w-11/12 items-start mx-auto pt-2 z-10"
            >
                <Iconify
                    icon="material-symbols:close"
                    size={28}
                    color={theme.colors.text}
                />
            </Pressable>
            {children}
        </View>
    );
}