// App.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

const API_KEY = 'YOUR_API_KEY'; // Replace with your Tomorrow.io API key

const App = () => {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeatherData(location.coords.latitude, location.coords.longitude);
    }
  }, [location]);

  const fetchWeatherData = async (latitude, longitude) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.tomorrow.io/v4/timelines?location=${latitude},${longitude}&fields=temperature,weatherCode&apikey=${API_KEY}`
      );
      const data = await response.json();
      setWeatherData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.locationText}>
            {location ? `Location: ${location.coords.latitude}, ${location.coords.longitude}` : 'Fetching location...'}
          </Text>
          <Text style={styles.weatherText}>
            {weatherData ? `Temperature: ${weatherData.data.timelines[0].intervals[0].values.temperature}°C` : 'Fetching weather...'}
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 20,
    marginBottom: 20,
  },
  weatherText: {
    fontSize: 24,
  },
});

export default App;
