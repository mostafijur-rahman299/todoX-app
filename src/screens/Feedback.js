import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Feedback = () => {
  const supportOptions = [
    {
      title: 'Email Us',
      description: 'Send us an email directly',
      icon: 'email',
      onPress: () => Linking.openURL('mailto:support@yourapp.com')
    }
  ];

  const SupportCard = ({ title, description, icon, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Icon name={icon} size={32} color="#007AFF" style={styles.icon} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      

      <View style={styles.cardsContainer}>
        {supportOptions.map((option, index) => (
          <SupportCard key={index} {...option} />
        ))}
      </View>

      <View style={styles.additionalInfo}>
        <Text style={styles.infoText}>
          Operating Hours: Monday - Friday, 9AM - 6PM
        </Text>
        <Text style={styles.infoText}>
          Response Time: Within 24 hours
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  cardsContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  additionalInfo: {
    padding: 20,
    backgroundColor: '#FFF',
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});

export default Feedback;
