// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {expect, describe, test} from '@jest/globals';

import {
  fromSheetsToD3Format,
  fromSheetsToD3FormatOriginal,
  getCurrencySymbol,
  getGroupingSymbol,
  getFormatSpan,
  getFormatSuffix,
} from './currency_formatter';

describe('fromSheetsToD3Format', () => {
  test('should sanitize the format correctly', () => {
    const matches = [
      ['$#,##0%', '$,.0%'],
      ['$#,#0%', '$,.0%'],
      ['$##0%', '$.0%'],
      ['$#,##.##0%', '$,.4%'],
    ];
    for (const [from, to] of matches) {
      expect(fromSheetsToD3FormatOriginal(from)).toBe(to);
      expect(fromSheetsToD3Format(from)).toBe(to);
    }
  });

  test('should return empty string when no value format provided unlike original implementation', () => {
    expect(fromSheetsToD3FormatOriginal('')).toBe(undefined);
    expect(fromSheetsToD3Format('')).toBe('');
  });
});

describe('getCurrencySymbol', () => {
  test('should obtain the correct currency symbol', () => {
    expect(getCurrencySymbol('$#.#%')).toBe('$');
    expect(getCurrencySymbol('£#.#%')).toBe('£');
    expect(getCurrencySymbol('€#.#%')).toBe('€');
    expect(getCurrencySymbol('#.#%')).toBe('');
  });
});

describe('getFormatSpan', () => {
  test('should obtain the span of the format if available', () => {
    expect(getFormatSpan('$#.#%')).toBe(2);
    expect(getFormatSpan('$#.#%')).toBe(2);
    expect(getFormatSpan('$.#%')).toBe(2);
    expect(getFormatSpan('$.')).toBe(0);
  });
});

describe('getFormatSuffix', () => {
  test('should obtain the correct formatting suffix', () => {
    expect(getFormatSuffix('$#.#%')).toBe('%');
    expect(getFormatSuffix('£#.#%')).toBe('%');
    expect(getFormatSuffix('€#.#0')).toBe('f');
    expect(getFormatSuffix('€#.#f')).toBe('');
    expect(getFormatSuffix('#.#')).toBe('');
  });
});

describe('getGroupingSymbol', () => {
  test('should obtain the grouping delimiter', () => {
    expect(getGroupingSymbol('$#,#.#%')).toBe(',');
    expect(getGroupingSymbol('$#,#.#%', ',', '/')).toBe(',');
    expect(getGroupingSymbol('$##.#%', ',', '/')).toBe('/');
    expect(getGroupingSymbol('$#.#%')).toBe('');
  });
});
