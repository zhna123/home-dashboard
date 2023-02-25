import { url } from "inspector";
import { dlete, get, post, put } from "../common/Parameters";
import { bridgeUri } from "../configuration/Hue";
import { create as LightCreate, createSubmittable as createSubmittableLight, Light, Lights } from "../models/Light";
import { createSubmittable as createSubmittableLightState, LightState } from "../models/LightState";

export class LightsApi {

  async getAll(): Promise<Lights> {
    let lightsMap;
    let uri;
    try {
      uri = `${bridgeUri}/lights/`;
      lightsMap = await (await fetch(uri, get)).json();
    } catch (err) {
      alert(err + ' bridge uri: ' + uri)
    }
    lightsMap = this.attachId(lightsMap);
    return lightsMap;
  }

  async get(id: string): Promise<Light> {
    const uri = `${bridgeUri}/lights/${id}`;
    const light = await (await fetch(uri, get)).json();
    light.id = id;
    return LightCreate(light);
  }

  async delete(id: string) {
    const uri = `${bridgeUri}/lights/${id}`;
    await (await fetch(uri, dlete)).json();
  }

  async searchForNew() {
    const searchUri = `${bridgeUri}/lights`;
    await (await fetch(searchUri, post)).json();
  }

  async getSome(ids: string[]): Promise<Lights> {
    const allLights = this.getAll();
    Object.keys(allLights).forEach((key) => {
      if (!ids.includes(key)) {
        delete allLights[key];
      }
    });
    return allLights;
  }

  async put(light: Light): Promise<void> {
    const uri = `${bridgeUri}/lights/${light.id}`;
    if (light.state) {
      await this.putState(light.id, light.state);
    }
    const submittableLight = createSubmittableLight(light);
    const parameters: RequestInit = {
      ...put,
      body: JSON.stringify(submittableLight),
    };
    const response = await (await fetch(uri, parameters)).json();
    console.log(`put light response${JSON.stringify(response, null, 2)}`);
  }

  async putState(id: string, lightState: Partial<LightState>): Promise<void> {
    const uri = `${bridgeUri}/lights/${id}/state`;
    const submittableLightState = createSubmittableLightState(lightState);
    const parameters: RequestInit = {
      ...put,
      body: JSON.stringify(submittableLightState),
    };
    console.log(`putting light state${JSON.stringify({ uri, parameters }, null, 2)}`);
    const response = await (await fetch(uri, parameters)).json();
    console.log(`put light state response${JSON.stringify(response, null, 2)}`);
  }

  attachId(lightsMap: any): Lights {
    for (const lightId of Object.keys(lightsMap)) {
      lightsMap[lightId].id = lightId;
      lightsMap[lightId] = LightCreate(lightsMap[lightId]);
    }
    return lightsMap;
  }
}