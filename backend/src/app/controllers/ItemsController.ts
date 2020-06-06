import { Request, Response } from 'express';
import knex from '../../database/connection';

interface Item {
  id: number,
  title: string,
  image: string,
}

export default new class ItemsController {
  async getItems(req: Request, res: Response) {
    const items = await knex('items').select('*');

    const serializedItems = items.map((item: Item) => ({
      id: item.id,
      title: item.title,
      image_url: `http://192.168.2.8:3333/uploads/${item.image}`,
    }));

    return res.json(serializedItems);
  }
}
