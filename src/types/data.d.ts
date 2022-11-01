export type PostRecordsCursorResp = {
  id: string
  totalCount: number
}

export type GetRecordsCursorResp = {
  recordId: number
  fieldId: number
  minute: number
  date: string
  otherFields: Object
}
