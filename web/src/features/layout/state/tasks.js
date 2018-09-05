import { task } from '../../../libs'
import { GRID_SIZES } from '../ctx'

export const screenSizeName = task(
  t => screenWidth => {
    const sizePairs = t.reverse(t.toPairs(GRID_SIZES))
    const foundSize = t.find(
      size => {
        const value = t.head(t.tail(size))
        return t.gte(screenWidth, value)
      },
      sizePairs,
    )
    if (foundSize) {
      return t.caseTo.lowerCase(t.head(foundSize))
    }
    return 'xs'
  },
)

export const isPathInTopSchema = task(
  t => (path, schema) => t.gt(
    t.findIndex(
      schemaItem => t.eq(schemaItem.path, path),
      schema || [],
    ),
    -1,
  ),
)

export const topSchemaWithoutPath = task(
  t => (pathOrPaths, schema) => t.isType(pathOrPaths, 'Array')
    ? t.filter(
      schemaItem => t.eq(
        t.findIndex(
          path => t.eq(path, schemaItem.path),
          pathOrPaths,
        ),
        -1,
      ),
      schema || [],
    )
    : t.filter(
      schemaItem => t.not(t.eq(schemaItem.path, pathOrPaths)),
      schema || [],
    ),
)

export const updateSchemaInPlace = task(
  t => (nextSchema, schema) => {
    const nextIndexed = t.map(
      schemaItem => (
        {
          index: t.findIndex(
            item => t.eq(item.path, schemaItem.path),
            schema || [],
          ),
          item: schemaItem,
        }
      ),
      nextSchema || [],
    )
    return t.mapIndexed((item, index) => {
      const found = t.find(
        indexedItem => t.eq(indexedItem.index, index),
        nextIndexed,
      )
      return t.not(found)
        ? item
        : found.item
    }, schema || [])
  },
)