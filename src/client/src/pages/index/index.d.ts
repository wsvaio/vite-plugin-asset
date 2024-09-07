export interface Payload {
  params: { name: string }
  fileInfo: Record<any, any>
  show: boolean
}
export interface Actions {
  打开抽屉: { fileInfo: { path: string, name: string } }
}
