import shortid from 'shortid'
import { CategoryDb, SiteDb } from '../model';

export const readFile = (file: File | null): Promise<any> => new Promise((res, rej) => {
  if (!file) {
    return rej('no file')
  }
  const reader = new FileReader()

  reader.addEventListener("loadend", (e) => {
    res(reader.result);
  });

  reader.readAsText(file)
})

export const parseXml = (xml: string) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, "text/xml");

  return xmlDoc
}

export const convertOpmlToJson = (doc: Document) => {
  const decodeSite = (outline: Element): SiteDb => {
    const title = outline.getAttribute('title') || ''
    const xmlUrl = outline.getAttribute('xmlurl') || ''
    const htmlUrl = outline.getAttribute('htmlUrl') || ''

    return {
      id: shortid.generate(),
      title,
      xmlUrl,
      htmlUrl,
      starred: false,
      errorTimestamps: [],
    }
  }

  const outlines = Array.from(doc.children[0].querySelectorAll('body > outline'))
  const data = outlines.map((outline: Element) => {
    const children = Array.from(outline.querySelectorAll('outline'))

    if (children.length) {
      const name = outline.getAttribute('name') || ''
      const sites = Array.from(outline.querySelectorAll('outline')).map(decodeSite)

      const category: CategoryDb = {
        id: shortid.generate(),
        name,
        sites,
      }
      return category
    }

    return decodeSite(outline)
  })

  return {
    categories: data.filter(({ sites }: any) => sites),
    sites: data.filter(({ xmlUrl }: any) => xmlUrl),
  }
}
