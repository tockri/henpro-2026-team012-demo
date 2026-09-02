// 担当者情報。MainPageのFABとChatPageで同じ人物を表示するため一箇所に集約する。
export type Agent = {
  /** 姓 */
  familyName: string
  /** 名 */
  givenName: string
  /** アバターに表示する1文字 */
  initial: string
}

export const AGENT: Agent = {
  familyName: '住宅',
  givenName: '栄子',
  initial: '住',
}

export const agentFullName = (agent: Agent): string =>
  `${agent.familyName}　${agent.givenName}`
