module.exports = {
  mappings: {
    fulltext: {
      properties: {
        name: {
          type: 'text',
          analyzer: 'ik_max_word',
          search_analyzer: 'ik_max_word'
        },
        price: {
          type: 'text'
        },
        genre: {
          type: 'text'
        },
        timeSpan: {
          type: 'integer'
        },
        place: {
          type: 'text',
          analyzer: 'ik_max_word',
          search_analyzer: 'ik_max_word'
        },
        openTime: {
          type: 'text',
          analyzer: 'ik_max_word',
          search_analyzer: 'ik_max_word'
        },
        location: {
          type: 'geo_point'
        },
        areaID: {
          type: 'integer'
        },
        introduce: {
          type: 'text',
          analyzer: 'ik_max_word',
          search_analyzer: 'ik_max_word'
        }
      }
    }
  }
}
