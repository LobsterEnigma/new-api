/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, render, screen, within } from '@testing-library/react'
import { expect, it, vi } from 'vitest'

import { api } from '@/lib/api'
import {
  DEFAULT_CURRENCY_CONFIG,
  useSystemConfigStore,
} from '@/stores/system-config-store'

import { SubscriptionsMutateDrawer } from '../subscriptions-mutate-drawer'
import { SubscriptionsProvider } from '../subscriptions-provider'

it('labels the price and quota fields with the active display currency', async () => {
  const { config, setConfig } = useSystemConfigStore.getState()
  vi.spyOn(api, 'get').mockResolvedValue({ data: { success: true, data: [] } })

  setConfig({
    currency: { ...DEFAULT_CURRENCY_CONFIG, quotaDisplayType: 'CNY' },
  })
  const client = new QueryClient()
  const editor = render(
    <QueryClientProvider client={client}>
      <SubscriptionsProvider>
        <SubscriptionsMutateDrawer open onOpenChange={vi.fn()} />
      </SubscriptionsProvider>
    </QueryClientProvider>
  )

  try {
    const dialog = within(await screen.findByRole('dialog'))
    expect(
      dialog.getByRole('spinbutton', { name: 'Plan Price (CNY)' })
    ).toBeVisible()
    expect(
      dialog.getByRole('spinbutton', { name: 'Quota (CNY)' })
    ).toBeVisible()
    expect(dialog.queryByLabelText('Pricing currency')).toBeNull()

    act(() => setConfig({ currency: DEFAULT_CURRENCY_CONFIG }))

    expect(
      dialog.getByRole('spinbutton', { name: 'Plan Price (USD)' })
    ).toBeVisible()
    expect(
      dialog.getByRole('spinbutton', { name: 'Quota (USD)' })
    ).toBeVisible()
  } finally {
    editor.unmount()
    client.clear()
    setConfig(config)
  }
})
