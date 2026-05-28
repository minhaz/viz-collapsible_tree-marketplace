// Copyright 2020 Google LLC
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

import {format} from 'd3';

import {VisConfig, VisQueryResponse, VisualizationDefinition} from './types';
import {fromSheetsToD3Format} from './currency_formatter';

export const formatType = (valueFormat: string) => {
  const formattedData = fromSheetsToD3Format(valueFormat);
  return format(formattedData);
};

export const handleErrors = (
  vis: VisualizationDefinition,
  res: VisQueryResponse,
  options: VisConfig
) => {
  const check = (
    group: string,
    noun: string,
    count: number,
    min: number,
    max: number
  ): boolean => {
    if (!vis.addError || !vis.clearErrors) return false;
    if (count < min) {
      vis.addError({
        title: `Not Enough ${noun}s`,
        message: `This visualization requires ${
          min === max ? 'exactly' : 'at least'
        } ${min} ${noun.toLowerCase()}${min === 1 ? '' : 's'}.`,
        group,
      });
      return false;
    }
    if (count > max) {
      vis.addError({
        title: `Too Many ${noun}s`,
        message: `This visualization requires ${
          min === max ? 'exactly' : 'no more than'
        } ${max} ${noun.toLowerCase()}${min === 1 ? '' : 's'}.`,
        group,
      });
      return false;
    }
    vis.clearErrors(group);
    return true;
  };

  const {pivots, dimensions, measure_like: measures} = res.fields;

  return (
    check(
      'pivot-req',
      'Pivot',
      pivots.length,
      options.min_pivots,
      options.max_pivots
    ) &&
    check(
      'dim-req',
      'Dimension',
      dimensions.length,
      options.min_dimensions,
      options.max_dimensions
    ) &&
    check(
      'mes-req',
      'Measure',
      measures.length,
      options.min_measures,
      options.max_measures
    )
  );
};
