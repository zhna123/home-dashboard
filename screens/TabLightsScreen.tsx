import React, { useState, useEffect, useReducer } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import ItemButton from '../components/ItemButton';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { sortBy } from "../common";
import { LightsApi } from "../hue/LightsApi";
import { Lights } from "../models/Light";
import { lights, poll, update } from "../common/HueState";
import { grey, yellow } from "../common/Style";
import { func } from 'prop-types';
import { getFavoriteArray, toggleFavorite } from "../common/Favorites";
import { useIsFocused } from '@react-navigation/native';


export default function TabLightsScreen() {

  const [lightsObj, setLightsObj] = useState<Lights>({});
  const [favorites, setFavorites] = useState<string[]>([]);

  const lightsApi = new LightsApi();
  const isFocused = useIsFocused();

  useEffect(() => {
    // trigger rendering when tab changes
    if (isFocused) {
      setLightsObj(lights);
    }
  }, [isFocused]);


  async function updateLights(id: string) {
    
    await lightsApi.putState(id, { on: !lightsObj[id].state.on });
    await update()

    setLightsObj( lights );
    const fvLights = await getFavoriteArray("favoriteLights");
    setFavorites( fvLights )
  }

  const lightButtons = lightsObj
      ? sortBy(Object.values(lightsObj), "name")
        .map((light) => {
          return (
            <ItemButton
              isFavorite={favorites.includes(light.id)}
              id={light.id}
              key={`light-${light.id}`}
              colorMap={light.state.on ? yellow : grey}
              onClick = { () => updateLights(light.id) }
              // onEditClick={this.onEditClick.bind(this)}
              onFavoriteClick={(id: string) => toggleFavorite("favoriteLights", id)}
              title={light.name}
              reachable={light.state.reachable}
            />
          );
        }).concat(
          <ItemButton
            colorMap={grey}
            key={`light-SCAN`}
            onClick={lightsApi.searchForNew}
            title={"Scan for new lights"}
            reachable={true}
            hideEditButton={true}
            hideFavoritesButton={true}
          />,
        )
      : <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <View style={styles.container}>
      { lightButtons }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#002b36",
  },
});
