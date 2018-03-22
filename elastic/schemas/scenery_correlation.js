module.exports = {
  index: 'scenery_correlation',
  body: {
    mappings: {
      fulltext: {
        properties: {
          weight: { type: 'integer' },
          source: {
            type: 'text',
            analyzer: 'ik_max_word',
            search_analyzer: 'ik_max_word'
          },
          target: {
            type: 'text',
            analyzer: 'ik_max_word',
            search_analyzer: 'ik_max_word'
          }
        }
      }
    }
  }
}
