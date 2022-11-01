import { GetRecordsCursorResp, PostRecordsCursorResp } from './types/data'
import { fetcher } from './utils'

/** 
 * POST https://bozuman.cybozu.com/k/v1/records/cursor.json
 *
 * @param app
 * @returns cursorId
 */
const postRecordsCursor = async (
  app: number
): Promise<PostRecordsCursorResp> => {
  return await fetcher('https://bozuman.cybozu.com/k/v1/records/cursor.json', {
    method: 'POST',
    headers: {
      Origin: '*',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Cybozu-API-Token': 'HRk4ZDoPMqsP4581zCn1TnX9FYZpxTFIiCzmgBcU'
    },
    body: JSON.stringify({
      app: app
    })
  })
}


/** 
 * GET https://bozuman.cybozu.com/k/v1/records/cursor.json
 *
 * @param app
 * @returns cursorId
 */
const getRecordsCursor = async (
  cursorId: string
): Promise<GetRecordsCursorResp> => {
  const params = new URLSearchParams()
  params.append('id', cursorId)

  return await fetcher(`https://bozuman.cybozu.com/k/v1/records/cursor.json?${params.toString()}`, {
    headers: {
      Origin: '*',
      Accept: 'application/json',
      'X-Cybozu-API-Token': 'HRk4ZDoPMqsP4581zCn1TnX9FYZpxTFIiCzmgBcU'
    },
  }).then((res: any) => {

    const targetRecord = res.records[0]

    let fieldIds = []
    for (let i = 0; i < targetRecord['テーブル']['value'].length - 1; i++) {
      fieldIds.push(targetRecord['テーブル']['value'][i]['id'])
    }

    const response = {
      recordId: targetRecord['レコード番号']['value'],
      fieldId: targetRecord['テーブル']['value'][targetRecord['テーブル']['value'].length - 1]['id'],
      minute: targetRecord['テーブル']['value'][targetRecord['テーブル']['value'].length - 1]['value']['高木さん']['value'],
      date: targetRecord['テーブル']['value'][targetRecord['テーブル']['value'].length - 1]['value']['日付']['value'],
      fieldIds: fieldIds, 
    }
      return response
  })
}

export {postRecordsCursor, getRecordsCursor}
