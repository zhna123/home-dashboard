import { View } from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import { createBasesFromColor } from "solarizer";
import { RgbBaseStringMap } from "solarizer/tsc-out/RgbMaps";
import { getStyles } from "../../../common/Style";
import {Text, StyleSheet} from 'react-native';


export enum Status { ON, OFF, INDETERMINATE }
export interface StatusToggleStatus {
  onText: string; 
  offText: string; 
  indeterminateText?: string;
  onBaseColor: string; 
  offBaseColor: string; indeterminateBaseColor?: string;
}
export interface StatusToggleActions {
  turnOnText: string; 
  turnOffText: string;
  turnOnBaseColor: string; 
  turnOffBaseColor: string;
}
export function getStatusToggleRow(
  key: string,
  fieldName: string,
  statusToggleStatus: StatusToggleStatus,
  statusToggleActions: StatusToggleActions,
  statusFunction: () => Status,
  toggleCallback: (newValue: boolean) => void,
): JSX.Element {
  const styles = getStyles();
  let statusColors: RgbBaseStringMap;
  let statusText: string;
  let statusActionColors: RgbBaseStringMap;
  let statusActionText: string;
  let countsAsOn: boolean;
  switch (statusFunction()) {
    case Status.ON:
      statusColors = createBasesFromColor(statusToggleStatus.onBaseColor, "base01");
      statusText = statusToggleStatus.onText;
      statusActionColors = createBasesFromColor(statusToggleActions.turnOffBaseColor, "base01");
      statusActionText = statusToggleActions.turnOffText;
      countsAsOn = true;
      break;
    case Status.OFF:
      statusColors = createBasesFromColor(statusToggleStatus.offBaseColor, "base01");
      statusText = statusToggleStatus.offText;
      statusActionColors = createBasesFromColor(statusToggleActions.turnOnBaseColor, "base01");
      statusActionText = statusToggleActions.turnOnText;
      countsAsOn = false;
      break;
    case Status.INDETERMINATE:
      statusColors = createBasesFromColor(statusToggleStatus.indeterminateBaseColor!, "base01");
      statusText = statusToggleStatus.indeterminateText!;
      statusActionColors = createBasesFromColor(statusToggleActions.turnOnBaseColor, "base01");
      statusActionText = statusToggleActions.turnOnText;
      countsAsOn = false;
      break;
    default: throw new Error(`Unknown Status value: ${statusFunction()}`);
  }
  return (
    <View style={[{
      // ...showBorder,
      alignSelf: "center",
      marginBottom: styles.heightMargin,
      flexDirection: "row",
      justifyContent: "space-between",
      height: 50,
      width: styles.width * .6,
    }]}>
      <Text style={[{
        color: statusColors.base1,
        fontWeight: "bold"
      }]}>
      {` ${statusText} `}
      </Text>
      {/* <AwesomeButton
        key={key}
        // accessibilityLabel={key}
        backgroundColor={statusColors.base01}
        backgroundActive={statusColors.base02}
        backgroundDarker={statusColors.base03}
        textColor={statusColors.base1}
        height={styles.buttonHeight}
        // textSize={12}
        disabled={true}
      >{` ${statusText} `}</AwesomeButton> */}
      <AwesomeButton
        key={`${key} toggle`}
        // accessibilityLabel={key}
        backgroundColor={statusActionColors.base01}
        backgroundActive={statusActionColors.base02}
        backgroundDarker={statusActionColors.base03}
        textColor={statusActionColors.base1}
        height={styles.buttonHeight}
        onPress={() => toggleCallback(!countsAsOn)}
        // textSize={12}
        disabled={false}
      >{` ${statusActionText} `}</AwesomeButton>
    </View>);
}
