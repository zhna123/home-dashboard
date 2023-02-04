import { useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { RgbBaseStringMap } from 'solarizer/tsc-out/RgbMaps';
import { sortBy } from '../common';
import { getFavoriteArray, toggleFavorite } from '../common/Favorites';
import { groups, lights, update } from '../common/HueState';
import { grey, orange, yellow } from '../common/Style';

import EditScreenInfo from '../components/EditScreenInfo';
import ItemButton from '../components/ItemButton';
import { Text, View } from '../components/Themed';
import { GroupsApi } from '../hue/GroupsApi';
import { LightsApi } from '../hue/LightsApi';
import { getStatus, Groups, Status } from '../models/Group';
import { Lights } from '../models/Light';
import { Type, verify } from '../models/Type';
import { RootTabScreenProps } from '../types';

export default function TabFavoritesScreen() {

  const [favoriteLights, setFavoriteLights] = useState<string[]>([]);
  const [favoriteGroups, setFavoriteGroups] = useState<string[]>([]);

  const [lightsObj, setLightsObj] = useState<Lights>({});
  const [groupsObj, setGroupsObj] = useState<Groups>({});

  const isFocused = useIsFocused();

  const lightsApi = new LightsApi();
  const groupsApi = new GroupsApi();

  useEffect(() => {

    // trigger rendering when tab changes
    if (isFocused) {
      setLightsObj(lights);
      setGroupsObj(groups);
      (async () => {
        const fvLights = await getFavoriteArray("favoriteLights");
        setFavoriteLights(fvLights);
        const fvGroups = await getFavoriteArray("favoriteGroups");
        setFavoriteGroups(fvGroups);
      })();

    }
  }, [isFocused]);

  async function onClick(typeAndIdString: string) {
    const typeAndId = typeAndIdString.split("的");
    const type = verify(typeAndId[0] as Type);
    const id = typeAndId[1];
    switch (type) {
      case Type.GROUP:
        switch (getStatus(groupsObj[id])) {
          case Status.ON: await groupsApi.putAction(id, { on: false }); break;
          case Status.OFF: await groupsApi.putAction(id, { on: true }); break;
          case Status.INDETERMINATE: await groupsApi.putAction(id, { on: true }); break;
          default: throw new Error(`Invalid group state: ${JSON.stringify(groupsObj[id], null, 2)}`); break;
        }
        break;
      case Type.LIGHT:
        await lightsApi.putState(id, { on: !lightsObj[id].state.on });
        break;
    }

    await update()

    setLightsObj(lights);
    setGroupsObj(groups);

    const fvGroups = await getFavoriteArray("favoriteGroups");
    setFavoriteGroups(fvGroups);
    const fvLights = await getFavoriteArray("favoriteLights");
    setFavoriteLights(fvLights);
  }

  async function onFavoriteClick(typeAndIdString: string) {
    console.log(`favorite clicked`);
    const typeAndId = typeAndIdString.split("的");
    const type = verify(typeAndId[0] as Type);
    const id = typeAndId[1];
    switch (type) {
      case Type.GROUP: {
        await toggleFavorite("favoriteGroups", id); 
        const fvGroups = await getFavoriteArray("favoriteGroups");
        setFavoriteGroups(fvGroups);
        break;
      }
      case Type.LIGHT: {
        await toggleFavorite("favoriteLights", id); 
        const fvLights = await getFavoriteArray("favoriteLights");
        setFavoriteLights(fvLights);
        break;
      }
    }
  }

  const lightButtons = lightsObj
    ? sortBy(Object.values(lightsObj), "name")
      .filter((light) => favoriteLights.includes(light.id))
      .map((light) => {
        return (
          <ItemButton
            id={`${Type.LIGHT}的${light.id}`}
            isFavorite={true}
            key={`light-${light.id}`}
            colorMap={light.state.on ? yellow : grey}
            onClick={() => onClick(`${Type.LIGHT}的${light.id}`)}
            // onEditClick={this.onEditClick.bind(this)}
            onFavoriteClick={() => onFavoriteClick(`${Type.LIGHT}的${light.id}`)}
            title={light.name}
            reachable={light.state.reachable}
          />
        );
      }) : <ActivityIndicator size="large" color="#0000ff" />;

    const groupButtons = groupsObj
      ? sortBy(Object.values(groupsObj), "name")
        .filter((group) => favoriteGroups.includes(group.id))
        .map((group) => {
          let colorMap: RgbBaseStringMap;
          switch (getStatus(group)) {
            case Status.ON: colorMap = yellow; break;
            case Status.OFF: colorMap = grey; break;
            case Status.INDETERMINATE: colorMap = orange; break;
            default:
              colorMap = grey;
              break;
          }
          return (
            <ItemButton
              isFavorite={favoriteGroups.includes(group.id)}
              id={`${Type.GROUP}的${group.id}`}
              colorMap={colorMap}
              key={`group-${group.id}`}
              onClick={() => onClick(`${Type.GROUP}的${group.id}`)}
              // onEditClick={this.onEditClick.bind(this)}
              onFavoriteClick={() => onFavoriteClick(`${Type.GROUP}的${group.id}`)}
              title={group.name}
              reachable={true}
            />
          );
        })
      : <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <View style={styles.container}>
      {lightButtons}
      {groupButtons}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#002b36",
    flex: 1,
  },
});
