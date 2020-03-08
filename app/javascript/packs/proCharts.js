import Loadable from 'react-loadable';

const loadableReactionsChart = Loadable({
  loader: () => import('../chartComponents.js').commentsChartComponent,
  loading: () => <div>Loading...</div>,
});

const loadableCommentsChart = Loadable({
  loader: () => import('../chartComponents.js').reactionsChartComponent,
  loading: () => <div>Loading...</div>,
});

export const reactionsChart = new loadableReactionsChart();

export const commentsChart = new loadableCommentsChart();
