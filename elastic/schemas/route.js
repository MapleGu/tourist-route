module.exports = {
  index: 'routes',
  body: {
    mappings: {
      fulltext: {
        properties: {
          weight: { type: 'integer' },
          routeVar: {
            type: 'text',
            analyzer: 'ik_max_word',
            search_analyzer: 'ik_max_word'
          },
          routes: {
            type: 'nested',
            properties: {
              name: {
                type: 'text',
                analyzer: 'ik_max_word',
                search_analyzer: 'ik_max_word'
              }
            }
          }
        }
      }
    }
  }
}
