/**Core**/
import {Injectable, Component} from '@angular/core';
/**Ionic native**/

/**Interfaces**/
import {IPreparation} from '../interfaces/preparation/iPreparation';
/**Services**/
import {UIHelper} from '../services/uiHelper';
import {UILog} from '../services/uiLog';
import {UIStorage} from  '../services/uiStorage';
import {StorageClass} from  '../classes/storageClass';


@Injectable()
export class UIPreparationStorage extends StorageClass {

  constructor(protected uiStorage: UIStorage,
              protected uiHelper: UIHelper,
              protected uiLog: UILog) {
    super(uiStorage, uiHelper, uiLog, "PREPARATION");

  }

  public getPreparationNameByUUID(_uuid: string):string {
    if (_uuid.toLowerCase() === "standard") {
      return "Standard";
    }
    else {
      let entries: Array<IPreparation> = this.getAllEntries();
      for (let i = 0; i < entries.length; i++) {
        if (entries[i].config.uuid === _uuid) {
          return entries[i].name;
        }
      }


      return "_nicht gefunden_";
    }
  }

}
