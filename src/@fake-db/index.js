import './db/product-db';
import './db/auth-db';
import './db/contacts-db';
import './db/users-db';
import './db/servicers-db';
import './db/file-manager-db';
import mock from './mock';

mock.onAny().passThrough();
