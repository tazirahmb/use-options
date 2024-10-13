import { fromJS } from 'immutable';

function useAsyncOptions({
  client,
  query,
  key = { value: ['_id'], label: ['title'] },
  option = {},
}) {
  const { queryOptions = {}, isForFilter = false } = option;

  let timeoutId;
  return new Promise((resolve) => {
    clearTimeout(timeoutId);

    // eslint-disable-next-line consistent-return
    timeoutId = setTimeout(async () => {
      const {
        data: queryData,
        error,
        loading,
      } = await client.query({
        query,
        fetchPolicy: 'network-only',
        ...queryOptions,
      });

      if (error || loading) return [];

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
            label: 'All',
          });
        }

        return options;
      }

      resolve(convertToOptions(data));
    }, 500);
  }).catch((e) => {
    console.error(e);
  });
}

export default useAsyncOptions;
