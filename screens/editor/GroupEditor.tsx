import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import { lights, update } from "../../common/HueState";
import { getStyles } from "../../common/Style";
import { ScrollView, View } from "../../components/Themed";
import { GroupsApi } from "../../hue/GroupsApi";
import { getEmpty, Group } from "../../models/Group";
import { Lights } from "../../models/Light";
import { RootStackScreenProps } from "../../types";
import { getLightSelector } from "./components/LightSelector";
import { getTitle } from "./components/Title";

export default function GroupEditor({ route, navigation }: RootStackScreenProps<'GroupEditor'>) {

    let id: string = '-1';
    let name: string = '';

    if (route.params != undefined) {
        id = route.params.id;
        name = route.params.name;
    }

    const [group, setGroup] = useState<Group>(Object);

    const [groupName, setGroupName] = useState<string>(name);
    const [lightsObj, setLightsObj] = useState<Lights>({});
    const [newGroup, setNewGroup] = useState<boolean>(false);

    const groupsApi = new GroupsApi();

    useEffect(() => {
        (async () => {
            if (id !== "-1") {
                const grp = await groupsApi.get(id);
                setGroup(grp)
                setLightsObj(lights)
                setNewGroup(false)
            } else {
                setGroup(getEmpty())
                setLightsObj(lights)
                setNewGroup(true)
            }
       })()
    }, []);
    
    async function endNameEdit() {
        const grp = {...group, name: groupName}
        await groupsApi.put(grp);
        await update();

        setGroup(grp);
    }

    async function updateGroup(grp: Group) {
        if (!newGroup) {
          await groupsApi.put(grp);
          await update()
          setGroup(grp);
        } else {
          setGroup(grp);
        }
    }

    async function toggleLightSelection(lightId: string) {
        const lightsArray = group.lights.includes(lightId)
          ? group.lights.filter((selectedId) => selectedId !== lightId)
          : group.lights.concat(lightId);
          
        const grp = {...group, lights: lightsArray}
        await updateGroup(grp);
    }

    // async function createGroup() {
    //     await groupsApi.create(group);
    //     this.props.navigation.navigate("Groups");
    // }

    const styles = getStyles();
    const getView = () =>
      id ? 
      <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flex: 1 }}>
              <AwesomeButton
                style={{ marginTop: styles.buttonHeight / 2 }}
                key={`Delete Light: ${group.id}`}
                // accessibilityLabel={`Delete Light: ${this.state.group.id}`}
                backgroundColor={styles.red.base01}
                backgroundActive={styles.red.base02}
                backgroundDarker={styles.red.base03}
                textColor={styles.red.base1}
                height={styles.buttonHeight / 2}
                // onPress={() => this.deleteGroup()}
              >{` DELETE `}</AwesomeButton>
              {getTitle(
                "Group",
                id,
                groupName,
                endNameEdit,
                setGroupName)}
              {
                getLightSelector(
                  group.lights,
                  Object.values(lightsObj),
                  toggleLightSelection,
                )
              }
              {/* {getBrightnessSlider(
                this.state.group.action.bri,
                this.setBrightness.bind(this),
                solarized,
              )}
              {
                getStatusToggleRow(
                  "Group Alert Row",
                  "action.alert",
                  {
                    onText: "Currently: Blinking",
                    offText: "Currently: Not Blinking",
                    onBaseColor: solarized.yellow,
                    offBaseColor: solarized.base01,
                  },
                  {
                    turnOnText: "Start",
                    turnOffText: "Stop",
                    turnOnBaseColor: solarized.yellow,
                    turnOffBaseColor: solarized.base01,
                  },
                  () => getBlinking(this.state.group),
                  this.toggleAlert.bind(this),
                )
              }
              {
                getStatusToggleRow(
                  "Group Status Row",
                  "action.on",
                  {
                    onText: "Currently: All On",
                    offText: "Currently: All Off",
                    indeterminateText: "Some On",
                    onBaseColor: solarized.yellow,
                    offBaseColor: solarized.base01,
                    indeterminateBaseColor: solarized.orange,
                  },
                  {
                    turnOnText: "Turn On",
                    turnOffText: "Turn Off",
                    turnOnBaseColor: solarized.yellow,
                    turnOffBaseColor: solarized.base01,
                  },
                  () => getStatus(this.state.group),
                  this.toggleOn.bind(this),
                )
              } */}
              {/* {
                newGroup ?
                  <AwesomeButton
                    style={{
                      alignSelf: "flex-end",
                    }}
                    key={`Create Group`}
                    // accessibilityLabel={`Create Group`}
                    backgroundColor={styles.green.base01}
                    backgroundActive={styles.green.base02}
                    backgroundDarker={styles.green.base03}
                    textColor={styles.green.base1}
                    height={styles.buttonHeight}
                    onPress={() => createGroup()}
                  >
                    {` Create `}
                  </AwesomeButton> : undefined
              } */}
            </View>
          </ScrollView>
        </View >
        : <ActivityIndicator size="large" color="#0000ff" />;

    return (
        <View style={[{ flex: 1 }, styles.background]}>
          {getView()}
        </View>
    );
}