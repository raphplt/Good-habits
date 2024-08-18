import React, { useId } from "react";
import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import useIndex from "@hooks/useIndex";

interface BlurBoxProps {
	position: {
		top?: number;
		left?: number;
		right?: number;
		bottom?: number;
	};
	children: React.ReactNode;
}

const BlurBox: React.FC<BlurBoxProps> = ({ position, children }) => {
	const { isDayTime } = useIndex();
	return (
		<View
			style={[position]}
			className="absolute z-30 px-3 py-2 rounded-lg overflow-hidden"
		>
			<BlurView
				intensity={50}
				style={styles.blurView}
				tint={isDayTime ? "light" : "dark"}
			/>
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	blurView: {
		...StyleSheet.absoluteFillObject,
		borderRadius: 10,
	},
});

export default BlurBox;
