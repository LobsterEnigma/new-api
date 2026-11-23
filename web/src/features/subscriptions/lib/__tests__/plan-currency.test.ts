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
import { formatLocalCurrencyAmount } from '@/lib/currency'
import { DEFAULT_CURRENCY_CONFIG } from '@/stores/system-config-store'

const currency = {
  ...DEFAULT_CURRENCY_CONFIG,
  quotaDisplayType: 'CNY' as const,
  usdExchangeRate: 7,
}

it.each([
  ['zhCN', '¥199'],
  ['zhTW', '¥199'],
  ['en', '¥199'],
  ['fr', '199 ¥'],
  ['ja', '￥199'],
  ['ru', '199 ¥'],
  ['vi', '199 ¥'],
])(
  'formats the configured price in %s without applying the exchange rate',
  (language, price) => {
    expect(
      formatLocalCurrencyAmount(
        199,
        { locale: toIntlLocale(language) },
        currency
      ).replaceAll(/\s/g, ' ')
    ).toBe(price)
  }
)

it('uses the runtime locale when the interface language is invalid', () => {
  expect(
    formatLocalCurrencyAmount(
      199,
      { locale: toIntlLocale('invalid_locale') },
      currency
    )
  ).toContain('199')
})
