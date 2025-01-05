import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';

const WeightLossTip = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [displayedTips, setDisplayedTips] = useState([]);
    const scrollViewRef = useRef(null);
    const screenWidth = Dimensions.get('window').width;
    const cardWidth = screenWidth - 97;

    const allWeightLossTips = [
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
        },
        {
            id: 6,
            title: "Ara Öğünler",
            description: "Sağlıklı ara öğünlerle metabolizmanızı aktif tutun. Meyve ve kuruyemişler iyi birer seçenek.",
            color: "#FF9A8B"
        },
        {
            id: 7,
            title: "Lifli Gıdalar",
            description: "Sebze, meyve ve tam tahıllı ürünler tüketin. Lif, uzun süre tok tutar.",
            color: "#88D8B0"
        },
        {
            id: 8,
            title: "Şeker Kontrolü",
            description: "İşlenmiş şeker tüketimini azaltın. Tatlı isteğinizi meyvelerle giderin.",
            color: "#FF6B6B"
        },
        {
            id: 9,
            title: "Planlı Beslenme",
            description: "Öğünlerinizi önceden planlayın. Bu, sağlıksız atıştırmalıkları engeller.",
            color: "#4ECDC4"
        },
        {
            id: 10,
            title: "Stres Yönetimi",
            description: "Stres, kilo almaya neden olabilir. Meditasyon ve yoga deneyin.",
            color: "#45B7D1"
        },
        {
            id: 11,
            title: "Kahvaltı Alışkanlığı",
            description: "Güne sağlıklı bir kahvaltıyla başlayın. Metabolizmanızı hızlandırır.",
            color: "#96CEB4"
        },
        {
            id: 12,
            title: "Yemek Günlüğü",
            description: "Ne yediğinizi not edin. Bu, kalori alımınızı kontrol etmenize yardımcı olur.",
            color: "#6C63FF"
        },
        {
            id: 13,
            title: "Alkol Sınırlaması",
            description: "Alkol tüketimini azaltın. Alkol boş kalori kaynağıdır ve metabolizmayı yavaşlatır.",
            color: "#FF9A8B"
        },
        {
            id: 14,
            title: "Düzenli Tartılma",
            description: "Haftada bir kez aynı saatte tartılın. İlerlemenizi takip edin.",
            color: "#88D8B0"
        },
        {
            id: 15,
            title: "Sosyal Destek",
            description: "Aileniz ve arkadaşlarınızla hedeflerinizi paylaşın. Destek almak motivasyonunuzu artırır.",
            color: "#FF6B6B"
        },
        {
            id: 16,
            title: "Yürüyüş Molası",
            description: "Her saat başı 5 dakika yürüyüş yapın. Gün içinde hareket önemli.",
            color: "#4ECDC4"
        },
        {
            id: 17,
            title: "Pişirme Yöntemi",
            description: "Kızartma yerine ızgara, haşlama veya fırınlama tercih edin.",
            color: "#45B7D1"
        },
        {
            id: 18,
            title: "Sebze Çeşitliliği",
            description: "Her gün farklı renklerde sebzeler tüketin. Her renk farklı besin değeri taşır.",
            color: "#96CEB4"
        },
        {
            id: 19,
            title: "Mindful Eating",
            description: "Yemek yerken TV izlemeyin. Yemeğinize odaklanın ve tadını çıkarın.",
            color: "#6C63FF"
        },
        {
            id: 20,
            title: "Ev Yemekleri",
            description: "Dışarıda yemek yerine evde pişirin. Kalori kontrolü daha kolay olur.",
            color: "#FF9A8B"
        },
        {
            id: 21,
            title: "Diyet Değil Yaşam Tarzı",
            description: "Kısa süreli diyetler yerine kalıcı beslenme alışkanlıkları edinin.",
            color: "#88D8B0"
        },
        {
            id: 22,
            title: "Karbonhidrat Seçimi",
            description: "Rafine karbonhidratlar yerine tam tahıllı ürünleri tercih edin.",
            color: "#FF6B6B"
        },
        {
            id: 23,
            title: "Yağ Kontrolü",
            description: "Sağlıklı yağları tercih edin: zeytinyağı, avokado, kuruyemişler.",
            color: "#4ECDC4"
        },
        {
            id: 24,
            title: "Açlık-Tokluk Dengesi",
            description: "Açlık sinyallerinizi dinleyin. Tok hissettiğinizde durun.",
            color: "#45B7D1"
        },
        {
            id: 25,
            title: "Kas Çalışması",
            description: "Haftada 2-3 kez kuvvet egzersizleri yapın. Kas kütlesi metabolizmayı hızlandırır.",
            color: "#96CEB4"
        },
        {
            id: 26,
            title: "Beslenme Etiketi",
            description: "Paketli ürünlerin besin değerlerini okuyun ve karşılaştırın.",
            color: "#6C63FF"
        },
        {
            id: 27,
            title: "Probiyotik Tüketimi",
            description: "Yoğurt ve kefir gibi probiyotik gıdalar metabolizmayı destekler.",
            color: "#FF9A8B"
        },
        {
            id: 28,
            title: "Denge Prensibi",
            description: "Tüm besin gruplarından dengeli şekilde tüketin.",
            color: "#88D8B0"
        },
        {
            id: 29,
            title: "Düzenli Öğün",
            description: "Öğün atlamamaya özen gösterin. Metabolizmanızı düzenli tutun.",
            color: "#FF6B6B"
        },
        {
            id: 30,
            title: "Hedef Belirleme",
            description: "Gerçekçi ve ulaşılabilir kilo hedefleri belirleyin.",
            color: "#4ECDC4"
        }
    ];

    useEffect(() => {
        // Rastgele 5 ipucu seç
        const shuffled = [...allWeightLossTips].sort(() => 0.5 - Math.random());
        setDisplayedTips(shuffled.slice(0, 5));
    }, []);

    const handleScroll = (event) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / cardWidth);
        setActiveIndex(index);
    };

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
                {displayedTips.map((tip, index) => (
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
                {displayedTips.map((_, index) => (
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
        marginHorizontal: 8,
        borderRadius: 15,
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