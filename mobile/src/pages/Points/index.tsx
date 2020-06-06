import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import MapView, { Marker, LocalTile } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';

import api from '../../services/api';

import styles from './styles';

interface Item {
  id: number,
  title: string,
  image_url: string,
}

interface Point {
  id: number,
  name: string,
  image: string,
  image_url: string,
  latitude: number,
  longitude: number,
}

interface Params {
  uf: string,
  city: string,
}

const Points = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initialPosition, setInicialPosition] = useState<[number, number]>([0, 0]);
  const navigation = useNavigation();
  const routes = useRoute();
  const routeParams = routes.params as Params;

  useEffect(() => {
    async function handleGetItems() {
      const response = await api.get('/items');

      if (response) {
        setItems(response.data);
      }
    }

    handleGetItems();
  }, []);

  useEffect(() => {
    async function handleLoadNavigation() {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Ooops...', 'Precisamos da sua permissão para obter sua localização.');
        return;
      }

      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      console.log(latitude, longitude);

      setInicialPosition([
        latitude,
        longitude,
      ]);
    }

    handleLoadNavigation();
  }, []);

  useEffect(() => {
    async function handleGetPoints() {
      const response = await api.get('/points', {
        params: {
          city: routeParams.city,
          uf: routeParams.uf,
          items: selectedItems,
        }
      });

      if (response) {
        setPoints(response.data)
      }
    }

    handleGetPoints();
  }, [selectedItems]);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleNavigateToDetail(id: number) {
    navigation.navigate('Detail', { point_id: id });
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.find(item => item === id);

    if (alreadySelected) {
      setSelectedItems(
        selectedItems.filter(item => item !== alreadySelected)
      );
    } else {
      setSelectedItems([ ...selectedItems, id ]);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handleNavigateBack}
          activeOpacity={0.6}
        >
          <Icon name="arrow-left" color="#34cb79" size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta</Text>

        <View style={styles.mapContainer}>
          {initialPosition[0] !== 0 && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {points.map(point => (
                <Marker
                  key={String(point.id)}
                  style={styles.mapMarker}
                  onPress={() => handleNavigateToDetail(point.id)}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{ uri: point.image_url }}
                    />
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {items.map(item => (
            <TouchableOpacity
              key={String(item.id)}
              style={[
                styles.item,
                selectedItems.includes(item.id) && styles.selectedItem,
              ]}
              onPress={() => handleSelectItem(item.id)}
            >
              <SvgUri height={42} width={42} uri={item.image_url} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

export default Points;
