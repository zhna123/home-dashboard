import React from "react";
import { View, ViewStyle } from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import { sortBy } from "../../../common";
import { getStyles } from "../../../common/Style";

export function getLightSelector(
  selectedItems: string[],
  items: Array<{ id: string, name: string }>,
  toggleLightSelection: (itemId: string) => void,
) {

  const styles = getStyles();
  const sortedItems = sortBy(items, "name");
  const lightSelectButtons = sortedItems.map((lightMeta) => {
    const buttonDimension = 99;
    const style: ViewStyle = {
      margin: 5,
    };
    return (<AwesomeButton
      style={style}
      key={lightMeta.id}
      onPress={() => toggleLightSelection(lightMeta.id)}
    //   accessibilityLabel={lightMeta.name}
      backgroundColor={selectedItems.includes(lightMeta.id) ? styles.blue.base01 : styles.solarized.base01}
      backgroundActive={selectedItems.includes(lightMeta.id) ? styles.blue.base02 : styles.solarized.base02}
      backgroundDarker={selectedItems.includes(lightMeta.id) ? styles.blue.base03 : styles.solarized.base03}
      textColor={selectedItems.includes(lightMeta.id) ? styles.blue.base1 : styles.solarized.base1}
      width={buttonDimension}
      height={buttonDimension}
      textSize={12}
    >
      {`${lightMeta.name}`}
    </AwesomeButton>);
  });
  return (
    <View style={{
      flexGrow: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
    }}>
      {lightSelectButtons}
    </View>
  );
}