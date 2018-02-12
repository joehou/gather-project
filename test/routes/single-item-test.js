const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your test blocks below:
  describe('GET',() => {
    it('renders single created item', async()=>{
      const title = 'My favorite item';
      const imageUrl = 'http://placebear.com/g/200/300';
      const description = 'Just the best item';
      const createdItem = await seedItemToDatabase({title: title,imageUrl:imageUrl,description:description})

      const response = await request(app)
        .get('/items/'+createdItem._id)

      assert.include(parseTextFromHTML(response.text,'body'),title)

    })
  })
  
});
