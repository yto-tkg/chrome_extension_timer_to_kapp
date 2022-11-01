import { fetcher } from "./utils"

export type PutRecordParams = {
  app: number
  recordId: number
  fieldId: number
  fieldName: string
  minute: number
  otherFields: Object
}


/** 
 * PUT https://bozuman.cybozu.com/k/v1/record.json
 *
 * @param PutRecordParams
 * @returns Promise
 */
const putRecord = async (
  putData: PutRecordParams
): Promise<Object> => {

  let obj = JSON.stringify(putData.otherFields) as Object
  alert(JSON.parse(JSON.stringify({...obj})))
  return await fetcher('https://bozuman.cybozu.com/k/v1/record.json', {
    method: 'PUT',
    headers: {
      Origin: '*',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Cybozu-API-Token': 'HRk4ZDoPMqsP4581zCn1TnX9FYZpxTFIiCzmgBcU'
    },
    body: JSON.stringify({
      app: putData.app,
      id: putData.recordId,
      record: {
        "テーブル": {
          value: [
            JSON.parse(JSON.stringify({...obj})),
            {
              id: putData.fieldId,
              value: {
                "高木さん": {
                  value: putData.minute
                }
              }
            }
          ]
        }
      }
    })
  })
}

export default putRecord
