import { ArticleSection } from '../article/article.component';

export type StrapiMedia = {
  id: number
  name: string
  alternativeText: string
  caption?: string
  width: number
  height: number
  formats?: {
    thumbnail: {
      url: string
    },
    small?: {
      url: string
    },
    medium?: {
      url: string
    },
    large?: {
      url: string
    },
    xlarge?: {
      url: string
    },
  }
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: any
  provider: string
  provider_metadata: any
  createdAt: string
  updatedAt: string
}

export type StrapiFilter = {
  field: string,
  operator?:
    "eq" | "eqi" | "ne" | "nei"
    | "lt" | "lte" | "gt" | "gte" | "in"
    | "notIn" | "contains" | "notContains" | "containsi"
    | "notContainsi" | "null" | "notNull" | "between"
    | "startsWith" | "startsWithi" | "endsWith" | "endsWithi"
    | "or" | "and" | "not",
  value: string,
}

export type AnimalKind = {
  name: string,
  namePlural: string,
  icon: StrapiMedia,
  article?: ArticleSection[],
}

export type Animal = {
  id: number,
  documentId: string,
  updatedAt: string,
  publishedAt: string,
  name: string,
  race?: string,
  gender: "male" | "female" | "other";
  thumbnail?: StrapiMedia | null,
  description: string,
  paten: string,
  emergency?: boolean,
  whereInGermany?: string,
  castrated?: boolean | null,
  shoulderHeightCm?: number,
  weightKg?: number | null,
  animalKind?: AnimalKind | null,
  birthday?: string | null,
  diseases?: string | null,
  tolerating?: string | null,
  suitedFor?: string | null,
  priority: number,
  status: AnimalStatusName;
  freeRoamer?: boolean,
  animal_article?: {
    updatedAt: string,
  }
}

export type AnimalStatusName = "in-spaichingen" | "in-rumänien" | "vermittlungshilfe" | "zuhause-gefunden" | "vermisst" | "fundtier";

