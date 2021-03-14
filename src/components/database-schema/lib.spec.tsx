import dvdRentalsOpenApiResponse from './responses/rawDvdRentalsResponse.json';
import unauthenticatedResponse from './responses/rawUnauthenticatedResponse.json';

import { parseDatabaseSchema } from './lib';
import { IPostgRESTBaseUrlResponse } from './typings';


describe('tests to parse raw schema to what PostGUI wants', () => {
  it('it parses null correctly ', () => {
    expect(parseDatabaseSchema(null)).toEqual({})
  })
  it('it parses null definitions correctly ', () => {
    expect(parseDatabaseSchema({definitions: null})).toEqual({})
  })
  it('it parses unauthenticated response correctly ', () => {
    expect(
      parseDatabaseSchema(unauthenticatedResponse as IPostgRESTBaseUrlResponse)
    ).toEqual({})
  })

  it('it parses DVD rentals response correctly ', () => {
    expect(
      parseDatabaseSchema(
        (dvdRentalsOpenApiResponse as unknown) as IPostgRESTBaseUrlResponse
      )
    ).toEqual(dvdRentalParsedSchema)
  })
})

export const dvdRentalParsedSchema = {
  actor: {
    actor_id: {isPrimaryKey: true, type: 'integer'},
    first_name: {isPrimaryKey: false, type: 'string'},
    last_name: {isPrimaryKey: false, type: 'string'},
    last_update: {isPrimaryKey: false, type: 'string'}
  },
  actor_info: {
    actor_id: {isPrimaryKey: false, type: 'integer'},
    first_name: {isPrimaryKey: false, type: 'string'},
    last_name: {isPrimaryKey: false, type: 'string'},
    film_info: {isPrimaryKey: false, type: 'string'}
  },
  address: {
    address_id: {isPrimaryKey: true, type: 'integer'},
    address: {isPrimaryKey: false, type: 'string'},
    address2: {isPrimaryKey: false, type: 'string'},
    district: {isPrimaryKey: false, type: 'string'},
    city_id: {
      isPrimaryKey: false,
      type: 'integer',
      foreignKeyTo: {table: 'city', column: 'city_id'}
    },
    postal_code: {isPrimaryKey: false, type: 'string'},
    phone: {isPrimaryKey: false, type: 'string'},
    last_update: {isPrimaryKey: false, type: 'string'}
  },
  category: {
    category_id: {isPrimaryKey: true, type: 'integer'},
    name: {isPrimaryKey: false, type: 'string'},
    last_update: {isPrimaryKey: false, type: 'string'}
  },
  change_log: {
    p_id: {isPrimaryKey: true, type: 'integer'},
    change_timestamp: {isPrimaryKey: false, type: 'string'},
    table_changed: {isPrimaryKey: false, type: 'string'},
    primary_key_of_changed_row: {isPrimaryKey: false, type: 'string'},
    column_changed: {isPrimaryKey: false, type: 'string'},
    old_value: {isPrimaryKey: false, type: 'string'},
    new_value: {isPrimaryKey: false, type: 'string'},
    notes: {isPrimaryKey: false, type: 'string'},
    user_name: {isPrimaryKey: false, type: 'string'}
  },
  city: {
    city_id: {isPrimaryKey: true, type: 'integer'},
    city: {isPrimaryKey: false, type: 'string'},
    country_id: {
      isPrimaryKey: false,
      type: 'integer',
      foreignKeyTo: {table: 'country', column: 'country_id'}
    },
    last_update: {isPrimaryKey: false, type: 'string'}
  },
  country: {
    country_id: {isPrimaryKey: true, type: 'integer'},
    country: {isPrimaryKey: false, type: 'string'},
    last_update: {isPrimaryKey: false, type: 'string'}
  },
  customer: {
    customer_id: {isPrimaryKey: true, type: 'integer'},
    store_id: {isPrimaryKey: false, type: 'integer'},
    first_name: {isPrimaryKey: false, type: 'string'},
    last_name: {isPrimaryKey: false, type: 'string'},
    email: {isPrimaryKey: false, type: 'string'},
    address_id: {
      isPrimaryKey: false,
      type: 'integer',
      foreignKeyTo: {table: 'address', column: 'address_id'}
    },
    activebool: {isPrimaryKey: false, type: 'boolean'},
    create_date: {isPrimaryKey: false, type: 'string'},
    last_update: {isPrimaryKey: false, type: 'string'},
    active: {isPrimaryKey: false, type: 'integer'}
  },
  customer_list: {
    id: {isPrimaryKey: true, type: 'integer'},
    name: {isPrimaryKey: false, type: 'string'},
    address: {isPrimaryKey: false, type: 'string'},
    'zip code': {isPrimaryKey: false, type: 'string'},
    phone: {isPrimaryKey: false, type: 'string'},
    city: {isPrimaryKey: false, type: 'string'},
    country: {isPrimaryKey: false, type: 'string'},
    notes: {isPrimaryKey: false, type: 'string'},
    sid: {isPrimaryKey: false, type: 'integer'}
  },
  film: {
    film_id: {isPrimaryKey: true, type: 'integer'},
    title: {isPrimaryKey: false, type: 'string'},
    description: {isPrimaryKey: false, type: 'string'},
    release_year: {isPrimaryKey: false, type: 'integer'},
    language_id: {
      isPrimaryKey: false,
      type: 'integer',
      foreignKeyTo: {table: 'language', column: 'language_id'}
    },
    rental_duration: {isPrimaryKey: false, type: 'integer'},
    rental_rate: {isPrimaryKey: false, type: 'number'},
    length: {isPrimaryKey: false, type: 'integer'},
    replacement_cost: {isPrimaryKey: false, type: 'number'},
    rating: {isPrimaryKey: false, type: 'string'},
    last_update: {isPrimaryKey: false, type: 'string'},
    special_features: {isPrimaryKey: false, type: 'string'},
    fulltext: {isPrimaryKey: false, type: 'string'}
  },
  film_actor: {
    actor_id: {
      isPrimaryKey: true,
      type: 'integer',
      foreignKeyTo: {table: 'actor', column: 'actor_id'}
    },
    film_id: {
      isPrimaryKey: true,
      type: 'integer',
      foreignKeyTo: {table: 'film', column: 'film_id'}
    },
    last_update: {isPrimaryKey: false, type: 'string'}
  },
  film_category: {
    film_id: {
      isPrimaryKey: true,
      type: 'integer',
      foreignKeyTo: {table: 'film', column: 'film_id'}
    },
    category_id: {
      isPrimaryKey: true,
      type: 'integer',
      foreignKeyTo: {table: 'category', column: 'category_id'}
    },
    last_update: {isPrimaryKey: false, type: 'string'}
  },
  film_list: {
    fid: {isPrimaryKey: true, type: 'integer'},
    title: {isPrimaryKey: false, type: 'string'},
    description: {isPrimaryKey: false, type: 'string'},
    category: {isPrimaryKey: false, type: 'string'},
    price: {isPrimaryKey: false, type: 'number'},
    length: {isPrimaryKey: false, type: 'integer'},
    rating: {isPrimaryKey: false, type: 'string'},
    actors: {isPrimaryKey: false, type: 'string'}
  },
  inventory: {
    inventory_id: {isPrimaryKey: true, type: 'integer'},
    film_id: {
      isPrimaryKey: false,
      type: 'integer',
      foreignKeyTo: {table: 'film', column: 'film_id'}
    },
    store_id: {isPrimaryKey: false, type: 'integer'},
    last_update: {isPrimaryKey: false, type: 'string'}
  },
  language: {
    language_id: {isPrimaryKey: true, type: 'integer'},
    name: {isPrimaryKey: false, type: 'string'},
    last_update: {isPrimaryKey: false, type: 'string'}
  },
  nicer_but_slower_film_list: {
    fid: {isPrimaryKey: true, type: 'integer'},
    title: {isPrimaryKey: false, type: 'string'},
    description: {isPrimaryKey: false, type: 'string'},
    category: {isPrimaryKey: false, type: 'string'},
    price: {isPrimaryKey: false, type: 'number'},
    length: {isPrimaryKey: false, type: 'integer'},
    rating: {isPrimaryKey: false, type: 'string'},
    actors: {isPrimaryKey: false, type: 'string'}
  },
  payment: {
    payment_id: {isPrimaryKey: true, type: 'integer'},
    customer_id: {
      isPrimaryKey: false,
      type: 'integer',
      foreignKeyTo: {table: 'customer', column: 'customer_id'}
    },
    staff_id: {
      isPrimaryKey: false,
      type: 'integer',
      foreignKeyTo: {table: 'staff', column: 'staff_id'}
    },
    rental_id: {
      isPrimaryKey: false,
      type: 'integer',
      foreignKeyTo: {table: 'rental', column: 'rental_id'}
    },
    amount: {isPrimaryKey: false, type: 'number'},
    payment_date: {isPrimaryKey: false, type: 'string'}
  },
  rental: {
    rental_id: {isPrimaryKey: true, type: 'integer'},
    rental_date: {isPrimaryKey: false, type: 'string'},
    inventory_id: {
      isPrimaryKey: false,
      type: 'integer',
      foreignKeyTo: {table: 'inventory', column: 'inventory_id'}
    },
    customer_id: {
      isPrimaryKey: false,
      type: 'integer',
      foreignKeyTo: {table: 'customer', column: 'customer_id'}
    },
    return_date: {isPrimaryKey: false, type: 'string'},
    staff_id: {
      isPrimaryKey: false,
      type: 'integer',
      foreignKeyTo: {table: 'staff', column: 'staff_id'}
    },
    last_update: {isPrimaryKey: false, type: 'string'}
  },
  sales_by_film_category: {
    category: {isPrimaryKey: false, type: 'string'},
    total_sales: {isPrimaryKey: false, type: 'number'}
  },
  sales_by_store: {
    store: {isPrimaryKey: false, type: 'string'},
    manager: {isPrimaryKey: false, type: 'string'},
    total_sales: {isPrimaryKey: false, type: 'number'}
  },
  staff: {
    staff_id: {isPrimaryKey: true, type: 'integer'},
    first_name: {isPrimaryKey: false, type: 'string'},
    last_name: {isPrimaryKey: false, type: 'string'},
    address_id: {
      isPrimaryKey: false,
      type: 'integer',
      foreignKeyTo: {table: 'address', column: 'address_id'}
    },
    email: {isPrimaryKey: false, type: 'string'},
    store_id: {isPrimaryKey: false, type: 'integer'},
    active: {isPrimaryKey: false, type: 'boolean'},
    username: {isPrimaryKey: false, type: 'string'},
    password: {isPrimaryKey: false, type: 'string'},
    last_update: {isPrimaryKey: false, type: 'string'},
    picture: {isPrimaryKey: false, type: 'string'}
  },
  staff_list: {
    id: {isPrimaryKey: true, type: 'integer'},
    name: {isPrimaryKey: false, type: 'string'},
    address: {isPrimaryKey: false, type: 'string'},
    'zip code': {isPrimaryKey: false, type: 'string'},
    phone: {isPrimaryKey: false, type: 'string'},
    city: {isPrimaryKey: false, type: 'string'},
    country: {isPrimaryKey: false, type: 'string'},
    sid: {isPrimaryKey: false, type: 'integer'}
  },
  store: {
    store_id: {isPrimaryKey: true, type: 'integer'},
    manager_staff_id: {
      isPrimaryKey: false,
      type: 'integer',
      foreignKeyTo: {table: 'staff', column: 'staff_id'}
    },
    address_id: {
      isPrimaryKey: false,
      type: 'integer',
      foreignKeyTo: {table: 'address', column: 'address_id'}
    },
    last_update: {isPrimaryKey: false, type: 'string'}
  }
}
