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
import { expect, it } from 'vitest'

import { toIntlLocale } from '@/i18n/languages'

import { subscriptionPlanSchema } from '../../types'
import { formatSubscriptionPrice } from '../format'
import {
  formValuesToPlanPayload,
  PLAN_FORM_DEFAULTS,
  planToFormValues,
} from '../plan-form'

it.each(['CNY', 'USD', 'EUR'])(
  'saves and restores %s without converting the plan price',
  (currency) => {
    const { plan } = formValuesToPlanPayload({
      ...PLAN_FORM_DEFAULTS,
      price_amount: 199.9,
      currency,
    })

    expect(plan).toMatchObject({ currency, price_amount: 199.9 })
    expect(
      planToFormValues(subscriptionPlanSchema.parse({ ...plan, id: 1 }))
    ).toMatchObject({
      currency,
      price_amount: 199.9,
    })
  }
)

it.each([
  ['zhCN', '¥199.90'],
  ['zhTW', 'CN¥199.90'],
  ['en', 'CN¥199.90'],
  ['fr', '199,90 CNY'],
  ['ja', '元 199.90'],
  ['ru', '199,90 CN¥'],
  ['vi', '199,90 CN¥'],
])('formats the plan currency for %s', (language, price) => {
  expect(
    formatSubscriptionPrice(
      { price_amount: 199.9, currency: 'CNY' },
      toIntlLocale(language)
    ).replaceAll(/\s/g, ' ')
  ).toBe(price)
})

it('falls back to USD for a missing legacy currency and accepts an invalid locale', () => {
  expect(
    formatSubscriptionPrice(
      { price_amount: 199.9, currency: '' },
      toIntlLocale('invalid_locale')
    )
  ).toMatch(/199[.,]90/)
})
