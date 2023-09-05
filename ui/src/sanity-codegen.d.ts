/// <reference types="@sanity-codegen/types" />

namespace Sanity.Default.Client {
  type Config = {}
}
namespace Sanity.Default.Schema {
  type Attendance =
    | {
        isHost?: boolean
        member?: Sanity.Reference<Sanity.Ref.Ref_yqiLkPYu6IGHbjp8>
        note?: string
      }
    | undefined
}
namespace Sanity.Default.Schema {
  type Gathering =
    | {
        _id: string
        _type: 'gathering'
        leader?: Sanity.Reference<Sanity.Ref.Ref_yqiLkPYu6IGHbjp8>
        location?: string
        name?: string
        occurrences?: Sanity.Ref.Ref_uAXBEuKor4sZsff9[]
        organization?: Sanity.Reference<Sanity.Ref.Ref_VzYYxAYv8E3qJjML>
        recurrence?: string
        slug?: {
          _type: 'slug'
          current?: string
          source?: string
        }
        title?: string
      }
    | undefined
}
namespace Sanity.Default.Schema {
  type Geopoint =
    | {
        alt?: number
        lat?: number
        lng?: number
      }
    | undefined
}
namespace Sanity.Default.Schema {
  type Member =
    | {
        _id: string
        _type: 'member'
        alias?: string
        email?: string
        gatherings?: Sanity.Reference<Sanity.Ref.Ref_TYuyqD54DdltT00Z>[]
        name?: string
        organization?: Sanity.Reference<Sanity.Ref.Ref_VzYYxAYv8E3qJjML>
      }
    | undefined
}
namespace Sanity.Default.Schema {
  type Occurrence =
    | {
        _id: string
        _type: 'occurrence'
        attendances?: Sanity.Ref.Ref_cHNbwVnil5UYntba[]
        date?: string
        host?: Sanity.Reference<Sanity.Ref.Ref_yqiLkPYu6IGHbjp8>
      }
    | undefined
}
namespace Sanity.Default.Schema {
  type Organization =
    | {
        _id: string
        _type: 'organization'
        email?: string
        name?: string
        slug?: {
          _type: 'slug'
          current?: string
          source?: string
        }
        title?: string
      }
    | undefined
}
namespace Sanity.Default.Schema {
  type SanityAssetSourceData =
    | {
        id?: string
        name?: string
        url?: string
      }
    | undefined
}
namespace Sanity.Default.Schema {
  type SanityFileAsset =
    | {
        _id: string
        _type: 'sanity.fileAsset'
        altText?: string
        assetId?: string
        description?: string
        extension?: string
        label?: string
        mimeType?: string
        originalFilename?: string
        path?: string
        sha1hash?: string
        size?: number
        source?: Sanity.Ref.Ref_cyxua9FisHxmYj7K
        title?: string
        url?: string
      }
    | undefined
}
namespace Sanity.Default.Schema {
  type SanityImageAsset =
    | {
        _id: string
        _type: 'sanity.imageAsset'
        altText?: string
        assetId?: string
        description?: string
        extension?: string
        label?: string
        metadata?: Sanity.Ref.Ref_N5EV4nraF1zx1K7G
        mimeType?: string
        originalFilename?: string
        path?: string
        sha1hash?: string
        size?: number
        source?: Sanity.Ref.Ref_cyxua9FisHxmYj7K
        title?: string
        uploadId?: string
        url?: string
      }
    | undefined
}
namespace Sanity.Default.Schema {
  type SanityImageCrop =
    | {
        bottom?: number
        left?: number
        right?: number
        top?: number
      }
    | undefined
}
namespace Sanity.Default.Schema {
  type SanityImageDimensions =
    | {
        aspectRatio?: number
        height?: number
        width?: number
      }
    | undefined
}
namespace Sanity.Default.Schema {
  type SanityImageHotspot =
    | {
        height?: number
        width?: number
        x?: number
        y?: number
      }
    | undefined
}
namespace Sanity.Default.Schema {
  type SanityImageMetadata =
    | {
        blurHash?: string
        dimensions?: Sanity.Ref.Ref_gNSrEf6ab5I2JcI9
        hasAlpha?: boolean
        isOpaque?: boolean
        location?: {
          _type: 'geopoint'
          alt: number
          lat: number
          lng: number
        }
        lqip?: string
        palette?: Sanity.Ref.Ref_h6UDIpIgRy7jvayo
      }
    | undefined
}
namespace Sanity.Default.Schema {
  type SanityImagePalette =
    | {
        darkMuted?: Sanity.Ref.Ref_DK7EvF0O4Jkwcho8
        darkVibrant?: Sanity.Ref.Ref_DK7EvF0O4Jkwcho8
        dominant?: Sanity.Ref.Ref_DK7EvF0O4Jkwcho8
        lightMuted?: Sanity.Ref.Ref_DK7EvF0O4Jkwcho8
        lightVibrant?: Sanity.Ref.Ref_DK7EvF0O4Jkwcho8
        muted?: Sanity.Ref.Ref_DK7EvF0O4Jkwcho8
        vibrant?: Sanity.Ref.Ref_DK7EvF0O4Jkwcho8
      }
    | undefined
}
namespace Sanity.Default.Schema {
  type SanityImagePaletteSwatch =
    | {
        background?: string
        foreground?: string
        population?: number
        title?: string
      }
    | undefined
}
namespace Sanity.Default.Schema {
  type Slug =
    | {
        current?: string
        source?: string
      }
    | undefined
}
namespace Sanity.Ref {
  type Ref_cHNbwVnil5UYntba = {
    isHost?: boolean
    member?: Sanity.Reference<Sanity.Ref.Ref_yqiLkPYu6IGHbjp8>
    note?: string
  }
}
namespace Sanity.Ref {
  type Ref_cyxua9FisHxmYj7K = {
    id?: string
    name?: string
    url?: string
  }
}
namespace Sanity.Ref {
  type Ref_DK7EvF0O4Jkwcho8 = {
    background?: string
    foreground?: string
    population?: number
    title?: string
  }
}
namespace Sanity.Ref {
  type Ref_gNSrEf6ab5I2JcI9 = {
    aspectRatio?: number
    height?: number
    width?: number
  }
}
namespace Sanity.Ref {
  type Ref_h6UDIpIgRy7jvayo = {
    darkMuted?: Sanity.Ref.Ref_DK7EvF0O4Jkwcho8
    darkVibrant?: Sanity.Ref.Ref_DK7EvF0O4Jkwcho8
    dominant?: Sanity.Ref.Ref_DK7EvF0O4Jkwcho8
    lightMuted?: Sanity.Ref.Ref_DK7EvF0O4Jkwcho8
    lightVibrant?: Sanity.Ref.Ref_DK7EvF0O4Jkwcho8
    muted?: Sanity.Ref.Ref_DK7EvF0O4Jkwcho8
    vibrant?: Sanity.Ref.Ref_DK7EvF0O4Jkwcho8
  }
}
namespace Sanity.Ref {
  type Ref_N5EV4nraF1zx1K7G = {
    blurHash?: string
    dimensions?: Sanity.Ref.Ref_gNSrEf6ab5I2JcI9
    hasAlpha?: boolean
    isOpaque?: boolean
    location?: {
      _type: 'geopoint'
      alt: number
      lat: number
      lng: number
    }
    lqip?: string
    palette?: Sanity.Ref.Ref_h6UDIpIgRy7jvayo
  }
}
namespace Sanity.Ref {
  type Ref_TYuyqD54DdltT00Z =
    | {
        _id: string
        _type: 'gathering'
        leader?: Sanity.Reference<Sanity.Ref.Ref_yqiLkPYu6IGHbjp8>
        location?: string
        name?: string
        occurrences?: Sanity.Ref.Ref_uAXBEuKor4sZsff9[]
        organization?: Sanity.Reference<Sanity.Ref.Ref_VzYYxAYv8E3qJjML>
        recurrence?: string
        slug?: {
          _type: 'slug'
          current?: string
          source?: string
        }
        title?: string
      }
    | undefined
}
namespace Sanity.Ref {
  type Ref_uAXBEuKor4sZsff9 = {
    _id: string
    _type: 'occurrence'
    attendances?: Sanity.Ref.Ref_cHNbwVnil5UYntba[]
    date?: string
    host?: Sanity.Reference<Sanity.Ref.Ref_yqiLkPYu6IGHbjp8>
  }
}
namespace Sanity.Ref {
  type Ref_VzYYxAYv8E3qJjML =
    | {
        _id: string
        _type: 'organization'
        email?: string
        name?: string
        slug?: {
          _type: 'slug'
          current?: string
          source?: string
        }
        title?: string
      }
    | undefined
}
namespace Sanity.Ref {
  type Ref_yqiLkPYu6IGHbjp8 =
    | {
        _id: string
        _type: 'member'
        alias?: string
        email?: string
        gatherings?: Sanity.Reference<Sanity.Ref.Ref_TYuyqD54DdltT00Z>[]
        name?: string
        organization?: Sanity.Reference<Sanity.Ref.Ref_VzYYxAYv8E3qJjML>
      }
    | undefined
}
