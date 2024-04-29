import { Definition, DefsGetObj, DictObj, WordObj, WordsGetObj } from '../types'
import mongo from './mongo-service'
import Cache from './cache-service'
import Forming from './forming-service'

class DefinitionService {
  getDefObj: (id: number) => Promise<Definition[]>
  getLast20Defs: (id: number) => Promise<DefsGetObj>
  saveDefs: (id: number, defs: Definition[]) => Promise<void>
  constructor() {
    this.getDefObj = this.#getDefObj.bind(this)
    this.getLast20Defs = this.#getLast20Defs.bind(this)
    this.saveDefs = this.#saveDefs.bind(this)
  }

  async show(id: number): Promise<[string, number]> {
    const { defs, defsIndex, moreThan30 }: DefsGetObj =
      await this.getLast20Defs(id)
    if (defs && defs.length != 0) {
      let defsStr: string = Forming.formDefsShowToString(defs, defsIndex)
      return [defsStr, moreThan30 ? defsIndex : -1]
    } else {
      return ['У вас нет определений', -1]
    }
  }

  async isWord(id: number, word: string): Promise<boolean> {
    const defs: Definition[] = await this.getDefObj(id)
    const result: Definition | undefined = defs.find((e) => {
      return e.word == word.toLowerCase()
    })
    return result ? true : false
  }

  async saveDef(id: number): Promise<void> {
    let defs: Definition[] = await this.#getDefObj(id)
    let addDefs: [string, string] | undefined = Cache.getAddDefs(id)
    if (addDefs) {
      const newDef: Definition = {
        word: addDefs[0],
        definition: addDefs[1],
        synonyms: []
      }
      defs.push(newDef)
      this.#saveDefs(id, defs)
    }
  }

  async deleteDef(id: number, indexesStr: string): Promise<number> {
    let defs: Definition[] = await this.getDefObj(id)
    const indexes: number[] = Forming.formDeleteIndexesToArray(indexesStr, defs)
    indexes.forEach((index) => {
      defs.splice(index, 1)
    })
    this.#saveDefs(id, defs)
    return indexes.length
  }

  async #getDefObj(id: number): Promise<Definition[]> {
    var defs: Definition[] | null = Cache.getDefs(id)
    if (!defs) {
      defs = await mongo.getDefs(id)
      if (!defs) throw new Error('mongo error maybe')
      Cache.setDefs(id, defs)
      return defs
    }
    return defs
  }

  async #getLast20Defs(id: number): Promise<DefsGetObj> {
    let defs: Definition[] = await this.getDefObj(id)
    const moreThan20 = defs.length > 20
    const index: number = moreThan20 ? defs.length - 20 : 0
    defs = defs.slice(index)
    return {
      defs: defs ? defs : null,
      defsIndex: index,
      moreThan30: moreThan20
    }
  }

  async #saveDefs(id: number, defs: Definition[]): Promise<void> {
    Cache.setDefs(id, defs)
    await mongo.saveDefs(id, defs)
  }
}

export default new DefinitionService()
