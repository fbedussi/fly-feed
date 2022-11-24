export type UserId = string

export type User = {
  id: UserId
  username: string
}

export type IsoDate = string

export type SiteDb = {
  id: string,
  title: string
  xmlUrl: string
  htmlUrl: string
  starred: boolean
  errorTimestamps: IsoDate[]
}

export type Site = SiteDb & {
  newArticles: number
}

export type CategoryDb = {
  id: string,
  name: string
  sites: SiteDb[]
}

export type Category = CategoryDb & {
  newArticles: number
}

export type SubscriptionsDb = {
  sites: SiteDb[]
  categories: CategoryDb[]
}

export type Subscriptions = {
  sites: Site[]
  categories: Category[]
}

export type Article = {
  content: string
  isoDate: IsoDate
  link: string
  title: string
  starred: boolean
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
