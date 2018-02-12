const Item = require('../../models/item');
const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');

describe('Model: Item', () => {
  beforeEach(async () => {
    await mongoose.connect(databaseUrl, options);
    await mongoose.connection.db.dropDatabase();
  });

  afterEach(async () => {
    await mongoose.disconnect();
  });

  // Write your tests below:
  describe('#title',() => {
    it('Should be a string', () =>{
      const number=5

      const imageUrl = 'http://placebear.com/g/200/300';
      const description = 'Just the best item';
      const item = new Item( {title: number, imageUrl, description})

      assert.strictEqual(item.title,number.toString())
    })
    it('is required', () => {
      const imageUrl = 'http://placebear.com/g/200/300';
      const description = 'Just the best item';
      const item = new Item( {title:'',imageUrl, description})

      item.validateSync()

      assert(item.errors.title.message,'Path `title` is required.')

    })

  })

  describe('#imageUrl',() =>{
    it('Should be a string',() =>{
      const number=3
      const item = new Item( {imageUrl:number})

      assert.strictEqual(item.imageUrl, number.toString())
    })
    it('is required', () =>{
      const item= new Item({})

      item.validateSync()

      assert(item.errors.imageUrl.message, 'Path `imageUrl` is required.')
    })
  })

  describe('#description',() =>{
    it('Should be a string',() =>{
      const number=3
      const item = new Item( {description:number})

      assert.strictEqual(item.description, number.toString())
    })
    it('is required', () =>{
      const item= new Item({})

      item.validateSync()

      assert(item.errors.description.message, 'Path `description` is required.')
    })
  })
});
