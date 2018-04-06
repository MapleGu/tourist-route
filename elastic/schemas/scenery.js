module.exports = {
  mappings: {
    fulltext: {
      properties: {
        name: {
          type: 'keyword'
        },
        price: {
          type: 'text'
        },
        genre: {
          type: 'keyword'
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
        },
        times: {
          type: 'integer'
        }
      }
    }
  }
}
