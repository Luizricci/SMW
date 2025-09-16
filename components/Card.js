import { View, Text, StyleSheet } from "react-native";

const Card = ({ title, content }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.content}>{content}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        borderLeftWidth: 4,
        borderLeftColor: '#1e3a5f',
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
        color: '#1e3a5f',
    },
    content: {
        fontSize: 14,
        color: "#64748b",
        lineHeight: 20,
    },
});

export default Card;
