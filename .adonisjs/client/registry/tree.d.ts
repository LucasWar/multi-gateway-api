/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    login: typeof routes['auth.login']
  }
  transactions: {
    store: typeof routes['transactions.store']
    index: typeof routes['transactions.index']
    findUnique: typeof routes['transactions.find_unique']
    refund: typeof routes['transactions.refund']
  }
  products: {
    index: typeof routes['products.index']
    store: typeof routes['products.store']
    show: typeof routes['products.show']
    update: typeof routes['products.update']
    destroy: typeof routes['products.destroy']
  }
  users: {
    index: typeof routes['users.index']
    store: typeof routes['users.store']
    show: typeof routes['users.show']
    update: typeof routes['users.update']
    destroy: typeof routes['users.destroy']
  }
  gateways: {
    index: typeof routes['gateways.index']
    updateStatus: typeof routes['gateways.update_status']
    updatePriority: typeof routes['gateways.update_priority']
  }
  clients: {
    index: typeof routes['clients.index']
    findUnique: typeof routes['clients.find_unique']
  }
}
