const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Item = require('../../models/item');

const {parseTextFromHTML, buildItemObject} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

const findImageElementBySource = (htmlAsString, src) => {
  const image = jsdom(htmlAsString).querySelector(`img[src="${src}"]`);
  if (image !== null) {
    return image;
  } else {
    throw new Error(`Image with src "${src}" not found in HTML string`);
  }
};

describe('Server path: /items/create', () => {
  const itemToCreate = buildItemObject();

  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your describe blocks below:
  describe("GET", ()=>{
    it("Renders empty input fields",async ()=>{
      const response = await request(app)
                                .get('/items/create')

      assert.equal(parseTextFromHTML(response.text, 'input#title-input'), '');
      assert.equal(parseTextFromHTML(response.text, '#description-input'), '');
      assert.equal(parseTextFromHTML(response.text, '#imageUrl-input'), '');
    })
  })

  describe("POST",()=>{
    it("Creates a new item and then creates it",async()=>{
      const item=buildItemObject()
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(item);

      const createdItem = await Item.findOne()

      assert.isNotNull(createdItem, 'item was not created in DB')
      // Replaced with model test because thisoverlaps with feature test
      // assert.include(parseTextFromHTML(response.text, '.item-title'), item.title);
      // const imageElement = findImageElementBySource(response.text, item.imageUrl);
      // assert.equal(imageElement.src, item.imageUrl);


    })
    it ('After post the route redirects to /', async()=>{
      const item=buildItemObject()
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(item);

      assert.equal(response.statusCode,302)
      assert.equal(response.headers.location,'/')
    })
    it('Displays an error message when an /items/create request with no title is posted',async()=>{
      const imageUrl = 'http://placebear.com/g/200/300';
      const description = 'Just the best item';
      const item = {imageUrl, description};

      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(item)

      const allItems = await Item.find({})
      assert.equal(allItems.length,0)
      assert.equal(response.statusCode,400)
      assert.include(response.text,'required')
    })

    it('Displays an error message when an /items/create request with no image is posted',async()=>{
      const title = 'Heres a title for you'
      const description = 'Just the best item';
      const item = {title, description};

      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(item)

      const allItems = await Item.find({})
      assert.equal(allItems.length,0)
      assert.equal(response.statusCode,400)
      assert.include(response.text,'required')
    })

    it('Displays an error message when an /items/create request with no description is posted',async()=>{
      const title = 'Heres a title for you'
      const imageUrl = 'http://placebear.com/g/200/300';
      const item = {title, imageUrl};

      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(item)

      const allItems = await Item.find({})
      assert.equal(allItems.length,0)
      assert.equal(response.statusCode,400)
      assert.include(response.text,'required')
    })
  })

});
