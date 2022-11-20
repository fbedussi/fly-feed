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

export type UserDataDb = {
  sites: SiteDb[]
  categories: CategoryDb[]
}

