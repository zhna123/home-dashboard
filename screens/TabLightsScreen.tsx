import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import ItemButton from '../components/ItemButton';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { sortBy } from "../common";
import { LightsApi } from "../hue/LightsApi";
import { Lights } from "../models/Light";
import { lights } from "../common/HueState";
import { grey, yellow } from "../common/Style";
import { func } from 'prop-types';
import { getFavoriteArray, toggleFavorite } from "../common/Favorites";


// interface State {
//   lights?: Lights;
//   favorites: string[];
// }

export default function TabLightsScreen() {

  const [lightsObj, setLightsObj] = useState<Lights>(lights);
  const [favorites, setFavorites] = useState<string[]>([]);

  async function updateLights(id: string) {
    await lightsApi.putState(id, { on: !lightsObj[id].state.on });

    const newLightsObject = {...lights};
    newLightsObject[id].state.on = !lightsObj[id].state.on;
    setLightsObj( newLightsObject );
  }

  const lightsApi = new LightsApi();

  const lightButtons = lightsObj
      ? sortBy(Object.values(lightsObj), "name")
        .map((light) => {
          return (
            <ItemButton
              isFavorite={favorites.includes(light.id)}
              id={light.id}
              key={`light-${light.id}`}
              colorMap={light.state.on ? yellow : grey}
              // onClick={this.onClick.bind(this)}
              onClick = { () => updateLights(light.id) }
              // onEditClick={this.onEditClick.bind(this)}
              // onFavoriteClick={(id: string) => toggleFavorite("favoriteLights", id)}
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
