import Loadable from 'react-loadable';

const LoadableCharts = Loadable({
  loader: () => import('../lazy_loadable/proCharts.js'),
  loading: () => {},
});

export const charts = new LoadableCharts();
