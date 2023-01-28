import { dlete, get, post, put } from "../common/Parameters";
import { bridgeUri } from "../configuration/Hue";
import { create as GroupCreate, createSubmittable as createSubmittableGroup, Group, Groups } from "../models/Group";
import { createSubmittable as createSubmittableGroupAction, GroupAction } from "../models/GroupAction";


export class GroupsApi {
  async getAll(): Promise<Groups> {
    const uri = `${bridgeUri}/groups/`;
    let groups = await (await fetch(uri, get)).json();
    groups = this.attachId(groups);
    // console.log(JSON.stringify(groups[4], null, 2))
    return groups;
  }

  async get(id: string): Promise<Group> {
    const uri = `${bridgeUri}/groups/${id}`;
    const group = await (await fetch(uri, get)).json();
    group.id = id;
    return GroupCreate(group);
  }

  async delete(id: string) {
    const uri = `${bridgeUri}/groups/${id}`;
    await (await fetch(uri, dlete)).json();
  }

  async put(group: Group): Promise<void> {
    const uri = `${bridgeUri}/groups/${group.id}`;
    const submittableGroup = createSubmittableGroup(group);
    const parameters: RequestInit = { ...put, body: JSON.stringify(submittableGroup) };
    const response = await (await fetch(uri, parameters)).json();
    // console.log(`put group response${JSON.stringify(response, null, 2)}`);
  }

  async create(group: Group): Promise<void> {
    const uri = `${bridgeUri}/groups`;
    const submittableGroup = createSubmittableGroup(group);
    const parameters: RequestInit = { ...post, body: JSON.stringify(submittableGroup) };
    const response = await (await fetch(uri, parameters)).json();
    // console.log(`post group response${JSON.stringify(response, null, 2)}`);
  }

  async putAction(id: string, groupAction: Partial<GroupAction>): Promise<void> {
    const uri = `${bridgeUri}/groups/${id}/action`;
    const submittableGroupAction = createSubmittableGroupAction(groupAction);
    const parameters: RequestInit = { ...put, body: JSON.stringify(submittableGroupAction) };
    const response = await (await fetch(uri, parameters)).json();
    console.log(`put group action response${JSON.stringify(response, null, 2)}`);
  }

  attachId(map: any): Groups {
    for (const id of Object.keys(map)) {
      map[id].id = id;
      map[id] = GroupCreate(map[id]);
    }
    return map;
  }
  
}