import { useQuery } from '@apollo/client';
import { fromJS } from 'immutable';

export default function useOptions(query, key, option = {}) {
  const { queryOptions = {}, isForFilter = false } = option;

  const {
    data: queryData,
    error,
    loading,
  } = useQuery(query, {
    ...queryOptions,
  });

  let options = [];

  if (error || loading) 
    return options;
  

  const { data } = queryData[Object.keys(queryData)[0]];

  function convertToOptions(_data) {
    const options = fromJS(_data)
      .map((__data) => {
        let opt = {};

        Object.keys(key).forEach((k) => {
          opt = {
            ...opt,
            [k]: __data.getIn(key[k]),
          };
        });

        return opt;
      })
      .toJS();

    if (isForFilter) {
      options.unshift({
        value: '',
        label: '-All-',
      });
    }

    return options;
  }

  options = convertToOptions(data);

  return options;
}

useOptions.defaultProps = {
  key: { value: ['_id'], label: ['title'] },
};
