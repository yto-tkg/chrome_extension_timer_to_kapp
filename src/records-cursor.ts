import { fetcher } from './utils'
/**
 * POST https://bozuman.cybozu.com/k/v1/records/cursor.json
 *
 * @param app
 * @returns cursorId
 */
const postRecordsCursor = async (
  app: number
): Promise<string> => {
  return await fetcher('https://bozuman.cybozu.com/k/v1/records/cursor.json', {
    method: 'POST',
    headers: {
      Origin: '*',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Cybozu-API-Token': 'H1PYC3EHiiG8GuB9Tkojk5oIawnnfUGnwI2gZjNp'
    },
    body: JSON.stringify({
      app: app
    })
  })
}

export default postRecordsCursor
