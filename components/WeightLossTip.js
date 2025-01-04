import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';

const WeightLossTip = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef(null);
    const screenWidth = Dimensions.get('window').width;
    const cardWidth = screenWidth - 100; // Kenarlardan 40'ar pixel boşluk

    const handleScroll = (event) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        console.log(contentOffset);
        const index = Math.round(contentOffset / cardWidth);
        setActiveIndex(index);

        // Son karttan sonra daha fazla kaydırmayı engelle
        // if (index >= weightLossTips.length) {
        //     scrollViewRef.current?.scrollTo({
        //         x: cardWidth * (weightLossTips.length - 1),
        //         animated: true
        //     });
        // }
    };

    const weightLossTips = [
        {
            id: 1,
            title: "Su Tüketimi",
            description: "Günde en az 2-3 litre su için. Su metabolizmayı hızlandırır ve tokluğu artırır.",
            color: "#FF6B6B"
        },
        {
            id: 2,
            title: "Porsiyon Kontrolü",
            description: "Küçük tabaklar kullanın ve yemekleri yavaş yiyin. Bu, daha az kalori almanıza yardımcı olur.",
            color: "#4ECDC4"
        },
        {
            id: 3,
            title: "Protein Ağırlıklı Beslenme",
            description: "Her öğünde protein tüketin. Protein, tok hissetmenizi sağlar ve kas kaybını önler.",
            color: "#45B7D1"
        },
        {
            id: 4,
            title: "Düzenli Egzersiz",
            description: "Haftada en az 150 dakika orta şiddetli egzersiz yapın. Yürüyüş bile fark yaratır!",
            color: "#96CEB4"
        },
        {
            id: 5,
            title: "Uyku Düzeni",
            description: "Günde 7-8 saat uyuyun. Yetersiz uyku, kilo vermeyi zorlaştırır ve iştahı artırır.",
            color: "#6C63FF"
        }
    ];

    return (
        <View style={[styles.card, styles.fullCard]}>
            <Text style={styles.cardTitle}>Zayıflama Önerileri</Text>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={styles.scrollContainer}
            >
                {weightLossTips.map((tip, index) => (
                    <View
                        key={tip.id}
                        style={[
                            styles.tipCard,
                            { backgroundColor: tip.color, width: cardWidth }
                        ]}
                    >
                        <Text style={styles.tipTitle}>{tip.title}</Text>
                        <Text style={styles.tipDescription}>{tip.description}</Text>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.pagination}>
                {weightLossTips.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            index === activeIndex ? styles.paginationDotActive : null
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    fullCard: {
        width: '100%',
        marginBottom: 20,
    },
    scrollContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
        textAlign: 'center',
    },
    tipCard: {
        padding: 20,
        borderRadius: 15,
        marginRight: 20,
        marginVertical: 10,
        minHeight: 150,
        justifyContent: 'center',
        alignItems: 'center', // İçeriği ortala
    },
    tipTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textAlign: 'center', // Başlığı ortala
    },
    tipDescription: {
        fontSize: 14,
        color: 'white',
        lineHeight: 20,
        textAlign: 'center', // Açıklamayı ortala
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ddd',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#6c63ff',
        width: 12,
        height: 12,
        borderRadius: 6,
    },
});

export default WeightLossTip;