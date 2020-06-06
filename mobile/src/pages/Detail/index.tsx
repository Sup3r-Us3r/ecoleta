import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';

import api from '../../services/api';

import styles from './styles';

interface Params {
  point_id: number,
}

interface Data {
  point: {
    image: string,
    image_url: string,
    name: string,
    email: string,
    whatsapp: string,
    city: string,
    uf: string,
  },
  items: {
    title: string,
  }[],
}

const Detail = () => {
  const [data, setData] = useState<Data>({} as Data);
  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    async function handleGetSpecificPointDetails() {
      const response = await api.get(`/points/${routeParams.point_id}`);

      if (response) {
        setData(response.data);
      }
    }

    handleGetSpecificPointDetails();
  }, []);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}`);
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resídous',
      recipients: [data.point.email],
    });
  }

  if (!data.point) {
    return null;
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" color="#34cb75" size={24} />
        </TouchableOpacity>

        <Image
          style={styles.pointImage}
          source={{ uri: data.point.image_url }}
        />

        <Text style={styles.pointName}>{data.point.name}</Text>
        <Text style={styles.pointItems}>
          {data.items.map(item => item.title).join(', ')}
        </Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>
            {data.point.city}, {data.point.uf}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" color="#FFF" size={20} />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>
        
        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name="mail" color="#FFF" size={20} />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </>
  );
}

export default Detail;
