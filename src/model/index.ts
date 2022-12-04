export type UserId = string

export type User = {
  id: UserId
  username: string
}

export type IsoDate = string

export type SiteDb = {
  id: string
  title: string
  xmlUrl: string
  htmlUrl: string
  muted?: boolean
  deleted?: boolean
  errorTimestamps: IsoDate[]
}

export type CategoryDb = {
  id: string
  name: string
  muted?: boolean
  deleted?: boolean
  sites: SiteDb[]
}

export type SubscriptionsDb = {
  categories: CategoryDb[]
}

export type Article = {
  content: string
  isoDate: IsoDate
  link: string
  title: string
  saved?: boolean
  images?: string[]
}

export type SavedArticle = {
  categoryId: string
  siteId: string
  isNew?: boolean
  article: Article
}

export type FetchOk = {
  categoryId: string
  siteId: string
  article: Article
}

export type FetchKo = {
  categoryId: string
  siteId: string
  errorTimestamp: string
}
