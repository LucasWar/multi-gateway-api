/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  transactions: {
    store: typeof routes['transactions.store']
    index: typeof routes['transactions.index']
  }
  auth: {
    login: typeof routes['auth.login']
  }
  users: {
    index: typeof routes['users.index']
    store: typeof routes['users.store']
  }
  products: {
    index: typeof routes['products.index']
    store: typeof routes['products.store']
    show: typeof routes['products.show']
    update: typeof routes['products.update']
    destroy: typeof routes['products.destroy']
  }
  gateways: {
    index: typeof routes['gateways.index']
    updateStatus: typeof routes['gateways.update_status']
    updatePriority: typeof routes['gateways.update_priority']
  }
}
